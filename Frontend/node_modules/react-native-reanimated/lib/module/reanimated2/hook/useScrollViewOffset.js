'use strict';

import { useEffect, useRef } from 'react';
import { findNodeHandle } from 'react-native';
import { useEvent } from './useEvent';
import { useSharedValue } from './useSharedValue';
const scrollEventNames = ['onScroll', 'onScrollBeginDrag', 'onScrollEndDrag', 'onMomentumScrollBegin', 'onMomentumScrollEnd'];

/**
 * Lets you synchronously get the current offset of a `ScrollView`.
 *
 * @param animatedRef - An [animated ref](https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef) attached to an Animated.ScrollView component.
 * @returns A shared value which holds the current offset of the `ScrollView`.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/scroll/useScrollViewOffset
 */
export function useScrollViewOffset(animatedRef, initialRef) {
  const offsetRef = useRef(
  // eslint-disable-next-line react-hooks/rules-of-hooks
  initialRef !== undefined ? initialRef : useSharedValue(0));
  const event = useEvent(event => {
    'worklet';

    offsetRef.current.value = event.contentOffset.x === 0 ? event.contentOffset.y : event.contentOffset.x;
  }, scrollEventNames
  // Read https://github.com/software-mansion/react-native-reanimated/pull/5056
  // for more information about this cast.
  );

  useEffect(() => {
    var _event$current;
    const viewTag = findNodeHandle(animatedRef.current);
    (_event$current = event.current) === null || _event$current === void 0 ? void 0 : _event$current.registerForEvents(viewTag);
    return () => {
      var _event$current2;
      (_event$current2 = event.current) === null || _event$current2 === void 0 ? void 0 : _event$current2.unregisterFromEvents();
    };
  }, [animatedRef.current]);
  return offsetRef.current;
}
//# sourceMappingURL=useScrollViewOffset.js.map