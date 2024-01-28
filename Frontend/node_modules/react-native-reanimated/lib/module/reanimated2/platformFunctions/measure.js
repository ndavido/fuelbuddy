'use strict';

import { isChromeDebugger, isFabric, isJest, shouldBeUseWeb } from '../PlatformChecker';
/**
 * Lets you synchronously get the dimensions and position of a view on the screen.
 *
 * @param animatedRef - An [animated ref](https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef#returns) connected to the component you'd want to get the measurements from.
 * @returns An object containing component measurements or null when the measurement couldn't be performed- {@link MeasuredDimensions}.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/advanced/measure/
 */
export let measure;
function measureFabric(animatedRef) {
  'worklet';

  if (!_WORKLET) {
    return null;
  }
  const viewTag = animatedRef();
  if (viewTag === -1) {
    console.warn(`[Reanimated] The view with tag ${viewTag} is not a valid argument for measure(). This may be because the view is not currently rendered, which may not be a bug (e.g. an off-screen FlatList item).`);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const measured = _measureFabric(viewTag);
  if (measured === null) {
    console.warn(`[Reanimated] The view with tag ${viewTag} has some undefined, not-yet-computed or meaningless value of \`LayoutMetrics\` type. This may be because the view is not currently rendered, which may not be a bug (e.g. an off-screen FlatList item).`);
    return null;
  } else if (measured.x === -1234567) {
    console.warn(`[Reanimated] The view with tag ${viewTag} returned an invalid measurement response. Please make sure the view is currently rendered.`);
    return null;
  } else if (isNaN(measured.x)) {
    console.warn(`[Reanimated] The view with tag ${viewTag} gets view-flattened on Android. To disable view-flattening, set \`collapsable={false}\` on this component.`);
    return null;
  } else {
    return measured;
  }
}
function measurePaper(animatedRef) {
  'worklet';

  if (!_WORKLET) {
    return null;
  }
  const viewTag = animatedRef();
  if (viewTag === -1) {
    console.warn(`[Reanimated] The view with tag ${viewTag} is not a valid argument for measure(). This may be because the view is not currently rendered, which may not be a bug (e.g. an off-screen FlatList item).`);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const measured = _measurePaper(viewTag);
  if (measured === null) {
    console.warn(`[Reanimated] The view with tag ${viewTag} has some undefined, not-yet-computed or meaningless value of \`LayoutMetrics\` type. This may be because the view is not currently rendered, which may not be a bug (e.g. an off-screen FlatList item).`);
    return null;
  } else if (measured.x === -1234567) {
    console.warn(`[Reanimated] The view with tag ${viewTag} returned an invalid measurement response. Please make sure the view is currently rendered.`);
    return null;
  } else if (isNaN(measured.x)) {
    console.warn(`[Reanimated] The view with tag ${viewTag} gets view-flattened on Android. To disable view-flattening, set \`collapsable={false}\` on this component.`);
    return null;
  } else {
    return measured;
  }
}
function measureJest() {
  console.warn('[Reanimated] measure() cannot be used with Jest.');
  return null;
}
function measureChromeDebugger() {
  console.warn('[Reanimated] measure() cannot be used with Chrome Debugger.');
  return null;
}
function measureDefault() {
  console.warn('[Reanimated] measure() is not supported on this configuration.');
  return null;
}
if (!shouldBeUseWeb()) {
  if (isFabric()) {
    measure = measureFabric;
  } else {
    measure = measurePaper;
  }
} else if (isJest()) {
  measure = measureJest;
} else if (isChromeDebugger()) {
  measure = measureChromeDebugger;
} else {
  measure = measureDefault;
}
//# sourceMappingURL=measure.js.map