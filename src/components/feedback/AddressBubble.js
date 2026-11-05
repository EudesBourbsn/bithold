import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useT } from '../../i18n/index';
import { colors } from '../../theme/index';
import { NativeBlurMaterial } from '../materials/NativeBlurMaterial';
import { transactionTooltipPath } from './tooltipGeometry';
import { fonts } from '../../theme/fonts';

const BubbleContext = createContext(() => {});

export function BubbleHost({ children, bounds, originRef }) {
  const t = useT();
  const [bubble, setBubble] = useState(null),
    timer = useRef(null);
  const window = useWindowDimensions();
  const width = bounds?.width || window.width;
  const height = bounds?.height || window.height;
  const pending = useRef(null);
  const show = useCallback(
    (text, anchor, copy = false, options = {}) => {
      clearTimeout(timer.current);
      const owner = {};
      pending.current = owner;
      const dismiss = () => {
        if (pending.current === owner) {
          pending.current = null;
        }
        setBubble(current => (current?.owner === owner ? null : current));
      };
      const present = (x = 0, y = 0) => {
        if (pending.current !== owner) {
          return;
        }
        setBubble({
          text,
          anchor: { ...anchor, x: anchor.x - x, y: anchor.y - y },
          copy,
          options,
          owner,
          measured: null,
        });
        if (options.duration !== null) {
          timer.current = setTimeout(dismiss, options.duration ?? 1600);
        }
      };
      if (originRef?.current) {
        originRef.current.measureInWindow(present);
      } else {
        present();
      }
      return dismiss;
    },
    [originRef],
  );
  useEffect(
    () => () => {
      pending.current = null;
      clearTimeout(timer.current);
    },
    [],
  );
  const transaction = bubble?.options?.transaction === true;
  const info = bubble?.options?.info === true;
  const edge = transaction ? 10 : 12;
  const radius = info ? 24 : 20;
  const maxWidth = info ? Math.min(320, width - edge * 2) : width - edge * 2;
  const measured = bubble?.measured,
    w = measured?.width ?? maxWidth,
    h = measured?.height ?? 60;
  const center = bubble ? bubble.anchor.x + bubble.anchor.width / 2 : width / 2;
  const left = transaction
    ? Math.min(width - w - edge, Math.max(edge, center - w / 2))
    : bubble?.copy
    ? Math.max(12, width - w - 12)
    : Math.min(width - w - 12, Math.max(12, center - w / 2));
  const top = Math.max(
    8,
    Math.min(
      height - h - 8,
      (bubble?.anchor.y ?? 80) - h - (transaction ? 5 : 8),
    ),
  );
  const dismissInteractive = () => {
    bubble?.options?.onDismiss?.();
    setBubble(current => (current?.owner === bubble?.owner ? null : current));
  };
  const d = transactionTooltipPath(w, h - 5, left + w / 2 - center, radius);
  return (
    <BubbleContext.Provider value={show}>
      {children}
      {info && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissInteractive}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        />
      )}
      {transaction && (
        <>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissInteractive}
            accessibilityRole="button"
            accessibilityLabel={t('bubble.dismissAddress')}
          />
          <Pressable
            style={[
              styles.anchor,
              {
                left: bubble.anchor.x,
                top: bubble.anchor.y,
                width: bubble.anchor.width,
                height: bubble.anchor.height,
              },
            ]}
            onPress={dismissInteractive}
            onLongPress={bubble.options.onLongPress}
            accessibilityRole="button"
            accessibilityLabel={t('common.copyAddress')}
          />
        </>
      )}
      {bubble && (
        <View
          pointerEvents="none"
          style={[
            styles.position,
            { left, top, maxWidth },
            measured ? styles.measured : styles.unmeasured,
          ]}
          onLayout={e => {
            const size = e.nativeEvent.layout;
            if (
              !measured ||
              Math.abs(size.width - w) > 0.5 ||
              Math.abs(size.height - h) > 0.5
            ) {
              setBubble(v =>
                v?.owner === bubble.owner
                  ? {
                      ...v,
                      measured: { width: size.width, height: size.height },
                    }
                  : v,
              );
            }
          }}
        >
          <View
            pointerEvents="none"
            style={[
              styles.blur,
              {
                width: w,
                height: h - 5,
                borderRadius: radius,
              },
            ]}
          >
            <NativeBlurMaterial style={StyleSheet.absoluteFill} />
          </View>
          <Svg width={w} height={h + 2} style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient
                id="bubbleTint"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <Stop offset="0" stopColor="white" stopOpacity={0.2} />
                <Stop offset="1" stopColor="white" stopOpacity={0.1} />
              </LinearGradient>
              <LinearGradient id="bubbleBorder" gradientTransform="rotate(80)">
                <Stop offset="0" stopColor="white" stopOpacity={0.3} />
                <Stop offset="0.25" stopColor="white" stopOpacity={0} />
                <Stop offset="0.7" stopColor="white" stopOpacity={0.3} />
                <Stop offset="1" stopColor="white" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Path
              d={d}
              fill="url(#bubbleTint)"
              stroke="url(#bubbleBorder)"
              strokeWidth={2}
            />
          </Svg>
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.text, info && styles.infoText]}
          >
            {bubble.text}
          </Text>
        </View>
      )}
    </BubbleContext.Provider>
  );
}
export function useAddressBubble() {
  return useContext(BubbleContext);
}
const styles = StyleSheet.create({
  anchor: { position: 'absolute' },
  blur: { position: 'absolute', overflow: 'hidden' },
  infoText: {
    paddingHorizontal: 20,
  },
  measured: { opacity: 1 },
  unmeasured: { opacity: 0 },
  measuring: { opacity: 0 },
  position: { position: 'absolute', zIndex: 1000, alignSelf: 'flex-start' },
  text: {
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 16,
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.4,
    color: colors.foreground,
  },
});
