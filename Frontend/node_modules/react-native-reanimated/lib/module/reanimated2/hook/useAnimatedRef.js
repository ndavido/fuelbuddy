'use strict';

import { useRef } from 'react';
import { useSharedValue } from './useSharedValue';
import { getShadowNodeWrapperFromRef } from '../fabricUtils';
import { makeShareableCloneRecursive, registerShareableMapping } from '../shareables';
import { Platform, findNodeHandle } from 'react-native';
import { isFabric } from '../PlatformChecker';
const IS_FABRIC = isFabric();
function getComponentOrScrollable(component) {
  if (IS_FABRIC && component.getNativeScrollRef) {
    return component.getNativeScrollRef();
  } else if (!IS_FABRIC && component.getScrollableNode) {
    return component.getScrollableNode();
  }
  return component;
}
const getTagValueFunction = IS_FABRIC ? getShadowNodeWrapperFromRef : findNodeHandle;

/**
 * Lets you get a reference of a view that you can use inside a worklet.
 *
 * @returns An object with a `.current` property which contains an instance of a component.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef
 */
export function useAnimatedRef() {
  const tag = useSharedValue(-1);
  const viewName = useSharedValue(null);
  const ref = useRef();
  if (!ref.current) {
    const fun = component => {
      // enters when ref is set by attaching to a component
      if (component) {
        tag.value = getTagValueFunction(getComponentOrScrollable(component));
        fun.current = component;
        // viewName is required only on iOS with Paper
        if (Platform.OS === 'ios' && !IS_FABRIC) {
          var _viewConfig;
          viewName.value = (component === null || component === void 0 ? void 0 : (_viewConfig = component.viewConfig) === null || _viewConfig === void 0 ? void 0 : _viewConfig.uiViewClassName) || 'RCTView';
        }
      }
      return tag.value;
    };
    fun.current = null;
    const remoteRef = makeShareableCloneRecursive({
      __init: () => {
        'worklet';

        const f = () => tag.value;
        f.viewName = viewName;
        return f;
      }
    });
    registerShareableMapping(fun, remoteRef);
    ref.current = fun;
  }
  return ref.current;
}
//# sourceMappingURL=useAnimatedRef.js.map