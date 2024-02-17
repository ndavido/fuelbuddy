'use strict';

import { addWhitelistedNativeProps } from '../ConfigHelper';

// TODO TYPESCRIPT This is a temporary type to get rid of .d.ts file.

export const createAnimatedPropAdapter = (adapter, nativeProps) => {
  const nativePropsToAdd = {};
  // eslint-disable-next-line no-unused-expressions
  nativeProps === null || nativeProps === void 0 ? void 0 : nativeProps.forEach(prop => {
    nativePropsToAdd[prop] = true;
  });
  addWhitelistedNativeProps(nativePropsToAdd);
  return adapter;
};
//# sourceMappingURL=PropAdapters.js.map