import { useId } from 'react';
import { StyleSheet, Text } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { AvatarActionIcon } from './AvatarActionIcon';

export function AvatarOptionIcon({ kind }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  if (kind === 'remove') {
    return <AvatarActionIcon remove size={24} />;
  }
  if (kind === 'emoji') {
    return (
      <Text accessible={false} style={styles.emoji}>
        😀
      </Text>
    );
  }
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      accessible={false}
    >
      {kind === 'camera' ? (
        <>
          <Path
            d="M2 10.4113C2 8.42982 3.60629 6.82353 5.58775 6.82353C6.41628 6.82353 7.13702 6.25611 7.3315 5.45073L7.34091 5.41176C7.54091 4.58352 8.28211 4 9.13416 4H12H14.8658C15.7179 4 16.4591 4.58352 16.6591 5.41177L16.6685 5.45073C16.863 6.25611 17.5837 6.82353 18.4123 6.82353C20.3937 6.82353 22 8.42982 22 10.4113V14.1C22 16.3402 22 17.4603 21.564 18.316C21.1805 19.0686 20.5686 19.6805 19.816 20.064C18.9603 20.5 17.8402 20.5 15.6 20.5H8.4C6.15979 20.5 5.03968 20.5 4.18404 20.064C3.43139 19.6805 2.81947 19.0686 2.43597 18.316C2 17.4603 2 16.3402 2 14.1V10.4113Z"
            stroke="white"
            strokeWidth={2}
          />
          <Rect
            x={9}
            y={10}
            width={6}
            height={6}
            rx={3}
            stroke="white"
            strokeWidth={2}
          />
        </>
      ) : (
        <>
          <G clipPath={`url(#avatarPhotoClip${id})`}>
            <Rect
              x={1}
              y={1}
              width={22}
              height={22}
              rx={6.11111}
              stroke="white"
              strokeWidth={2}
            />
            <Circle cx={8.25} cy={8.25} r={2.25} fill="white" />
            <Path
              d="M18.7904 17.332C19.3708 17.9753 18.9143 19.002 18.0479 19.002H5.94059C5.03723 19.002 4.59691 17.899 5.25189 17.2769L7.12985 15.4931C7.51582 15.1265 8.12136 15.1265 8.5073 15.4932L8.73599 15.7104C9.14364 16.0977 9.79035 16.0729 10.1671 15.6554L12.9804 12.5384C13.3776 12.0984 14.0681 12.0985 14.4652 12.5385L18.7904 17.332Z"
              fill="white"
            />
          </G>
          <Defs>
            <ClipPath id={`avatarPhotoClip${id}`}>
              <Rect width={24} height={24} fill="white" />
            </ClipPath>
          </Defs>
        </>
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 24, color: 'white' },
});
