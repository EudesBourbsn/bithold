import { StyleSheet, View } from 'react-native';
import { useT } from '../../../i18n';
import { WelcomeEntrance } from './WelcomeEntrance';
import { WelcomeOptionCard } from './WelcomeOptionCard';
import { ChainMarks, OptionArrow } from './WelcomeOptionIcons';
import { welcomeLayout } from '../theme/welcomeLayout';

export function WelcomeOptions({
  handoff,
  onCreate,
  onImport,
  creating,
  importing,
}) {
  const t = useT();
  return (
    <WelcomeEntrance handoff={handoff} index={0}>
      <View style={styles.cards}>
        <WelcomeOptionCard
          title={t('onboarding.welcome.recoveryPhrase')}
          description={t('onboarding.welcome.recoveryDescription')}
          accessory={<ChainMarks />}
          onPress={onCreate}
          disabled={creating}
        />
        {/* The Manage wallets sheet's Import wallet row; opens Import with. */}
        <WelcomeOptionCard
          title={t('onboarding.import')}
          description={t('onboarding.welcome.importDescription')}
          accessory={<OptionArrow />}
          onPress={onImport}
          disabled={importing}
        />
      </View>
    </WelcomeEntrance>
  );
}

const styles = StyleSheet.create({
  cards: { gap: welcomeLayout.cardGap },
});
