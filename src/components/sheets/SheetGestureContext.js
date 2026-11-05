import { createContext, useContext } from 'react';

export const SheetGestureContext = createContext(null);

export function useSheetScrollGesture() {
  return useContext(SheetGestureContext)?.nativeScroll;
}
