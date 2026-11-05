export const balanceNumberMotion = Object.freeze({
  duration: 600,
  delay: 70,
  framesPerSecond: 30,
  stepHeightRatio: 1.1,
});

export function numberSlots(text) {
  const chars = Array.from(text);
  const first = chars.findIndex(char => /[0-9]/.test(char));
  if (first < 0) {
    return [];
  }
  let last = chars.length - 1;
  while (!/[0-9]/.test(chars[last])) {
    last--;
  }
  const point = chars.indexOf('.', first);
  const integerEnd = point >= first && point <= last ? point : last + 1;
  let integerPlace = chars
    .slice(first, integerEnd)
    .filter(c => /[0-9]/.test(c)).length;
  let fractionPlace = 0;
  return chars.map((char, index) => {
    const digit = /[0-9]/.test(char);
    let key;
    if (index < first) {
      key = `prefix-${index}`;
    } else if (index > last) {
      key = `suffix-${index - last}`;
    } else if (digit) {
      key =
        index < integerEnd
          ? `integer-${--integerPlace}`
          : `fraction-${fractionPlace++}`;
    } else {
      key = char === '.' ? 'decimal' : `group-${integerPlace}`;
    }
    return { key, char, digit };
  });
}

export function digitPositions(previous, next, increasing, height) {
  const start = increasing ? previous : previous + 10;
  const distance = increasing
    ? (next - previous + 10) % 10
    : (previous - next + 10) % 10;
  return {
    from: -start * height,
    to: -(start + (increasing ? distance : -distance)) * height,
  };
}

export function numberProgress(progress) {
  'worklet';
  const frames =
    (balanceNumberMotion.duration * balanceNumberMotion.framesPerSecond) / 1000;
  const stepped =
    progress >= 1 ? 1 : Math.floor(Math.max(0, progress) * frames) / frames;
  return 1 - (1 - stepped) ** 3;
}

export function layoutNumber(text, widths, letterSpacing, availableWidth) {
  const slots = numberSlots(text);
  if (!slots.length || slots.some(slot => !widths[slot.char])) {
    return null;
  }
  const naturalWidth = slots.reduce(
    (sum, slot) => sum + widths[slot.char] + letterSpacing,
    0,
  );
  const scale = Math.min(1, availableWidth / naturalWidth);
  const width = naturalWidth * scale;
  let x = (availableWidth - width) / 2;
  return {
    scale,
    slots: slots.map(slot => {
      const advance = (widths[slot.char] + letterSpacing) * scale;
      const item = { ...slot, x, width: widths[slot.char] * scale };
      x += advance;
      return item;
    }),
  };
}
