export const sendCompletionMotion = Object.freeze({
  sheetExit: Object.freeze({ stiffness: 950, damping: 105, mass: 4 }),
  barSpring: Object.freeze({
    damping: 17,
    stiffness: 170,
    restSpeedThreshold: 0.01,
    restDisplacementThreshold: 0.01,
  }),
  successDuration: 3000,
  height: 48,
  radius: 24,
  maximumWidthFraction: 0.8,
  contentWidthReservation: 96,
  horizontalPadding: 20,
  gap: 5,
  indicatorSize: 24,
});
