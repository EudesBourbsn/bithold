import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import { useT } from '../../../i18n/index';
import { allowsNotifications } from '../../../services/notificationPermission';

export function useNotificationPreference({ visible, enabled, engine }) {
  const t = useT();
  const translate = useRef(t);
  translate.current = t;
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const active = useRef(visible);
  active.current = visible;
  const revision = useRef(0);
  const enableAfterSettings = useRef(false);

  const refresh = useCallback(async () => {
    if (locked.current || !active.current) {
      return;
    }
    const request = ++revision.current;
    try {
      const next = await engine.native.getNotificationPermission();
      if (!active.current || request !== revision.current) {
        return;
      }
      setStatus(next);
      if (enableAfterSettings.current && allowsNotifications(next)) {
        enableAfterSettings.current = false;
        locked.current = true;
        setBusy(true);
        try {
          await engine.preference('notifications', true);
        } catch {
          if (active.current) {
            Alert.alert(
              translate.current('settings.row.notifications'),
              translate.current('settings.notificationsFailed'),
            );
          }
        } finally {
          const latestRequest = ++revision.current;
          try {
            if (active.current) {
              const latest = await engine.native.getNotificationPermission();
              if (active.current && latestRequest === revision.current) {
                setStatus(latest);
              }
            }
          } catch {
            if (active.current && latestRequest === revision.current) {
              setStatus(null);
            }
          } finally {
            locked.current = false;
            if (active.current) {
              setBusy(false);
              if (latestRequest !== revision.current) {
                refresh();
              }
            }
          }
        }
      }
    } catch {
      if (active.current && request === revision.current) {
        setStatus(null);
      }
    }
  }, [engine]);

  useEffect(() => {
    active.current = visible;
    if (!visible) {
      enableAfterSettings.current = false;
      setStatus(null);
      return;
    }
    setBusy(locked.current);
    refresh();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => {
      active.current = false;
      revision.current += 1;
      subscription.remove();
    };
  }, [visible, refresh]);

  const change = async next => {
    if (locked.current || !active.current) {
      return;
    }
    locked.current = true;
    revision.current += 1;
    setBusy(true);
    enableAfterSettings.current = false;
    try {
      if (next) {
        const current = await engine.native.getNotificationPermission();
        if (!active.current) {
          return;
        }
        setStatus(current);
        if (current === 'denied') {
          Alert.alert(
            t('settings.row.notifications'),
            t('settings.notificationsDenied'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('settings.notificationsOpenSettings'),
                onPress: () => {
                  if (!active.current) {
                    return;
                  }
                  enableAfterSettings.current = true;
                  Linking.openSettings().catch(() => {
                    enableAfterSettings.current = false;
                    if (active.current) {
                      Alert.alert(
                        t('settings.row.notifications'),
                        t('settings.notificationsFailed'),
                      );
                    }
                  });
                },
              },
            ],
          );
          return;
        }
      }
      await engine.preference('notifications', next);
      const current = await engine.native.getNotificationPermission();
      if (active.current) {
        setStatus(current);
      }
    } catch (error) {
      if (active.current) {
        if (error.code === 'notification_denied') {
          setStatus('denied');
        } else {
          Alert.alert(
            t('settings.row.notifications'),
            t('settings.notificationsFailed'),
          );
        }
      }
    } finally {
      locked.current = false;
      if (active.current) {
        setBusy(false);
      }
    }
  };

  return {
    value: Boolean(enabled && allowsNotifications(status)),
    busy,
    change,
  };
}
