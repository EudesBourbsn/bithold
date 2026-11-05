import { inputProps as sharedInputProps } from '../../../theme/inputTheme';
import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useT } from '../../../i18n/index';
import { DiscIllustration } from '../../backup/components/DiscIllustration';
import { styles } from '../styles/TransactionDetailsStep.styles.js';

export function NoteEntry({
  title,
  placeholder,
  initial = '',
  normalize = value => value,
  onSubmit,
  inputProps,
}) {
  const t = useT();
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );
  const next = normalize(value);
  const ready = next !== normalize(initial) && next !== null;
  const submit = async () => {
    if (saving || !ready) {
      return;
    }
    setSaving(true);
    try {
      await onSubmit(next);
      Keyboard.dismiss();
    } catch {
      Alert.alert(t('error.somethingWrong'), t('error.tryAgain'));
    } finally {
      if (mounted.current) {
        setSaving(false);
      }
    }
  };
  return (
    <View style={styles.noteBody}>
      <DiscIllustration glyph="pencil" />
      <Text accessibilityRole="header" style={styles.noteTitle}>
        {title}
      </Text>
      <View style={styles.noteSection}>
        <View style={styles.noteInputBox}>
          <TextInput
            {...sharedInputProps}
            accessibilityLabel={title}
            autoFocus
            value={value}
            onChangeText={setValue}
            onSubmitEditing={submit}
            placeholder={placeholder}
            returnKeyType="done"
            style={styles.noteInput}
            {...inputProps}
          />
        </View>
        <PrimaryButton
          label={t('common.confirm')}
          disabled={!ready || saving}
          onPress={submit}
          style={styles.noteConfirm}
        />
      </View>
    </View>
  );
}
