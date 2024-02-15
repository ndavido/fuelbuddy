'use strict';

import { useEffect, useRef } from 'react';
import { cancelAnimation } from '../animation';
import { makeMutable } from '../core';

/**
 * Lets you define [shared values](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#shared-value) in your components.
 *
 * @param initialValue - The value you want to be initially stored to a `.value` property.
 * @returns A shared value with a single `.value` property initially set to the `initialValue` - {@link SharedValue}.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue
 */
export function useSharedValue(initialValue) {
  let oneWayReadsOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const ref = useRef(makeMutable(initialValue, oneWayReadsOnly));
  if (ref.current === null) {
    ref.current = makeMutable(initialValue, oneWayReadsOnly);
  }
  useEffect(() => {
    return () => {
      cancelAnimation(ref.current);
    };
  }, []);
  return ref.current;
}
//# sourceMappingURL=useSharedValue.js.map