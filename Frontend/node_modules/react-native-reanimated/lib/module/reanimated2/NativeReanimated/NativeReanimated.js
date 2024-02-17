'use strict';

function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { NativeModules } from 'react-native';
import { checkCppVersion } from '../platform-specific/checkCppVersion';
import { jsVersion } from '../platform-specific/jsVersion';
import { getValueUnpackerCode } from '../valueUnpacker';

// this is the type of `__reanimatedModuleProxy` which is injected using JSI

function assertSingleReanimatedInstance() {
  if (global._REANIMATED_VERSION_JS !== undefined && global._REANIMATED_VERSION_JS !== jsVersion) {
    throw new Error(`[Reanimated] Another instance of Reanimated was detected.
See \`https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#another-instance-of-reanimated-was-detected\` for more details. Previous: ${global._REANIMATED_VERSION_JS}, current: ${jsVersion}.`);
  }
  global._REANIMATED_VERSION_JS = jsVersion;
}
export class NativeReanimated {
  constructor() {
    _defineProperty(this, "InnerNativeModule", void 0);
    // These checks have to split since version checking depend on the execution order
    if (__DEV__) {
      assertSingleReanimatedInstance();
    }
    if (global.__reanimatedModuleProxy === undefined) {
      const {
        ReanimatedModule
      } = NativeModules;
      ReanimatedModule === null || ReanimatedModule === void 0 ? void 0 : ReanimatedModule.installTurboModule();
    }
    if (global.__reanimatedModuleProxy === undefined) {
      throw new Error(`[Reanimated] Native part of Reanimated doesn't seem to be initialized.
See https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#native-part-of-reanimated-doesnt-seem-to-be-initialized for more details.`);
    }
    if (__DEV__) {
      checkCppVersion();
    }
    this.InnerNativeModule = global.__reanimatedModuleProxy;
    this.InnerNativeModule.installValueUnpacker(getValueUnpackerCode());
  }
  makeShareableClone(value, shouldPersistRemote) {
    return this.InnerNativeModule.makeShareableClone(value, shouldPersistRemote);
  }
  makeSynchronizedDataHolder(valueRef) {
    return this.InnerNativeModule.makeSynchronizedDataHolder(valueRef);
  }
  getDataSynchronously(ref) {
    return this.InnerNativeModule.getDataSynchronously(ref);
  }
  scheduleOnUI(shareable) {
    return this.InnerNativeModule.scheduleOnUI(shareable);
  }
  createWorkletRuntime(name, initializer) {
    return this.InnerNativeModule.createWorkletRuntime(name, initializer);
  }
  scheduleOnRuntime(workletRuntime, shareableWorklet) {
    return this.InnerNativeModule.scheduleOnRuntime(workletRuntime, shareableWorklet);
  }
  registerSensor(sensorType, interval, iosReferenceFrame, handler) {
    return this.InnerNativeModule.registerSensor(sensorType, interval, iosReferenceFrame, handler);
  }
  unregisterSensor(sensorId) {
    return this.InnerNativeModule.unregisterSensor(sensorId);
  }
  registerEventHandler(eventHandler, eventName, emitterReactTag) {
    return this.InnerNativeModule.registerEventHandler(eventHandler, eventName, emitterReactTag);
  }
  unregisterEventHandler(id) {
    return this.InnerNativeModule.unregisterEventHandler(id);
  }
  getViewProp(viewTag, propName, callback) {
    return this.InnerNativeModule.getViewProp(viewTag, propName, callback);
  }
  configureLayoutAnimation(viewTag, type, sharedTransitionTag, config) {
    this.InnerNativeModule.configureLayoutAnimation(viewTag, type, sharedTransitionTag, config);
  }
  setShouldAnimateExitingForTag(viewTag, shouldAnimate) {
    this.InnerNativeModule.setShouldAnimateExitingForTag(viewTag, shouldAnimate);
  }
  enableLayoutAnimations(flag) {
    this.InnerNativeModule.enableLayoutAnimations(flag);
  }
  configureProps(uiProps, nativeProps) {
    this.InnerNativeModule.configureProps(uiProps, nativeProps);
  }
  subscribeForKeyboardEvents(handler, isStatusBarTranslucent) {
    return this.InnerNativeModule.subscribeForKeyboardEvents(handler, isStatusBarTranslucent);
  }
  unsubscribeFromKeyboardEvents(listenerId) {
    this.InnerNativeModule.unsubscribeFromKeyboardEvents(listenerId);
  }
}
//# sourceMappingURL=NativeReanimated.js.map