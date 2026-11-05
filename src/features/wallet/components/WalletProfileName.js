import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Alert, TextInput } from 'react-native';
import { useT } from '../../../i18n/index';
import { colors } from '../../../theme/index';
import { styles } from '../styles/WalletSettingsSheet.styles';

export const WalletProfileName = forwardRef(function WalletProfileName(
  { value, editable, onSave },
  ref,
) {
  const t = useT();
  const [name, setName] = useState(value);
  const [saving, setSaving] = useState(false);
  const input = useRef(null);
  const draft = useRef(value);
  const focused = useRef(false);
  const pending = useRef(null);
  const mounted = useRef(true);
  const latest = useRef(null);
  latest.current = { value, editable, onSave, t };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!focused.current && !pending.current) {
      draft.current = value;
      setName(value);
    }
  }, [value]);

  const finishEditing = useCallback(() => {
    const wasFocused = focused.current;
    focused.current = false;
    input.current?.blur();
    if (pending.current) return pending.current;
    if (!wasFocused || !mounted.current) return Promise.resolve(true);
    const previous = latest.current.value;
    const next = draft.current.trim();
    if (!next || next === previous) {
      draft.current = previous;
      setName(previous);
      return Promise.resolve(true);
    }
    draft.current = next;
    setName(next);
    setSaving(true);
    let operation;
    try {
      operation = latest.current.onSave(next);
    } catch (error) {
      operation = Promise.reject(error);
    }
    pending.current = Promise.resolve(operation)
      .then(() => true)
      .catch(() => {
        if (mounted.current) {
          draft.current = previous;
          setName(previous);
          if (latest.current.editable) {
            Alert.alert(
              latest.current.t('walletSettings.name'),
              latest.current.t('error.operationFailed'),
            );
          }
        }
        return false;
      })
      .finally(() => {
        pending.current = null;
        if (mounted.current) setSaving(false);
      });
    return pending.current;
  }, []);

  useImperativeHandle(ref, () => ({ finishEditing }), [finishEditing]);

  useEffect(() => {
    if (!editable) finishEditing();
  }, [editable, finishEditing]);

  return (
    <TextInput
      ref={input}
      accessibilityLabel={t('walletSettings.name')}
      value={name}
      editable={editable && !saving}
      onFocus={() => {
        focused.current = true;
      }}
      onChangeText={text => {
        draft.current = text;
        setName(text);
      }}
      onBlur={finishEditing}
      onSubmitEditing={finishEditing}
      maxLength={80}
      returnKeyType="done"
      submitBehavior="blurAndSubmit"
      keyboardAppearance="dark"
      autoCapitalize="words"
      autoCorrect={false}
      spellCheck={false}
      selectionColor={colors.button}
      cursorColor={colors.button}
      underlineColorAndroid="transparent"
      style={styles.profileName}
    />
  );
});
