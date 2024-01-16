'use strict';

import { setupCallGuard, setupConsole } from './initializers';
import NativeReanimatedModule from './NativeReanimated';
import { shouldBeUseWeb } from './PlatformChecker';
import { makeShareableCloneOnUIRecursive, makeShareableCloneRecursive } from './shareables';
const SHOULD_BE_USE_WEB = shouldBeUseWeb();
/**
 * Lets you create a new JS runtime which can be used to run worklets possibly on different threads than JS or UI thread.
 *
 * @param name - A name used to identify the runtime which will appear in devices list in Chrome DevTools.
 * @param initializer - An optional worklet that will be run synchronously on the same thread immediately after the runtime is created.
 * @returns WorkletRuntime which is a jsi::HostObject\<reanimated::WorkletRuntime\> - {@link WorkletRuntime}
 * @see https://docs.swmansion.com/react-native-reanimated/docs/threading/createWorkletRuntime
 */
export function createWorkletRuntime(name, initializer) {
  return NativeReanimatedModule.createWorkletRuntime(name, makeShareableCloneRecursive(() => {
    'worklet';

    setupCallGuard();
    setupConsole();
    initializer === null || initializer === void 0 ? void 0 : initializer();
  }));
}

// @ts-expect-error Check `runOnUI` overload.

/**
 * Schedule a worklet to execute on the background queue.
 */
export function runOnRuntime(workletRuntime, worklet) {
  'worklet';

  if (__DEV__ && !SHOULD_BE_USE_WEB && worklet.__workletHash === undefined) {
    throw new Error('[Reanimated] The function passed to `runOnRuntime` is not a worklet.' + (_WORKLET ? ' Please make sure that `processNestedWorklets` option in Reanimated Babel plugin is enabled.' : ''));
  }
  if (_WORKLET) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _scheduleOnRuntime(workletRuntime, makeShareableCloneOnUIRecursive(() => {
        'worklet';

        worklet(...args);
      }));
    };
  }
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return NativeReanimatedModule.scheduleOnRuntime(workletRuntime, makeShareableCloneRecursive(() => {
      'worklet';

      worklet(...args);
    }));
  };
}
//# sourceMappingURL=runtimes.js.map