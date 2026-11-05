export function transactionTooltipPath(
  width,
  bodyHeight,
  triangleOffset = 0,
  radius = 20,
) {
  const diagonal = Math.hypot(5, 5);
  const tip = (5 * Math.min(2, 0.9 * diagonal)) / diagonal;
  const baseRadius = Math.min(3, 0.9 * diagonal);
  const base = (5 * baseRadius) / diagonal;
  const center = Math.max(
    radius + 5 + baseRadius,
    Math.min(width - radius - 5 - baseRadius, width / 2 - triangleOffset),
  );
  return `M ${radius} 0 L ${
    width - radius
  } 0 A ${radius} ${radius} 0 0 1 ${width} ${radius} L ${width} ${
    bodyHeight - radius
  } A ${radius} ${radius} 0 0 1 ${width - radius} ${bodyHeight} L ${
    center + 5 + baseRadius
  } ${bodyHeight} Q ${center + 5} ${bodyHeight} ${center + 5 - base} ${
    bodyHeight + base
  } L ${center + tip} ${bodyHeight + 5 - tip} Q ${center} ${bodyHeight + 5} ${
    center - tip
  } ${bodyHeight + 5 - tip} L ${center - 5 + base} ${bodyHeight + base} Q ${
    center - 5
  } ${bodyHeight} ${
    center - 5 - baseRadius
  } ${bodyHeight} L ${radius} ${bodyHeight} A ${radius} ${radius} 0 0 1 0 ${
    bodyHeight - radius
  } L 0 ${radius} A ${radius} ${radius} 0 0 1 ${radius} 0 Z`;
}
