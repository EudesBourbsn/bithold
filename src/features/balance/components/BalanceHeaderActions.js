import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Icon } from '../../../components/icons/Icon';
import { useT } from '../../../i18n/index';
import { TransactionGlass } from '../../activity/components/TransactionGlass';

const SIZE = 40;
const RADIUS = 20;
const layoutTransition = LinearTransition.springify()
  .damping(15)
  .stiffness(100);

function GlassButton({ motionRef, label, onPress, animated, children }) {
  return (
    <Animated.View
      ref={motionRef}
      collapsable={false}
      layout={animated ? layoutTransition : undefined}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={label}
        activeOpacity={0.2}
        onPress={onPress}
      >
        <View style={styles.button}>
          <TransactionGlass
            width={SIZE}
            height={SIZE}
            radius={RADIUS}
            glowTop={0.4}
            glowBottom={0.3}
          />
          {children}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function BalanceHeaderActions({
  onActivity,
  onSettings,
  animated,
  activityRef,
  settingsRef,
}) {
  const t = useT();
  return (
    <>
      <GlassButton
        animated={animated}
        motionRef={activityRef}
        label={t('activity.title')}
        onPress={onActivity}
      >
        <Icon name="history" size={22} />
      </GlassButton>
      <GlassButton
        animated={animated}
        motionRef={settingsRef}
        label={t('settings.title')}
        onPress={onSettings}
      >
        <Icon name="settings" size={24} />
      </GlassButton>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    marginLeft: 5,
    borderRadius: RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
