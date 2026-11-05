import { useCallback, useEffect, useRef } from 'react';
import { phraseScrollPosition } from '../domain/phraseScrollPosition';

export function usePhraseInputVisibility(input, scroll, activeSlot) {
  const metrics = useRef({ viewportHeight: 0, contentHeight: 0, offset: 0 });
  const frame = useRef(null);
  const generation = useRef(0);
  const userScrolling = useRef(false);
  const pendingTarget = useRef(null);
  const cancel = useCallback(() => {
    generation.current += 1;
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    pendingTarget.current = null;
  }, []);
  useEffect(() => cancel, [cancel]);
  const reveal = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
    }
    const request = ++generation.current;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const field = input.current;
      const inner = scroll.current?.getInnerViewRef();
      if (!field?.isFocused() || !inner || userScrolling.current) {
        return;
      }
      activeSlot.current?.measureLayout(inner, (_x, top, _width, height) => {
        if (
          request !== generation.current ||
          userScrolling.current ||
          !field.isFocused()
        ) {
          return;
        }
        const target = phraseScrollPosition({
          top,
          height,
          ...metrics.current,
        });
        if (target === null) {
          pendingTarget.current = null;
        } else if (pendingTarget.current !== target) {
          pendingTarget.current = target;
          scroll.current?.scrollTo({ y: target, animated: true });
        }
      });
    });
  }, [input, scroll, activeSlot]);
  return {
    reveal,
    onViewportLayout: event => {
      metrics.current.viewportHeight = event.nativeEvent.layout.height;
      reveal();
    },
    onContentSizeChange: (_width, height) => {
      metrics.current.contentHeight = height;
      reveal();
    },
    onScroll: event => {
      metrics.current.offset = event.nativeEvent.contentOffset.y;
    },
    onScrollBeginDrag: () => {
      userScrolling.current = true;
      cancel();
    },
    onScrollEndDrag: () => {
      userScrolling.current = false;
    },
    onMomentumScrollBegin: () => {
      userScrolling.current = true;
      cancel();
    },
    onMomentumScrollEnd: () => {
      userScrolling.current = false;
    },
  };
}
