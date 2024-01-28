'use strict';

export function isSharedValue(value) {
  'worklet';

  return (value === null || value === void 0 ? void 0 : value._isReanimatedSharedValue) === true;
}
//# sourceMappingURL=isSharedValue.js.map