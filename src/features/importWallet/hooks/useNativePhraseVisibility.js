import { useCallback, useEffect, useRef } from 'react';
import { phraseScrollPosition } from '../domain/phraseScrollPosition';

export function useNativePhraseVisibility(scroll, enabled, revision) {
  const metrics = useRef({
    viewportHeight: 0,
    contentHeight: 0,
    offset: 0,
    fieldTop: 0,
    caret: null,
  });
  const active = useRef(enabled);
  active.current = enabled;
  const frame = useRef(null);
  const userScrolling = useRef(false);
  const cancel = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, []);
  const reveal = useCallback(() => {
    cancel();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const { caret, fieldTop, ...viewport } = metrics.current;
      if (
        !active.current ||
        userScrolling.current ||
        !caret ||
        caret.revision !== revision.current
      ) {
        return;
      }
      const target = phraseScrollPosition({
        ...viewport,
        top: Math.max(0, fieldTop + caret.y - 8),
        height: caret.height + 16,
      });
      if (target !== null) {
        scroll.current?.scrollTo({ y: target, animated: false });
      }
    });
  }, [cancel, revision, scroll]);
  useEffect(() => {
    if (enabled) {
      reveal();
    } else {
      cancel();
    }
    return cancel;
  }, [enabled, reveal, cancel]);
  return {
    onCaret: ({ nativeEvent }) => {
      if (
        nativeEvent.revision === revision.current &&
        Number.isFinite(nativeEvent.y) &&
        Number.isFinite(nativeEvent.height)
      ) {
        metrics.current.caret = nativeEvent;
        reveal();
      }
    },
    onFieldLayout: ({ nativeEvent }) => {
      metrics.current.fieldTop = nativeEvent.layout.y;
      reveal();
    },
    scrollProps: {
      scrollEventThrottle: 16,
      onLayout: ({ nativeEvent }) => {
        metrics.current.viewportHeight = nativeEvent.layout.height;
        reveal();
      },
      onContentSizeChange: (_width, height) => {
        metrics.current.contentHeight = height;
        reveal();
      },
      onScroll: ({ nativeEvent }) => {
        metrics.current.offset = nativeEvent.contentOffset.y;
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
    },
  };
}
