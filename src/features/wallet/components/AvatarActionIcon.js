import Svg, { Path } from 'react-native-svg';

export function AvatarActionIcon({ remove = false, size = 15 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      accessible={false}
    >
      {remove ? (
        <>
          <Path
            d="M5 6.5L6 21H18L19 6.5"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M3.5 6H20.5"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M8.0708 5.74621C8.42336 3.89745 10.0484 2.5 11.9999 2.5C13.9514 2.5 15.5764 3.89745 15.929 5.74621"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <Path
          d="M12 5.5V12M12 12V18.5M12 12H5.5M12 12H18.5"
          stroke="white"
          strokeOpacity={1}
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}
