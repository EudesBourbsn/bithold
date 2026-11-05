import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { t } from '../../i18n/core.js';

export const PASSCODE_LENGTH = 6;
export const LOCKOUT_ATTEMPTS = 4;
export const LOCKOUT_MS = 120000;
export const SEND_GRACE_MS = 30000;
const ITERATIONS = 20000;
const EMPTY = Object.freeze({
  passcode: null,
  attempts: 0,
  lockRemaining: 0,
  biometryDomain: null,
});

const HEX = /^[0-9a-f]+$/i;
// A stored passcode record is only used when it is whole; a damaged one would
// otherwise count every entry as a wrong attempt.
function passcodeRecord(value) {
  return value &&
    typeof value === 'object' &&
    typeof value.salt === 'string' &&
    HEX.test(value.salt) &&
    typeof value.hash === 'string' &&
    HEX.test(value.hash) &&
    Number.isInteger(value.iterations) &&
    value.iterations > 0
    ? value
    : null;
}

export function securityState(data) {
  const passcode = passcodeRecord(data?.passcode);
  return passcode
    ? {
        passcode,
        attempts: Number.isInteger(data.attempts) ? data.attempts : 0,
        // Earlier versions kept a deadline; what was left of it carries over.
        lockRemaining: Number.isFinite(data.lockRemaining)
          ? data.lockRemaining
          : Number.isFinite(data.lockedUntil)
          ? Math.max(0, data.lockedUntil - Date.now())
          : 0,
        biometryDomain:
          typeof data.biometryDomain === 'string' ? data.biometryDomain : null,
      }
    : null;
}

export class WalletSecurity {
  constructor(engine) {
    this.engine = engine;
    this.lastSend = 0;
  }
  get state() {
    return this.engine.state.security ?? EMPTY;
  }
  hasPasscode() {
    return !!this.state.passcode;
  }
  // Milliseconds left of a keypad lockout, 0 when none.
  lockout() {
    return Math.max(0, this.state.lockRemaining ?? 0);
  }
  // The lock screen's one-second tick; saved without a re-render.
  async tickLockout(elapsed) {
    const engine = this.engine;
    const left = Math.max(0, this.lockout() - elapsed);
    engine.state.security = { ...this.state, lockRemaining: left };
    await engine.save();
    return left;
  }
  async update(changes) {
    const engine = this.engine;
    engine.state.security = { ...this.state, ...changes };
    await engine.save();
    engine.emit();
  }
  // Derived asynchronously so the keypad's busy state renders first.
  async digest(code, salt, iterations = ITERATIONS) {
    const key = await pbkdf2Async(sha256, code, hexToBytes(salt), {
      c: iterations,
      dkLen: 32,
    });
    return bytesToHex(key);
  }
  validate(code) {
    if (!new RegExp(`^\\d{${PASSCODE_LENGTH}}$`).test(String(code ?? ''))) {
      throw new Error(t('lock.invalidPasscode'));
    }
  }
  async setPasscode(code) {
    this.validate(code);
    const salt = await this.engine.native.randomBytes(16);
    const hash = await this.digest(code, salt);
    await this.update({
      passcode: { salt, hash, iterations: ITERATIONS },
      attempts: 0,
      lockRemaining: 0,
    });
  }
  async verifyPasscode(code) {
    const remaining = this.lockout();
    if (remaining) {
      throw Object.assign(new Error(t('lock.lockedOut')), {
        code: 'lockout',
        remaining,
      });
    }
    const stored = this.state.passcode;
    if (!stored) {
      throw new Error(t('lock.noPasscode'));
    }
    const hash = await this.digest(
      String(code ?? ''),
      stored.salt,
      stored.iterations,
    );
    if (hash !== stored.hash) {
      const attempts = (this.state.attempts ?? 0) + 1;
      // The 4th starts the lockout and the count over (no escalation).
      const lockout = attempts >= LOCKOUT_ATTEMPTS;
      await this.update({
        attempts: lockout ? 0 : attempts,
        lockRemaining: lockout ? LOCKOUT_MS : 0,
      });
      throw Object.assign(new Error(t('lock.wrongPasscode')), {
        code: 'wrong',
        attempts,
        remaining: lockout ? LOCKOUT_MS : 0,
      });
    }
    if (this.state.attempts || this.state.lockRemaining) {
      await this.update({ attempts: 0, lockRemaining: 0 });
    }
    return true;
  }
  async clearAttempts() {
    if (this.state.attempts) {
      await this.update({ attempts: 0 });
    }
  }
  // The caller has verified the passcode. Removing it removes the Face ID
  // lock too, as it is only a way to enter the passcode.
  async removePasscode() {
    const engine = this.engine;
    engine.state.security = null;
    engine.state.preferences = { ...engine.state.preferences, faceId: false };
    await engine.save();
    engine.emit();
  }
  async setFaceId(enabled, domainState = null) {
    const engine = this.engine;
    engine.state.preferences = { ...engine.state.preferences, faceId: enabled };
    engine.state.security = {
      ...this.state,
      biometryDomain: enabled ? domainState ?? null : null,
    };
    await engine.save();
    engine.emit();
  }
  biometry() {
    return this.engine.native.biometry();
  }
  authenticateFaceId(reason) {
    return this.engine.native.authenticateBiometrics(reason);
  }
  // True when the enrolled faces or fingers changed since Face ID was enabled.
  enrolmentChanged(domainState) {
    const stored = this.state.biometryDomain;
    return !!stored && !!domainState && stored !== domainState;
  }
  noteSend() {
    this.lastSend = Date.now();
  }
  withinSendGrace(now = Date.now()) {
    return now < this.sendGraceEnds();
  }
  // When the lock the send postponed takes effect (lockActivatesAt).
  sendGraceEnds() {
    return this.lastSend + SEND_GRACE_MS;
  }
}
