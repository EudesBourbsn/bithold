export const allowsNotifications = status =>
  ['authorized', 'provisional', 'ephemeral'].includes(status);
