import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Alert, AppState, Keyboard, Platform } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { navigationRef } from '../../../app/navigation/navigationRef';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useT } from '../../../i18n/index';
import { CreatePasscodeScreen } from '../screens/CreatePasscodeScreen';
import { LockScreen } from '../screens/LockScreen';

const LockContext = createContext(null);

export const cancelledUnlock = () =>
  Object.assign(new Error('Unlock cancelled'), { code: 'cancelled' });

// On iOS the lock is hosted in a full-window overlay, which UIKit draws above
// every presented view controller, so it also covers the nested sheets that
// SheetHost presents as native modals and the alerts they show.
const LockHost =
  Platform.OS === 'ios'
    ? ({ children }) => (
        <FullWindowOverlay unstable_accessibilityContainerViewIsModal>
          {children}
        </FullWindowOverlay>
      )
    : React.Fragment;

const ALWAYS_ASK = new Set(['removePasscode', 'reset']);
export function LockProvider({ children }) {
  const t = useT();
  const { ready, security, preferences, engine, clearWallets } = useWallets();
  const hasPasscode = !!security?.passcode;
  // True once the user has unlocked this foreground session, or created the
  // passcode in it; false again when the app is backgrounded and locks.
  const [session, setSession] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [request, setRequest] = useState(null);
  const launchLocked = ready && hasPasscode && !session;
  const requestRef = useRef(null);
  requestRef.current = request;
  const sessionRef = useRef(session);
  sessionRef.current = session;
  useEffect(() => {
    if (!ready) {
      return;
    }
    engine.setActive(!launchLocked).catch(() => {});
  }, [ready, launchLocked, engine]);
  useEffect(() => {
    const lock = () => {
      Keyboard.dismiss();
      setSession(false);
      sessionRef.current = false;
      setGeneration(value => value + 1);
      const pending = requestRef.current;
      if (pending) {
        requestRef.current = null;
        setRequest(null);
        pending.reject(cancelledUnlock());
      }
    };
    let postponed = 0;
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'background') {
        engine.setActive(false).catch(() => {});
        if (!engine.hasPasscode() || !sessionRef.current) {
          return;
        }
        if (engine.security.withinSendGrace()) {
          postponed = engine.security.sendGraceEnds();
        } else {
          postponed = 0;
          lock();
        }
      } else if (state === 'active') {
        if (postponed && engine.hasPasscode() && Date.now() > postponed) {
          lock();
        }
        postponed = 0;
        if (!engine.hasPasscode() || sessionRef.current) {
          engine.setActive(true).catch(() => {});
        }
      }
    });
    return () => subscription.remove();
  }, [engine]);
  // One unlock per foreground session (the app locks again in the
  // background): inside it nothing asks again, except proving the passcode
  // to remove it and erasing every wallet.
  const requireUnlock = useCallback(
    (options = {}) =>
      new Promise((resolve, reject) => {
        if (!engine.hasPasscode()) {
          resolve(false);
          return;
        }
        if (sessionRef.current && !ALWAYS_ASK.has(options.reason)) {
          resolve(true);
          return;
        }
        requestRef.current?.reject(cancelledUnlock());
        Keyboard.dismiss();
        const next = { ...options, resolve, reject };
        requestRef.current = next;
        setRequest(next);
      }),
    [engine],
  );
  // Creating the passcode counts as this session's unlock, so the lock does
  // not come up right behind the settings sheet.
  const setPasscode = useCallback(
    async code => {
      setSession(true);
      await engine.setPasscode(code);
    },
    [engine],
  );
  const [creating, setCreating] = useState(null);
  const creatingRef = useRef(null);
  const createPasscode = useCallback(
    () =>
      new Promise(resolve => {
        Keyboard.dismiss();
        creatingRef.current = { resolve };
        setCreating(creatingRef.current);
      }),
    [],
  );
  const finishCreating = useCallback(outcome => {
    const pending = creatingRef.current;
    creatingRef.current = null;
    setCreating(null);
    pending?.resolve(outcome);
  }, []);
  const unlocked = useCallback(() => {
    setSession(true);
    const pending = requestRef.current;
    requestRef.current = null;
    setRequest(null);
    pending?.resolve(true);
  }, []);
  const cancel = useCallback(() => {
    const pending = requestRef.current;
    requestRef.current = null;
    setRequest(null);
    pending?.reject(cancelledUnlock());
  }, []);
  const forgot = () => {
    Alert.alert(t('lock.forgotTitle'), t('lock.forgotMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('lock.eraseAndRestore'),
        style: 'destructive',
        onPress: async () => {
          try {
            await clearWallets({ force: true });
            setSession(true);
            if (navigationRef.isReady()) {
              navigationRef.resetRoot({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            }
          } catch (error) {
            Alert.alert(t('balance.resetFailed'), error.message);
          }
        },
      },
    ]);
  };
  const locked = launchLocked || !!request;
  return (
    <LockContext.Provider
      value={{ requireUnlock, setPasscode, createPasscode, hasPasscode }}
    >
      {children}
      {creating && (
        <LockHost key="create-passcode">
          <CreatePasscodeScreen
            onCreate={setPasscode}
            onCreated={() => finishCreating('created')}
            onCancel={() => finishCreating('cancelled')}
          />
        </LockHost>
      )}
      {locked && (
        <LockHost
          key={
            launchLocked
              ? `launch-${generation}`
              : `request-${request?.reason ?? ''}`
          }
        >
          <LockScreen
            faceId={!!preferences.faceId}
            coldStart={launchLocked && generation === 0}
            passcodeOnly={request?.passcodeOnly === true}
            allowCancel={!launchLocked}
            onCancel={cancel}
            onUnlocked={unlocked}
            onForgot={forgot}
          />
        </LockHost>
      )}
    </LockContext.Provider>
  );
}

export function useLock() {
  return useContext(LockContext);
}
