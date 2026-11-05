import { useRef } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAddressBubble } from '../../../components/feedback/AddressBubble';
import { useT } from '../../../i18n/index';
import { buttonMetrics, colors, sheetMetrics } from '../../../theme/index';

export function AddressCapsule({ address, review = false }) {
  const t = useT();
  const anchor = useRef(null),
    show = useAddressBubble();
  return (
    <Pressable
      ref={anchor}
      accessibilityRole="button"
      accessibilityLabel={t('send.showAddress')}
      onPress={() =>
        anchor.current?.measureInWindow((x, y, width, height) =>
          show(address, { x, y, width, height }),
        )
      }
      style={[styles.pill, review && styles.review]}
    >
      <Text style={[buttonMetrics.linkLabel, { color: colors.foreground }]}>
        {address.length > 8
          ? `${address.slice(0, 4)}...${address.slice(-4)}`
          : address}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  review: {
    paddingLeft: sheetMetrics.review.capsuleInsetLeft,
    paddingRight: sheetMetrics.review.capsuleInsetRight,
  },
  pill: {
    ...buttonMetrics.link,
    borderRadius: 20,
    paddingHorizontal: 14,
    backgroundColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
