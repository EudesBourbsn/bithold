import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { BitholdMark } from '../../../components/branding/BitholdMark';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { GradientAction } from '../components/GradientAction';
import { PasscodeIllustration } from '../components/SecurityIllustrations';
import { fonts } from '../../../theme/fonts';

const OPEN = 1000;
const TEXT_SPRING = { damping: 100, mass: 2, stiffness: 80 };

function Rising({ children, style }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay((OPEN * 65) / 100),
      Animated.spring(progress, {
        toValue: 1,
        ...TEXT_SPRING,
        useNativeDriver: true,
      }),
    ]).start();
  }, [progress]);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function DisablingSecurityModal({ visible, onClose, onRemove }) {
  const t = useT();
  const { width, height } = useWindowDimensions();
  const small = height < 736;
  const driver = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(false);
  const shownRef = useRef(false);
  const removing = useRef(false);
  useEffect(() => {
    if (visible) {
      removing.current = false;
      shownRef.current = true;
      setShown(true);
      driver.setValue(0);
      Animated.timing(driver, {
        toValue: 1,
        duration: OPEN,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (shownRef.current) {
      Animated.timing(driver, {
        toValue: 0,
        duration: OPEN / 2,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          shownRef.current = false;
          setShown(false);
        }
      });
    }
  }, [visible, driver]);
  const cardY = driver.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0],
  });
  return (
    <Modal
      visible={shown}
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.card, { transform: [{ translateY: cardY }] }]}
      >
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <LinearGradient id="disabling-gradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset={0} stopColor="#413C32" />
              <Stop offset={1} stopColor={colors.modal} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#disabling-gradient)" />
        </Svg>
        <Animated.View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.mark,
            {
              transform: [
                {
                  translateY: driver.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-320, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.markShape}>
            <BitholdMark size={Math.max(width, height)} />
          </View>
        </Animated.View>
        <View
          style={[
            styles.content,
            small ? styles.compactContent : styles.regularContent,
          ]}
        >
          <View style={styles.main}>
            <View
              style={[
                styles.image,
                small ? styles.compactImage : styles.regularImage,
              ]}
            >
              <PasscodeIllustration size="100%" />
            </View>
            <Rising>
              <Text
                accessibilityRole="header"
                allowFontScaling={false}
                style={styles.title}
              >
                {t('security.disablingTitle')}
              </Text>
              <View style={styles.subtitleBox}>
                <Text allowFontScaling={false} style={styles.subtitle}>
                  {t('security.disablingSubtitle')}
                </Text>
              </View>
              <Text allowFontScaling={false} style={styles.note}>
                {t('security.disablingNote')}
              </Text>
            </Rising>
          </View>
          <View style={styles.footer}>
            <Rising>
              <GradientAction
                label={t('security.removePasscode')}
                onPress={() => {
                  if (!removing.current) {
                    removing.current = true;
                    onRemove();
                  }
                }}
                inset={15}
                style={styles.action}
              />
            </Rising>
          </View>
        </View>
        <Animated.View
          style={[
            styles.closeBox,
            {
              bottom: 2 * (small ? 25 : 45),
              opacity: driver.interpolate({
                inputRange: [0.4, 0.8, 1],
                outputRange: [0, 1, 1],
              }),
              transform: [
                {
                  translateY: driver.interpolate({
                    inputRange: [0.4, 0.8, 1],
                    outputRange: [50, 0, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            hitSlop={10}
            onPress={() => {
              impactFeedback();
              onClose();
            }}
            style={styles.close}
          >
            <Svg width={12} height={12} viewBox="0 0 12 12" accessible={false}>
              <Rect
                x={-1.385}
                y={5.538}
                width={15}
                height={1}
                rx={0.5}
                fill="#FFFFFF"
                transform="rotate(45 6.115 6.038)"
              />
              <Rect
                x={-1.385}
                y={5.538}
                width={15}
                height={1}
                rx={0.5}
                fill="#FFFFFF"
                transform="rotate(-45 6.115 6.038)"
              />
            </Svg>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    top: 0,
    left: 15,
    right: 15,
    bottom: 15,
    overflow: 'hidden',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  mark: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markShape: { opacity: 0.04 },
  compactContent: { paddingBottom: 80 },
  regularContent: { paddingBottom: 130 },
  compactImage: { flexBasis: 160, maxHeight: 160 },
  regularImage: { flexBasis: 210, maxHeight: 210 },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingTop: 30,
  },
  main: { flex: 1, justifyContent: 'center' },
  image: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    flexGrow: 1,
    flexShrink: 1,
    marginBottom: 21,
  },
  title: {
    ...fonts.regular,
    fontSize: 28,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleBox: { paddingHorizontal: 20 },
  subtitle: {
    ...fonts.regular,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0,
    color: '#BBBBBB',
    textAlign: 'center',
  },
  note: {
    ...fonts.medium,
    fontSize: 12,
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 15,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  footer: { paddingTop: 20, marginBottom: 10 },
  action: { width: '100%' },
  closeBox: { position: 'absolute', alignSelf: 'center' },
  close: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
