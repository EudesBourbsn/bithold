const avatarImages = [
  require('../../../../assets/wallet/avatars/avatar-01.png'),
  require('../../../../assets/wallet/avatars/avatar-02.png'),
  require('../../../../assets/wallet/avatars/avatar-03.png'),
  require('../../../../assets/wallet/avatars/avatar-04.png'),
  require('../../../../assets/wallet/avatars/avatar-05.png'),
  require('../../../../assets/wallet/avatars/avatar-06.png'),
  require('../../../../assets/wallet/avatars/avatar-07.png'),
  require('../../../../assets/wallet/avatars/avatar-08.png'),
  require('../../../../assets/wallet/avatars/avatar-09.png'),
  require('../../../../assets/wallet/avatars/avatar-10.png'),
  require('../../../../assets/wallet/avatars/avatar-11.png'),
  require('../../../../assets/wallet/avatars/avatar-12.png'),
  require('../../../../assets/wallet/avatars/avatar-13.png'),
  require('../../../../assets/wallet/avatars/avatar-14.png'),
  require('../../../../assets/wallet/avatars/avatar-15.png'),
  require('../../../../assets/wallet/avatars/avatar-16.png'),
  require('../../../../assets/wallet/avatars/avatar-17.png'),
  require('../../../../assets/wallet/avatars/avatar-18.png'),
  require('../../../../assets/wallet/avatars/avatar-19.png'),
  require('../../../../assets/wallet/avatars/avatar-20.png'),
  require('../../../../assets/wallet/avatars/avatar-21.png'),
  require('../../../../assets/wallet/avatars/avatar-22.png'),
  require('../../../../assets/wallet/avatars/avatar-23.png'),
  require('../../../../assets/wallet/avatars/avatar-24.png'),
  require('../../../../assets/wallet/avatars/avatar-25.png'),
  require('../../../../assets/wallet/avatars/avatar-26.png'),
  require('../../../../assets/wallet/avatars/avatar-27.png'),
  require('../../../../assets/wallet/avatars/avatar-28.png'),
  require('../../../../assets/wallet/avatars/avatar-29.png'),
  require('../../../../assets/wallet/avatars/avatar-30.png'),
  require('../../../../assets/wallet/avatars/avatar-31.png'),
  require('../../../../assets/wallet/avatars/avatar-32.png'),
  require('../../../../assets/wallet/avatars/avatar-33.png'),
  require('../../../../assets/wallet/avatars/avatar-34.png'),
  require('../../../../assets/wallet/avatars/avatar-35.png'),
];

export const walletEmojis = [
  { icon: 'emoji_1f600', value: '😀' },
  { icon: 'emoji_1f604', value: '😄' },
  { icon: 'emoji_1f601', value: '😁' },
  { icon: 'emoji_1f642', value: '🙂' },
  { icon: 'emoji_1f60a', value: '😊' },
  { icon: 'emoji_1f970', value: '🥰' },
  { icon: 'emoji_1f928', value: '🤨' },
  { icon: 'emoji_1f60f', value: '😏' },
  { icon: 'emoji_1f62c', value: '😬' },
  { icon: 'emoji_1f60c', value: '😌' },
  { icon: 'emoji_1f60e', value: '😎' },
  { icon: 'emoji_1f47b', value: '👻' },
  { icon: 'emoji_1f47d_fe0f', value: '👽️' },
  { icon: 'emoji_1f916', value: '🤖' },
  { icon: 'emoji_1f436', value: '🐶' },
  { icon: 'emoji_1f431', value: '🐱' },
  { icon: 'emoji_1f43b', value: '🐻' },
  { icon: 'emoji_1f43c', value: '🐼' },
  { icon: 'emoji_1f438', value: '🐸' },
  { icon: 'emoji_1f344', value: '🍄' },
  { icon: 'emoji_1f95a', value: '🥚' },
];

export function getWalletEmoji(icon) {
  return walletEmojis.find(item => item.icon === icon)?.value ?? null;
}

export function isProfileIcon(icon) {
  return (
    icon === 'profile_auto' ||
    icon === 'profile_photo' ||
    getWalletEmoji(icon) !== null
  );
}

export function profileIconForName(name) {
  const normalized = typeof name === 'string' ? name.trim().toLowerCase() : '';
  if (!normalized) return 7;
  let hash = 0;
  for (let index = 0; index < normalized.length; index++) {
    hash = ((hash << 5) - hash + normalized.codePointAt(index)) | 0;
  }
  return (Math.abs(hash) % avatarImages.length) + 1;
}

export function profileImageForName(name) {
  return avatarImages[profileIconForName(name) - 1];
}
