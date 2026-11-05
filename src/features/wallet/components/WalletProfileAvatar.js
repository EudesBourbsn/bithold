import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { RecoveryGlass } from '../../backup/components/RecoveryGlass';
import { getWalletEmoji, profileImageForName } from '../data/walletProfile';
import { AvatarAccessoryGlass } from './AvatarAccessoryGlass';
import { AvatarActionIcon } from './AvatarActionIcon';

export function WalletProfileFace({
  icon = 'profile_auto',
  name = '',
  avatarPhoto = null,
  color = colors.button,
  size = 120,
}) {
  const emoji = getWalletEmoji(icon);
  return (
    <View
      style={[
        styles.face,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.faceTint,
          { backgroundColor: color },
        ]}
      />
      <RecoveryGlass
        width={size}
        height={size}
        radius={size / 2}
        top={0.5}
        bottom={0.3}
        tint="transparent"
      />
      {icon === 'profile_photo' && avatarPhoto ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${avatarPhoto}` }}
          resizeMode="cover"
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : emoji ? (
        <Text
          style={{ fontSize: Math.floor(size * 0.5), color: colors.foreground }}
        >
          {emoji}
        </Text>
      ) : (
        <Image
          source={profileImageForName(name)}
          resizeMode="contain"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            tintColor: color,
          }}
        />
      )}
    </View>
  );
}

export function WalletProfileAvatar({
  icon = 'profile_auto',
  name = '',
  avatarPhoto = null,
  color = colors.button,
  size = 120,
  onEdit,
  onReset,
  disabled = false,
}) {
  const t = useT();
  const manual =
    !!getWalletEmoji(icon) || (icon === 'profile_photo' && !!avatarPhoto);
  return (
    <View style={{ width: size, height: size }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('walletName.changeAvatar')}
        disabled={disabled || !onEdit}
        onPress={onEdit}
      >
        <WalletProfileFace
          icon={icon}
          name={name}
          avatarPhoto={avatarPhoto}
          color={color}
          size={size}
        />
      </Pressable>
      {!!onEdit && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t(
            manual ? 'walletName.resetAvatar' : 'walletName.changeAvatar',
          )}
          accessibilityState={{ disabled }}
          disabled={disabled}
          activeOpacity={0.2}
          onPress={
            manual
              ? () => {
                  impactFeedback();
                  onReset?.();
                }
              : onEdit
          }
          hitSlop={2}
          style={styles.accessory}
        >
          <AvatarAccessoryGlass color={color} manual={manual} />
          <AvatarActionIcon remove={manual} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  face: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  faceTint: { opacity: 0.2 },
  accessory: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 48,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
