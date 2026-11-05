import { base64 } from '@scure/base';

export const AVATAR_PHOTO_MAX_BYTES = 160000;
export const AVATAR_PHOTO_MAX_BASE64_LENGTH = 213336;
export const AVATAR_PHOTO_SIZE = 512;

function hasAvatarJpegFrame(bytes) {
  if (
    bytes.length < 4 ||
    bytes[0] !== 0xff ||
    bytes[1] !== 0xd8 ||
    bytes[bytes.length - 2] !== 0xff ||
    bytes[bytes.length - 1] !== 0xd9
  ) {
    return false;
  }
  let offset = 2;
  let hasFrame = false;
  while (offset < bytes.length - 2) {
    if (bytes[offset++] !== 0xff) return false;
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++];
    if (
      marker === 0 ||
      marker === 0x01 ||
      marker === 0xd8 ||
      marker === 0xd9 ||
      (marker >= 0xd0 && marker <= 0xd7) ||
      offset + 2 > bytes.length - 2
    ) {
      return false;
    }
    const length = bytes[offset] * 256 + bytes[offset + 1];
    const end = offset + length;
    if (length < 2 || end > bytes.length - 2) return false;
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const components = bytes[offset + 7];
      if (
        hasFrame ||
        length !== 8 + 3 * components ||
        (components !== 1 && components !== 3) ||
        bytes[offset + 2] !== 8 ||
        bytes[offset + 3] * 256 + bytes[offset + 4] !== AVATAR_PHOTO_SIZE ||
        bytes[offset + 5] * 256 + bytes[offset + 6] !== AVATAR_PHOTO_SIZE
      ) {
        return false;
      }
      hasFrame = true;
    } else if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return false;
    }
    if (marker === 0xda) {
      const components = bytes[offset + 2];
      return (
        hasFrame &&
        components >= 1 &&
        components <= 3 &&
        length === 6 + 2 * components &&
        end < bytes.length - 2
      );
    }
    offset = end;
  }
  return false;
}

export function isValidAvatarPhoto(value) {
  if (
    typeof value !== 'string' ||
    !value.length ||
    value.length > AVATAR_PHOTO_MAX_BASE64_LENGTH ||
    value.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(value)
  ) {
    return false;
  }
  try {
    const bytes = base64.decode(value);
    return (
      bytes.length <= AVATAR_PHOTO_MAX_BYTES &&
      base64.encode(bytes) === value &&
      hasAvatarJpegFrame(bytes)
    );
  } catch {
    return false;
  }
}
