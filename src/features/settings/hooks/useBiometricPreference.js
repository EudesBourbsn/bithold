import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import { useT } from '../../../i18n/index';

export function useBiometricPreference({
  visible,
  engine,
  lock,
  hasPasscode,
  enabled,
}) {
  const t = useT();
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const [biometry, setBiometry] = useState(null);
  const [biometryBusy, setBiometryBusy] = useState(false);
  const biometryPending = useRef(false);
  const biometryRevision = useRef(0);
  const settingsVisible = useRef(visible);
  settingsVisible.current = visible;
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'background') {
        biometryRevision.current += 1;
      }
    });
    return () => {
      biometryRevision.current += 1;
      subscription.remove();
    };
  }, [visible]);
  const faceIdOn = !!enabled && biometry?.available !== false;
  useEffect(() => {
    if (visible) {
      engine
        .biometry()
        .then(value => mounted.current && setBiometry(value))
        .catch(() => {});
    }
  }, [visible, engine]);
  const biometryTitleKey =
    biometry?.type === 'touchID'
      ? 'settings.row.touchId'
      : biometry?.type === 'none'
      ? 'settings.row.biometricLock'
      : 'settings.row.faceId';
  const showBiometrySettings = () => {
    Alert.alert(
      t('settings.faceIdAllowTitle'),
      t('settings.faceIdAllowMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('scanner.openSettings'),
          onPress: () => Linking.openSettings().catch(() => {}),
        },
      ],
    );
  };
  const toggleFaceId = async next => {
    if (!hasPasscode || biometryPending.current || !settingsVisible.current) {
      return;
    }
    biometryPending.current = true;
    setBiometryBusy(true);
    const revision = ++biometryRevision.current;
    const generation = engine.generation;
    const passcode = engine.state.security?.passcode;
    const isCurrent = () =>
      mounted.current &&
      settingsVisible.current &&
      revision === biometryRevision.current &&
      generation === engine.generation &&
      passcode === engine.state.security?.passcode;
    try {
      if (next) {
        const available = await engine.biometry();
        if (!isCurrent()) {
          return;
        }
        setBiometry(available);
        if (!available?.available) {
          showBiometrySettings();
          return;
        }
        await engine.authenticateFaceId(t('lock.faceIdReason'));
        if (!isCurrent()) {
          return;
        }
        const verified = await engine.biometry();
        if (!isCurrent()) {
          return;
        }
        setBiometry(verified);
        if (!verified?.available) {
          showBiometrySettings();
          return;
        }
        await engine.setFaceId(true, verified.domainState);
      } else {
        await lock.requireUnlock({ reason: 'faceId' });
        if (isCurrent()) {
          await engine.setFaceId(false);
        }
      }
    } catch (error) {
      if (isCurrent() && error?.code !== 'cancelled') {
        if (error?.code === 'notAvailable') {
          showBiometrySettings();
        } else {
          Alert.alert(t(biometryTitleKey), error.message);
        }
      }
    } finally {
      biometryPending.current = false;
      if (mounted.current) {
        setBiometryBusy(false);
      }
    }
  };

  return {
    value: faceIdOn,
    busy: biometryBusy,
    titleKey: biometryTitleKey,
    change: toggleFaceId,
  };
}
