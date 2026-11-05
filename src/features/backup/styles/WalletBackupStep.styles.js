import { StyleSheet } from 'react-native';
import { buttonMetrics } from '../../../theme/buttonMetrics';
import { sheetMetrics } from '../../../theme/sheetMetrics';

export const styles = StyleSheet.create({
  page: {
    paddingTop: sheetMetrics.header.height,
    alignItems: 'center',
  },
  heading: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallTitle: { fontSize: 18 },
  description: {
    color: '#FFFFFFB8',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 24,
    marginHorizontal: 5,
  },
  smallDescription: { fontSize: 13, marginBottom: 13 },
  card: {
    minHeight: 455,
    backgroundColor: '#303143',
    borderRadius: 35,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  material: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  hiddenMaterial: { opacity: 0 },
  cover: {
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  coverTitle: {
    color: '#FFFFFF99',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.01,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  checklist: {
    width: '100%',
    gap: 10,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    marginLeft: 40,
    marginRight: 20,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  check: {
    color: '#FFF',
    fontSize: 17,
  },
  checklistText: {
    flex: 1,
    color: '#FFFFFFB8',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18.2,
  },
  hold: {
    marginBottom: 15,
    ...buttonMetrics.primary,
    borderRadius: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  holdText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  done: {
    marginTop: 30,
    ...buttonMetrics.primary,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    color: '#1E213C',
    ...buttonMetrics.primaryLabel,
  },
  privateKey: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 25,
  },
  passphrase: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
  passphraseLabel: {
    color: '#FFFFFFB8',
    fontSize: 12,
    lineHeight: 17,
  },
  passphraseValue: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
});
