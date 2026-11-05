import { inputSurface, inputColors } from '../../../theme/inputTheme';
import { StyleSheet } from 'react-native';
import { colors, sheetMetrics, typography } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.modal },
  rows: {
    paddingBottom: sheetMetrics.content.bottom,
  },
  section: {
    marginTop: 32,
  },
  choices: {
    paddingHorizontal: sheetMetrics.selection.horizontalInset,
    paddingTop: 15,
    paddingBottom: sheetMetrics.content.bottom,
  },
  choice: {
    height: sheetMetrics.selection.height,
    marginBottom: sheetMetrics.selection.separation,
    borderRadius: sheetMetrics.selection.radius,
    backgroundColor: '#FFFFFF0D',
    paddingHorizontal: sheetMetrics.selection.innerInset,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  choiceCompact: {
    height: sheetMetrics.selection.compactHeight,
  },
  choiceBody: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: sheetMetrics.content.bottom,
  },
  listRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  listDimmed: {
    opacity: 0.6,
  },
  listTitle: {
    ...fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.foreground,
  },
  listTitleSelected: {
    color: colors.secondary,
  },
  listSubtitle: {
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
    color: colors.secondary,
  },
  listCheck: {
    marginLeft: 8,
  },
  unitList: {
    paddingTop: 22,
    paddingHorizontal: 16,
    paddingBottom: sheetMetrics.content.bottom,
  },
  unitRow: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // The two-line satoshi row: its mark sits 10 below the label's top.
  unitRowTall: {
    alignItems: 'flex-start',
  },
  unitCheckRow: {
    marginTop: 28,
  },
  unitPressed: {
    opacity: 0.6,
  },
  // The same line as under the Settings rows.
  unitDivider: {
    height: 1,
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: colors.divider,
  },
  unitTitle: {
    ...fonts.regular,
    fontSize: 16,
    color: colors.foreground,
  },
  unitSubtitle: {
    ...fonts.regular,
    fontSize: 12,
    marginTop: 4.4,
    color: colors.foreground,
  },
  unitMark: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 2,
  },
  unitMarkTall: {
    marginTop: 10,
  },
  unitCheck: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.foreground,
    marginLeft: 16,
    marginRight: 2,
  },
  unitCheckOn: {
    borderWidth: 0,
    backgroundColor: colors.button,
  },
  choicePressed: {
    opacity: 0.7,
  },
  choiceTitle: typography.sheetChoiceTitle,
  choiceTitleCompact: {
    ...typography.sheetChoiceTitle,
    fontSize: 14,
    lineHeight: 20,
  },
  languageChoices: {
    paddingBottom: 50,
  },
  choiceSubtitle: {
    ...typography.sheetChoiceSubtitle,
    marginTop: sheetMetrics.selection.titleGap,
  },
  radio: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: '#FFFFFF33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: colors.gold,
    borderWidth: 0,
  },
  tick: {
    fontSize: 15,
    color: colors.onGold,
  },
  searchField: {
    ...inputSurface,
    borderRadius: sheetMetrics.search.radius,
    height: sheetMetrics.search.height,
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    top: (sheetMetrics.search.height - sheetMetrics.search.iconSize) / 2 + 2,
    left: sheetMetrics.search.iconInset,
  },
  searchInput: {
    ...typography.settingsSearch,
    height: sheetMetrics.search.height,
    paddingLeft: sheetMetrics.search.textInset,
    paddingRight: sheetMetrics.search.textTrailingInset,
    paddingVertical: 0,
    color: inputColors.text,
  },
  clear: {
    position: 'absolute',
    top: (sheetMetrics.search.height - sheetMetrics.search.clearSize) / 2,
    right: sheetMetrics.search.clearInset,
    width: sheetMetrics.search.clearSize,
    height: sheetMetrics.search.clearSize,
    borderRadius: sheetMetrics.search.clearSize / 2,
    backgroundColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  explorerField: {
    marginBottom: sheetMetrics.selection.separation,
  },
  explorerInput: {
    paddingLeft: sheetMetrics.selection.innerInset,
    paddingRight: sheetMetrics.selection.innerInset,
  },
});
