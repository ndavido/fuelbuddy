'use strict';

import { isChromeDebugger, isFabric, isJest, shouldBeUseWeb } from '../PlatformChecker';
function dispatchCommandFabric(animatedRef, commandName) {
  'worklet';

  let args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (!_WORKLET) {
    return;
  }
  const shadowNodeWrapper = animatedRef();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  _dispatchCommandFabric(shadowNodeWrapper, commandName, args);
}
function dispatchCommandPaper(animatedRef, commandName) {
  'worklet';

  let args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (!_WORKLET) {
    return;
  }
  const viewTag = animatedRef();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  _dispatchCommandPaper(viewTag, commandName, args);
}
function dispatchCommandJest() {
  console.warn('[Reanimated] dispatchCommand() is not supported with Jest.');
}
function dispatchCommandChromeDebugger() {
  console.warn('[Reanimated] dispatchCommand() is not supported with Chrome Debugger.');
}
function dispatchCommandDefault() {
  console.warn('[Reanimated] dispatchCommand() is not supported on this configuration.');
}

/**
 * Lets you synchronously call a command of a native component.
 *
 * @param animatedRef - An [animated ref](https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef#returns) connected to the component you'd want to call the command on.
 * @param commandName - The name of the command to dispatch (e.g. `"focus"` or `"scrollToEnd"`).
 * @param args - An optional array of arguments for the command.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/advanced/dispatchCommand
 */
export let dispatchCommand;
if (!shouldBeUseWeb()) {
  if (isFabric()) {
    dispatchCommand = dispatchCommandFabric;
  } else {
    dispatchCommand = dispatchCommandPaper;
  }
} else if (isJest()) {
  dispatchCommand = dispatchCommandJest;
} else if (isChromeDebugger()) {
  dispatchCommand = dispatchCommandChromeDebugger;
} else {
  dispatchCommand = dispatchCommandDefault;
}
//# sourceMappingURL=dispatchCommand.js.map