export async function importNativeDraft({
  lock,
  isCurrent,
  isMounted,
  readSnapshot,
  prepare = async () => undefined,
  commit,
  onSuccess,
  onError,
  onBusy,
}) {
  if (lock.current || !isCurrent()) {
    return false;
  }
  lock.current = true;
  onBusy(true);
  try {
    const material = await readSnapshot();
    if (!isCurrent()) {
      return false;
    }
    const prepared = await prepare();
    if (prepared === null || !isCurrent()) {
      return false;
    }
    await commit(material, prepared);
    if (isCurrent()) {
      onSuccess();
    }
    return true;
  } catch (error) {
    if (isCurrent()) {
      onError(error);
    }
    return false;
  } finally {
    lock.current = false;
    if (isMounted()) {
      onBusy(false);
    }
  }
}

export function acceptsNativeInput(event, revision) {
  return event.revision >= revision;
}
export function releaseAcknowledgedReplacement(pending, event) {
  return pending?.revision === event.revision ? null : pending;
}
