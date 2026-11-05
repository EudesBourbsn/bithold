export function phraseScrollPosition({
  top,
  height,
  viewportHeight,
  offset,
  contentHeight,
}) {
  if (
    ![top, height, viewportHeight, offset, contentHeight].every(
      Number.isFinite,
    ) ||
    viewportHeight <= 0
  ) {
    return null;
  }
  const bottom = top + height;
  let target = offset;
  if (bottom > offset + viewportHeight + 0.5) {
    target = bottom - viewportHeight;
  } else if (height <= viewportHeight && top < offset - 0.5) {
    target = top;
  } else {
    return null;
  }
  target = Math.max(
    0,
    Math.min(target, Math.max(0, contentHeight - viewportHeight)),
  );
  return Math.abs(target - offset) > 0.5 ? target : null;
}
