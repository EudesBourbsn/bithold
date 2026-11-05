import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  toolbar: {
    height: 40,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    paddingTop: 74,
  },
  balanceGroup: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  amountGap: {
    height: 12,
  },
  walletNameRow: {
    marginTop: 6,
    alignSelf: 'center',
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marketGap: {
    height: 28,
  },
  actions: {
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    gap: 9,
  },
  actionMotion: {
    flex: 1,
    height: 122,
  },
  action: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgb(73, 73, 104)',
    backgroundColor: '#303143',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#3B3B4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transform: [
      {
        translateX: -6,
      },
    ],
  },
  hiddenPrefix: {
    ...fonts.semibold,
    color: '#FFFFFF66',
  },
  fiatHiddenHeight: {
    height: 18,
  },
  bitcoinHiddenHeight: {
    height: 52.8,
  },
  fiatHiddenPrefix: {
    fontSize: 15,
  },
  bitcoinHiddenPrefix: {
    fontSize: 20,
  },
  fiatDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bitcoinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dot: {
    backgroundColor: colors.foreground,
  },
});
