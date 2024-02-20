'use strict';

/* eslint-disable camelcase */
import { isFabric } from './PlatformChecker';
let findHostInstance_DEPRECATED;
if (isFabric()) {
  try {
    findHostInstance_DEPRECATED =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('react-native/Libraries/Renderer/shims/ReactFabric').findHostInstance_DEPRECATED;
  } catch (e) {
    throw new Error('[Reanimated] Cannot import `findHostInstance_DEPRECATED`.');
  }
}
export function getShadowNodeWrapperFromRef(ref) {
  return findHostInstance_DEPRECATED(ref)._internalInstanceHandle.stateNode.node;
}
//# sourceMappingURL=fabricUtils.js.map