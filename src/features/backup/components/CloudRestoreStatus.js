import { Text, TouchableOpacity, View } from 'react-native';
import { impactFeedback } from '../../../services/feedback';
import { styles } from '../styles/CloudRestoreSheet.styles.js';
import { RestoreStatusIcon } from './RestoreStatusIcon';

export function RestoreActionButton({ label, onPress, pill = false }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        impactFeedback();
        onPress();
      }}
      style={[styles.button, pill && styles.pill]}
    >
      <Text
        allowFontScaling={false}
        style={[styles.buttonLabel, pill && styles.pillLabel]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function CloudRestoreStatus({
  symbol,
  title,
  subtitle,
  subtitleStyle,
  footer,
  layout,
}) {
  const sheet = layout === 'sheet',
    error = layout === 'error';
  return (
    <View style={styles.status}>
      <View style={styles.plate}>
        <RestoreStatusIcon symbol={symbol} />
      </View>
      <View
        style={[
          styles.statusText,
          sheet && styles.sheetText,
          error && styles.errorText,
        ]}
      >
        <Text
          accessibilityRole="header"
          allowFontScaling={false}
          style={[styles.statusTitle, error && styles.errorTitle]}
        >
          {title}
        </Text>
        {(sheet || error) && !!subtitle && (
          <Text
            allowFontScaling={false}
            style={[styles.blockSubtitle, error && styles.errorSubtitle]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {!sheet && !error && !!subtitle && (
        <Text
          allowFontScaling={false}
          style={[styles.statusSubtitle, subtitleStyle]}
        >
          {subtitle}
        </Text>
      )}
      <View
        style={[
          styles.footer,
          sheet && styles.sheetFooter,
          error && styles.errorFooter,
        ]}
      >
        {footer}
      </View>
    </View>
  );
}
