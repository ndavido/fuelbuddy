'use strict';

function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { NativeEventEmitter, NativeModules, findNodeHandle } from 'react-native';
import { shouldBeUseWeb } from '../reanimated2/PlatformChecker';
import { runOnJS, runOnUIImmediately } from '../reanimated2/threads';
const SHOULD_BE_USE_WEB = shouldBeUseWeb();
class JSPropsUpdaterPaper {
  constructor() {
    _defineProperty(this, "_reanimatedEventEmitter", void 0);
    this._reanimatedEventEmitter = new NativeEventEmitter(NativeModules.ReanimatedModule);
  }
  addOnJSPropsChangeListener(animatedComponent) {
    const viewTag = findNodeHandle(animatedComponent);
    JSPropsUpdaterPaper._tagToComponentMapping.set(viewTag, animatedComponent);
    if (JSPropsUpdaterPaper._tagToComponentMapping.size === 1) {
      const listener = data => {
        const component = JSPropsUpdaterPaper._tagToComponentMapping.get(data.viewTag);
        component === null || component === void 0 ? void 0 : component._updateFromNative(data.props);
      };
      this._reanimatedEventEmitter.addListener('onReanimatedPropsChange', listener);
    }
  }
  removeOnJSPropsChangeListener(animatedComponent) {
    const viewTag = findNodeHandle(animatedComponent);
    JSPropsUpdaterPaper._tagToComponentMapping.delete(viewTag);
    if (JSPropsUpdaterPaper._tagToComponentMapping.size === 0) {
      this._reanimatedEventEmitter.removeAllListeners('onReanimatedPropsChange');
    }
  }
}
_defineProperty(JSPropsUpdaterPaper, "_tagToComponentMapping", new Map());
class JSPropsUpdaterFabric {
  constructor() {
    if (!JSPropsUpdaterFabric.isInitialized) {
      const updater = (viewTag, props) => {
        const component = JSPropsUpdaterFabric._tagToComponentMapping.get(viewTag);
        component === null || component === void 0 ? void 0 : component._updateFromNative(props);
      };
      runOnUIImmediately(() => {
        'worklet';

        global.updateJSProps = (viewTag, props) => {
          runOnJS(updater)(viewTag, props);
        };
      })();
      JSPropsUpdaterFabric.isInitialized = true;
    }
  }
  addOnJSPropsChangeListener(animatedComponent) {
    if (!JSPropsUpdaterFabric.isInitialized) {
      return;
    }
    const viewTag = findNodeHandle(animatedComponent);
    JSPropsUpdaterFabric._tagToComponentMapping.set(viewTag, animatedComponent);
  }
  removeOnJSPropsChangeListener(animatedComponent) {
    if (!JSPropsUpdaterFabric.isInitialized) {
      return;
    }
    const viewTag = findNodeHandle(animatedComponent);
    JSPropsUpdaterFabric._tagToComponentMapping.delete(viewTag);
  }
}
_defineProperty(JSPropsUpdaterFabric, "_tagToComponentMapping", new Map());
_defineProperty(JSPropsUpdaterFabric, "isInitialized", false);
class JSPropsUpdaterWeb {
  addOnJSPropsChangeListener(_animatedComponent) {
    // noop
  }
  removeOnJSPropsChangeListener(_animatedComponent) {
    // noop
  }
}
let JSPropsUpdater;
if (SHOULD_BE_USE_WEB) {
  JSPropsUpdater = JSPropsUpdaterWeb;
} else if (global._IS_FABRIC) {
  JSPropsUpdater = JSPropsUpdaterFabric;
} else {
  JSPropsUpdater = JSPropsUpdaterPaper;
}
export default JSPropsUpdater;
//# sourceMappingURL=JSPropsUpdater.js.map