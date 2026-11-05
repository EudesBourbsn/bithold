import { StyleSheet, Text } from 'react-native';
import { useT } from '../../../i18n';
import { welcomePalette } from '../theme/welcomeLayout';
import { fonts } from '../../../theme/fonts';

export function WelcomeTerms() {
  const t = useT();
  return (
    <Text style={styles.body}>
      {t('onboarding.welcome.termsIntro')}{' '}
      <Text style={styles.link}>{t('onboarding.welcome.termsOfService')}</Text>{' '}
      {t('onboarding.welcome.termsAnd')}{' '}
      <Text style={styles.link}>{t('onboarding.welcome.privacyPolicy')}</Text>.
    </Text>
  );
}

const styles = StyleSheet.create({
  body: {
    ...fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: welcomePalette.terms,
  },
  link: { color: welcomePalette.text },
});
