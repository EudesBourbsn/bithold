import { Image, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { bitcoinAsset } from '../../activity/components/TransactionHero';
import { welcomeLayout, welcomePalette } from '../theme/welcomeLayout';

export function AppleMark() {
  return (
    <Svg
      accessible={false}
      width={15.3}
      height={18}
      viewBox="0 0 17 20"
      fill="none"
    >
      <Path
        d="M15.762 6.818C15.646 6.908 13.598 8.062 13.598 10.628C13.598 13.596 16.204 14.646 16.282 14.672C16.27 14.736 15.868 16.11 14.908 17.51C14.052 18.742 13.158 19.972 11.798 19.972C10.438 19.972 10.088 19.182 8.518 19.182C6.988 19.182 6.444 19.998 5.2 19.998C3.956 19.998 3.088 18.858 2.09 17.458C0.934 15.814 0 13.26 0 10.836C0 6.948 2.528 4.886 5.016 4.886C6.338 4.886 7.44 5.754 8.27 5.754C9.06 5.754 10.292 4.834 11.796 4.834C12.366 4.834 14.414 4.886 15.762 6.818ZM11.082 3.188C11.704 2.45 12.144 1.426 12.144 0.402C12.144 0.26 12.132 0.116 12.106 0C11.094 0.038 9.89 0.674 9.164 1.516C8.594 2.164 8.062 3.188 8.062 4.226C8.062 4.382 8.088 4.538 8.1 4.588C8.164 4.6 8.268 4.614 8.372 4.614C9.28 4.614 10.422 4.006 11.082 3.188Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

export function GoogleMark() {
  return (
    <Svg
      accessible={false}
      width={18}
      height={18}
      viewBox="0 0 20 20"
      fill="none"
    >
      <Path
        d="M19.25 10.0532C19.25 9.35617 19.1875 8.68596 19.0714 8.04255L12.2872 8.04255V11.8494L15.1071 11.8494C14.875 13.0736 14.1786 14.1102 13.1339 14.8072V17.2826H16.3214C18.1786 15.5668 19.25 13.0468 19.25 10.0532Z"
        fill="#4285F4"
      />
      <Path
        d="M9.82143 19.6596C12.4732 19.6596 14.6964 18.7838 16.3214 17.2826L13.1339 14.8072C12.2589 15.397 11.1429 15.7545 9.82143 15.7545C7.26786 15.7545 5.09822 14.0298 4.32143 11.7064H1.05357V14.2443C2.66964 17.4523 5.98214 19.6596 9.82143 19.6596Z"
        fill="#34A853"
      />
      <Path
        d="M4.32143 11.6974C4.125 11.1077 4.00893 10.4821 4.00893 9.82979C4.00893 9.17745 4.125 8.55192 4.32143 7.96213V5.42426H1.05357C0.383929 6.74681 0 8.23915 0 9.82979C0 11.4204 0.383929 12.9128 1.05357 14.2353L4.32143 11.6974Z"
        fill="#FBBC05"
      />
      <Path
        d="M9.82143 3.91404C11.2679 3.91404 12.5536 4.41447 13.5804 5.37957L16.3929 2.56468C14.6875 0.974042 12.4732 0 9.82143 0C5.98214 0 2.66964 2.20723 1.05357 5.42426L4.32143 7.96213C5.09822 5.63872 7.26786 3.91404 9.82143 3.91404Z"
        fill="#EA4335"
      />
      <Rect
        x="9.82812"
        y="8.04004"
        width="2.45752"
        height="3.80316"
        fill="#4285F4"
      />
    </Svg>
  );
}

// The round Bitcoin coin Send, Receive and the balance page use, alone.
export function ChainMarks() {
  return (
    <View accessible={false} style={styles.chains}>
      <Image source={bitcoinAsset} resizeMode="contain" style={styles.chain} />
    </View>
  );
}

const styles = StyleSheet.create({
  chains: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    flexShrink: 0,
    height: welcomeLayout.chainSize,
  },
  chain: {
    width: welcomeLayout.chainSize,
    height: welcomeLayout.chainSize,
    borderRadius: welcomeLayout.chainSize / 2,
    overflow: 'hidden',
  },
});

export function OptionArrow() {
  return (
    <Svg accessible={false} width={12} height={12} viewBox="0 0 12 12">
      <Path
        d="M9.1376953125 6.0 3.7119140625 11.4228515625 2.8623046875 10.576171875 7.4384765625 6.0 2.8623046875 1.423828125 3.7119140625 0.5771484375Z"
        fill={welcomePalette.muted}
      />
    </Svg>
  );
}
