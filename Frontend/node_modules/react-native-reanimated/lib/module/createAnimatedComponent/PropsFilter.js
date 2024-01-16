'use strict';

function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { isSharedValue } from '../reanimated2';
import { isChromeDebugger } from '../reanimated2/PlatformChecker';
import WorkletEventHandler from '../reanimated2/WorkletEventHandler';
import { initialUpdaterRun } from '../reanimated2/animation';
import { hasInlineStyles, getInlineStyle } from './InlinePropManager';
import { flattenArray, has } from './utils';
import { StyleSheet } from 'react-native';
function dummyListener() {
  // empty listener we use to assign to listener properties for which animated
  // event is used.
}
export class PropsFilter {
  constructor() {
    _defineProperty(this, "_initialStyle", {});
  }
  filterNonAnimatedProps(component) {
    const inputProps = component.props;
    const props = {};
    for (const key in inputProps) {
      const value = inputProps[key];
      if (key === 'style') {
        const styleProp = inputProps.style;
        const styles = flattenArray(styleProp ?? []);
        const processedStyle = styles.map(style => {
          if (style && style.viewDescriptors) {
            // this is how we recognize styles returned by useAnimatedStyle
            style.viewsRef.add(component);
            if (component._isFirstRender) {
              this._initialStyle = {
                ...style.initial.value,
                ...this._initialStyle,
                ...initialUpdaterRun(style.initial.updater)
              };
            }
            return this._initialStyle;
          } else if (hasInlineStyles(style)) {
            return getInlineStyle(style, component._isFirstRender);
          } else {
            return style;
          }
        });
        props[key] = StyleSheet.flatten(processedStyle);
      } else if (key === 'animatedProps') {
        const animatedProp = inputProps.animatedProps;
        if (animatedProp.initial !== undefined) {
          Object.keys(animatedProp.initial.value).forEach(key => {
            var _animatedProp$initial, _animatedProp$viewsRe;
            props[key] = (_animatedProp$initial = animatedProp.initial) === null || _animatedProp$initial === void 0 ? void 0 : _animatedProp$initial.value[key];
            (_animatedProp$viewsRe = animatedProp.viewsRef) === null || _animatedProp$viewsRe === void 0 ? void 0 : _animatedProp$viewsRe.add(component);
          });
        }
      } else if (has('current', value) && value.current instanceof WorkletEventHandler) {
        if (value.current.eventNames.length > 0) {
          value.current.eventNames.forEach(eventName => {
            props[eventName] = has('listeners', value.current) ? value.current.listeners[eventName] : dummyListener;
          });
        } else {
          props[key] = dummyListener;
        }
      } else if (isSharedValue(value)) {
        if (component._isFirstRender) {
          props[key] = value.value;
        }
      } else if (key !== 'onGestureHandlerStateChange' || !isChromeDebugger()) {
        props[key] = value;
      }
    }
    return props;
  }
}
//# sourceMappingURL=PropsFilter.js.map