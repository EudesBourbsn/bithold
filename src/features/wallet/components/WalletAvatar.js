import { Image, StyleSheet, Text } from 'react-native';
import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';
import { typography } from '../../../theme/index';
import { walletIcons } from './walletIcons';
import {
  getWalletEmoji,
  isProfileIcon,
  profileImageForName,
} from '../data/walletProfile';
import { WalletProfileFace } from './WalletProfileAvatar';

export function WalletGlyph({
  icon = 'wallet',
  size = 24,
  name = '',
  avatarPhoto = null,
  color = '#FFFFFF',
  initialsPreview = false,
}) {
  if (icon === 'profile_photo' && avatarPhoto) {
    return (
      <Image
        source={{ uri: `data:image/jpeg;base64,${avatarPhoto}` }}
        resizeMode="cover"
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  const emoji = getWalletEmoji(icon);
  if (emoji) {
    return <Text style={{ fontSize: size * 0.8, color }}>{emoji}</Text>;
  }
  if (icon === 'profile_auto') {
    return (
      <Image
        source={profileImageForName(name)}
        style={{ width: size, height: size, tintColor: color }}
      />
    );
  }
  if (icon === 'initials') {
    const words = name.trim().split(/\s+/);
    const initials =
      words.length > 1
        ? words[0][0] + words[words.length - 1][0]
        : (words[0] || 'Aa').slice(0, 2);
    if (initialsPreview) {
      return (
        <View style={[styles.initialsPreview, { width: size, height: size }]}>
          <Text
            numberOfLines={1}
            style={[
              typography.sheetTitle,
              styles.initialsText,
              { fontSize: size * 0.66, lineHeight: size * 0.66, color },
            ]}
          >
            Aa
          </Text>
        </View>
      );
    }
    return (
      <Text style={[typography.sheetTitle, { fontSize: size * 0.64, color }]}>
        {initials.toUpperCase()}
      </Text>
    );
  }
  const xml = walletIcons[icon] ?? walletIcons.wallet;
  return (
    <SvgXml
      xml={xml.replace(/#fff(?:fff)?|#FFFFFF|white/g, color)}
      width={size}
      height={size}
    />
  );
}

export function WalletAvatar({
  wallet,
  size = 40,
  showIcon = true,
  glossy = true,
}) {
  if (showIcon && glossy && isProfileIcon(wallet.icon)) {
    return (
      <WalletProfileFace
        icon={wallet.icon}
        name={wallet.name}
        avatarPhoto={wallet.avatarPhoto}
        color={wallet.color}
        size={size}
      />
    );
  }
  return (
    <View style={[styles.avatar, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.background}>
        <Defs>
          <RadialGradient id="avatar" cx="7.81%" cy="0%" r="73.8%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.5} />
            <Stop offset="1" stopColor={wallet.color} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={wallet.color} />
        {glossy && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2}
            fill="url(#avatar)"
          />
        )}
      </Svg>
      {showIcon && (
        <WalletGlyph
          icon={wallet.icon}
          size={Math.round(size * 0.625)}
          name={wallet.name}
          avatarPhoto={wallet.avatarPhoto}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  initialsPreview: { alignItems: 'center', justifyContent: 'center' },
  initialsText: { textAlign: 'center' },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  background: { position: 'absolute' },
});
