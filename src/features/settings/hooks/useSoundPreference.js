import { useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { useT } from '../../../i18n/index';
import { playSound } from '../../../services/sound';

export function useSoundPreference({ visible, enabled, engine }) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(true);
  const active = useRef(visible);
  const value = useRef(enabled);
  const revision = useRef(0);
  active.current = visible;
  value.current = enabled;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    revision.current += 1;
  }, [visible]);

  const change = async next => {
    if (pending.current || !active.current || next === value.current) {
      return;
    }
    const request = revision.current;
    pending.current = true;
    setBusy(true);
    try {
      await engine.preference('sounds', next);
      value.current = next;
      if (
        next &&
        mounted.current &&
        active.current &&
        revision.current === request &&
        AppState.currentState === 'active'
      ) {
        playSound('receive', { preview: true });
      }
    } catch (error) {
      if (mounted.current && active.current) {
        Alert.alert(
          t('settings.row.sounds'),
          error?.message ?? t('error.operationFailed'),
        );
      }
    } finally {
      pending.current = false;
      if (mounted.current) {
        setBusy(false);
      }
    }
  };

  return { busy, change };
}
