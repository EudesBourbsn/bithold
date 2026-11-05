import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/index';

export const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
    alignItems: 'center',
  },
  headerGroup: { alignItems: 'center', gap: 5 },
  avatarSlot: {
    width: 200,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: { gap: 5, paddingHorizontal: 20 },
  title: {
    color: colors.foreground,
    fontSize: 25,
    fontWeight: '600',
    letterSpacing: -0.25,
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFFFFFB8',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
  },
  inputGroup: { width: '100%', paddingHorizontal: 20 },
  input: {
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 20,
    paddingVertical: 0,
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  error: {
    marginTop: 8,
    color: colors.error,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  footer: { paddingHorizontal: 35, paddingTop: 16 },
});
