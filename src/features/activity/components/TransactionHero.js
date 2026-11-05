import {
  Canvas,
  Fill,
  Group,
  LinearGradient,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../../theme';
import {
  bitcoinText,
  currencySymbol,
  fiat,
  satoshisText,
  unitName,
} from '../../send/domain/amount';
import { hasQuote } from '../domain/transactions';
import { styles } from '../styles/TransactionDetailsStep.styles.js';

export const bitcoinAsset = require('../../../../assets/icons/bitcoin.png');

const GLOW = colors.button;
export function TransactionBackground() {
  const [size, setSize] = useState(null);
  const center = size ? vec(size.width * 0.5013, 144) : null;
  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={({ nativeEvent }) => setSize(nativeEvent.layout)}
    >
      {size?.width > 0 && size?.height > 0 && (
        <Canvas style={styles.canvas}>
          <Group
            origin={center}
            transform={[
              {
                scaleY: (size.height * 0.3386) / (size.width * 0.7005),
              },
            ]}
          >
            <Fill>
              <RadialGradient
                c={center}
                r={size.width * 0.7005}
                colors={[`${GLOW}59`, `${GLOW}00`]}
              />
            </Fill>
          </Group>
          <Fill>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, size.height)}
              colors={[`${GLOW}0D`, `${GLOW}00`]}
            />
          </Fill>
        </Canvas>
      )}
    </View>
  );
}

export const POSITIVE = '#00E013';
export function HeroAmount({ sats, quote, currency, received }) {
  const converted = hasQuote(quote);
  const formatted = converted
    ? fiat((sats / 1e8) * quote, currency)
    : unitName() === 'sats'
    ? satoshisText(sats)
    : bitcoinText(sats);
  const numeric = formatted.match(/[\d,]+(?:\.\d+)?/)?.[0] ?? '0';
  const [integer, decimal] = numeric.split('.');
  return (
    <View
      style={styles.heroAmount}
      accessible
      accessibilityLabel={`${received ? '+' : ''}${formatted}${
        converted ? '' : ` ${unitName()}`
      }`}
    >
      {received && (
        <Svg width={11} height={11} style={styles.plus}>
          <Path
            d="M5.5 1V10M1 5.5H10"
            stroke={POSITIVE}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      )}
      {converted && (
        <View style={styles.prefixContainer}>
          <Text style={styles.heroPrefix}>{currencySymbol(currency)}</Text>
        </View>
      )}
      <Text
        style={styles.heroNumber}
        adjustsFontSizeToFit
        numberOfLines={1}
        minimumFontScale={0.55}
      >
        {integer}
        <Text style={styles.heroDecimal}>
          {decimal ? `.${decimal}` : ''}
          {converted ? '' : ` ${unitName()}`}
        </Text>
      </Text>
    </View>
  );
}
