import { AppBackground } from '../../../components/backgrounds/AppBackground';

export function PasscodeBackground() {
  return <AppBackground />;
}

export const headerInset = insets => Math.max(insets.top, 50);
export const safeTop = (insets, value) => Math.max(value, insets.top);
export const safeBottom = (insets, value) => Math.max(value, insets.bottom);

export const heightClass = height =>
  height < 736 ? 'small' : height < 798 ? 'large' : 'default';
