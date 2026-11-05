import { validateMnemonic } from '@scure/bip39';
import vocabulary from '../data/recoveryWords.json';

const known = new Set(vocabulary);
const split = text => text.toLowerCase().trim().split(/\s+/).filter(Boolean);
export const isKnownWord = word => known.has(word.toLowerCase());
export const isOpaque = text =>
  /^(?:[xtyzuvYZUV]prv|[xtyzuvYZUV]pub|(?:wpkh|pkh|sh|wsh|tr|addr|raw)\(|bc1|tb1|bcrt1)/i.test(
    text.trim(),
  ) ||
  /^(?:[5KL][1-9A-HJ-NP-Za-km-z]{50,51}|[13][1-9A-HJ-NP-Za-km-z]{25,34}|[a-fA-F0-9]{64})$/.test(
    text.trim(),
  );

export class PhraseEditor {
  constructor() {
    this.nextId = 0;
    this.clear();
  }
  clear() {
    this.raw = '';
    this.words = [''];
    this.ids = [this.nextId++];
    this.active = 0;
    this.isPhrase = true;
    this.editing = false;
    this.resetSelection();
  }
  resetSelection() {
    this.selection = null;
  }
  get activeText() {
    return this.isPhrase ? this.words[this.active] : this.raw;
  }
  get hasContent() {
    return this.isPhrase ? this.words.some(Boolean) : !!this.raw;
  }
  get canContinue() {
    return this.isPhrase
      ? validateMnemonic(this.words.filter(Boolean).join(' '), vocabulary)
      : this.raw.trim().length > 0;
  }
  get invalidFragment() {
    return (
      !!this.activeText &&
      !vocabulary.some(word => word.startsWith(this.activeText.toLowerCase()))
    );
  }
  get completionPrefix() {
    const text = this.activeText,
      start = this.selection?.start ?? text.length,
      end = this.selection?.end ?? start;
    return start <= 0 || end < start || end > text.length || /\s/.test(text)
      ? ''
      : text.slice(0, start).toLowerCase();
  }
  get suggestions() {
    const prefix = this.completionPrefix;
    return this.isPhrase && /^[a-z]{1,8}$/.test(prefix)
      ? vocabulary.filter(word => word.startsWith(prefix)).slice(0, 3)
      : [];
  }
  get completionSuffix() {
    const text = this.activeText;
    if (
      (this.selection?.start ?? text.length) !== text.length ||
      (this.selection?.end ?? text.length) !== text.length
    ) {
      return '';
    }
    const prefix = this.completionPrefix;
    if (!this.isPhrase || !/^[a-z]{1,8}$/.test(prefix) || known.has(prefix)) {
      return '';
    }
    const matches = vocabulary
      .filter(word => word.startsWith(prefix))
      .slice(0, 2);
    return matches.length === 1 ? matches[0].slice(text.length) : '';
  }
  position(index) {
    return index + 1;
  }
  fromText(text) {
    if (text.trim().length > 16384) {
      return;
    }
    if (isOpaque(text)) {
      this.isPhrase = false;
      this.raw = text;
      this.words = [];
      this.ids = [];
      this.active = 0;
    } else {
      this.editing = false;
      const parts = split(text),
        trailing = /\s$/.test(text);
      if (
        parts.length > 1 ||
        (parts.length === 1 && trailing && known.has(parts[0]))
      ) {
        this.isPhrase = true;
        this.raw = '';
        this.words = parts;
        this.ids = parts.map(() => this.nextId++);
        if (trailing) {
          this.words.push('');
          this.ids.push(this.nextId++);
        }
        this.active = this.words.length - 1;
      } else {
        this.isPhrase = false;
        this.raw = text.trimStart();
        this.words = [];
        this.ids = [];
        this.active = 0;
      }
    }
    if (!this.isPhrase) {
      if (isOpaque(text)) {
        this.words = [this.raw];
        this.ids = [this.nextId++];
      } else {
        this.isPhrase = true;
        this.words = [this.raw];
        this.ids = [this.nextId++];
        this.raw = '';
      }
    }
    this.resetSelection();
  }
  finish() {
    if (!this.isPhrase) {
      return;
    }
    this.resume();
  }
  paste(text) {
    this.fromText(text.trim());
    if (this.isPhrase) {
      this.resume();
    }
  }
  focus(index) {
    if (!this.isPhrase || index < 0 || index >= this.words.length) {
      return;
    }
    if (
      index !== this.active &&
      !this.activeText &&
      this.active < this.words.length - 1
    ) {
      this.words.splice(this.active, 1);
      this.ids.splice(this.active, 1);
      if (this.active < index) {
        index--;
      }
    }
    this.active = index;
    this.editing = !!this.words[index];
    this.resetSelection();
  }
  resume() {
    if (!this.isPhrase) {
      return;
    }
    if (!this.hasContent) {
      this.clear();
      return;
    }
    if (!this.activeText && this.active < this.words.length - 1) {
      this.words.splice(this.active, 1);
      this.ids.splice(this.active, 1);
    }
    if (this.words.at(-1)) {
      this.words.push('');
      this.ids.push(this.nextId++);
    }
    this.active = this.words.length - 1;
    this.editing = false;
    this.resetSelection();
  }
  remove(index) {
    if (!this.isPhrase || index < 0 || index >= this.words.length) {
      return;
    }
    const wasActive = index === this.active;
    this.words.splice(index, 1);
    this.ids.splice(index, 1);
    if (!this.words.some(Boolean)) {
      this.clear();
      return;
    }
    if (index < this.active) {
      this.active--;
    }
    if (wasActive) {
      this.words.splice(index, 0, '');
      this.ids.splice(index, 0, this.nextId++);
      this.active = index;
      this.editing = false;
    }
    this.resetSelection();
  }
  choose(word) {
    if (
      !this.completionPrefix ||
      !known.has(word) ||
      !word.startsWith(this.completionPrefix)
    ) {
      return;
    }
    if (!this.isPhrase) {
      this.isPhrase = true;
      this.words = [''];
      this.ids = [this.nextId++];
      this.active = 0;
      this.raw = '';
    }
    this.words[this.active] = word;
    this.editing = false;
    if (this.words.at(-1)) {
      this.words.push('');
      this.ids.push(this.nextId++);
    }
    this.active = this.words.length - 1;
    this.resetSelection();
  }
  backspace() {
    if (!this.isPhrase || this.activeText || !this.active) {
      return;
    }
    this.words.splice(this.active, 1);
    this.ids.splice(this.active, 1);
    this.active--;
    this.editing = true;
    this.selection = { start: 0, end: this.activeText.length };
  }
  change(text) {
    if (!this.isPhrase) {
      this.fromText(text);
      return;
    }
    if (this.words.length === 1 && isOpaque(text)) {
      this.fromText(text);
      return;
    }
    if (this.words.length > 1 || /\s/.test(text)) {
      text = text.normalize('NFKD').toLowerCase();
    }
    if (!/\s/.test(text)) {
      if (this.words.length === 1 && !text) {
        this.clear();
        return;
      }
      this.words[this.active] = text;
      this.resetSelection();
      return;
    }
    const inserted = split(text);
    if (!inserted.length) {
      return;
    }
    const id = this.ids[this.active];
    this.words.splice(this.active, 1, ...inserted);
    this.ids.splice(
      this.active,
      1,
      ...inserted.map((_, i) => (i ? this.nextId++ : id)),
    );
    this.active += inserted.length - 1;
    if (/\s$/.test(text)) {
      if (this.words.at(-1)) {
        this.words.push('');
        this.ids.push(this.nextId++);
      }
      this.active = this.words.length - 1;
      this.editing = false;
    } else {
      this.editing = this.active < this.words.length - 1;
    }
    this.resetSelection();
  }
  submit(visible) {
    const suffix = visible === this.completionSuffix ? visible : '';
    const word = this.activeText.toLowerCase() + suffix;
    if (known.has(word) && this.completionPrefix) {
      this.choose(word);
    } else {
      this.change(this.activeText + ' ');
    }
  }
}
