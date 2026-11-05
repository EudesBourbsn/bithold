const messages = new Set([
  'unsupported',
  'prfUnsupported',
  'accountUnavailable',
  'accountChanged',
  'quotaExceeded',
  'network',
  'invalidPayload',
  'duplicate',
  'interrupted',
  'watchOnly',
  'busy',
]);

const referencePattern =
  /^BHCB:(configuration|account|payload|presentation|registration|assertion|encryption|upload|download|verification|listing|restoration):(authorization|cloudkit|passkey|storage|crypto|cryptokit|app|unknown):[0-9]{1,6}$/;

export function cloudBackupErrorMessage(t, error) {
  const code = String(error?.code ?? '').replace(/^cloud\./, '');
  const message = t(`cloud.${messages.has(code) ? code : 'failed'}`);
  const reference = typeof error?.message === 'string' ? error.message : '';
  return referencePattern.test(reference)
    ? `${message}\n\n${reference}`
    : message;
}
