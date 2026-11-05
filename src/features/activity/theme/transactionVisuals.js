export const transactionGlassTint = [
  'rgba(255, 255, 255, 0.05)',
  'rgba(255, 255, 255, 0.05)',
];

export const transactionGlassArc = 'white';
export const transactionOctagon =
  'M31.722.713l17.77 7.36a4.5 4.5 0 0 1 2.435 2.436l7.36 17.769a4.5 4.5 0 0 1 0 3.444l-7.36 17.77a4.5 4.5 0 0 1-2.436 2.435l-17.769 7.36a4.5 4.5 0 0 1-3.444 0l-17.77-7.36a4.5 4.5 0 0 1-2.435-2.436L.713 31.722a4.5 4.5 0 0 1 0-3.444l7.36-17.77a4.5 4.5 0 0 1 2.436-2.435L28.278.713a4.5 4.5 0 0 1 3.444 0z';

export function transactionGlassPath(width, height, radius) {
  if (![width, height, radius].every(Number.isFinite)) {
    return null;
  }
  const left = height / 2 === radius ? 0 : 1;
  const top = height < 60 ? 0.5 : 1;
  const points = [
    [radius, height + 1],
    [left, height + 1],
    [left, top],
    [width + 1, top],
    [width + 1, height / 2],
  ];
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const a = [points[i - 1][0] - x, points[i - 1][1] - y];
    const b = [points[i + 1][0] - x, points[i + 1][1] - y];
    const al = Math.hypot(...a),
      bl = Math.hypot(...b);
    const r = Math.min(radius, al, bl);
    if (r <= 0) {
      path += ` L ${x} ${y}`;
      continue;
    }
    const start = [x + (a[0] / al) * r, y + (a[1] / al) * r];
    const end = [x + (b[0] / bl) * r, y + (b[1] / bl) * r];
    const sweep = a[0] * b[1] - a[1] * b[0] < 0 ? 1 : 0;
    path += ` L ${start[0]} ${start[1]} A ${r} ${r} 0 0 ${sweep} ${end[0]} ${end[1]}`;
  }
  return path + ` L ${points.at(-1)[0]} ${points.at(-1)[1]}`;
}
