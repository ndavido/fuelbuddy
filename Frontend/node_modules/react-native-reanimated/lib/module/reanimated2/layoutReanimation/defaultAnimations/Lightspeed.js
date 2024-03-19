'use strict';

function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { withSequence, withTiming } from '../../animation';
import { ComplexAnimationBuilder } from '../animationBuilder';
/**
 * Entry from right animation with change in skew and opacity. You can modify the behavior by chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#lightspeed
 */
export class LightSpeedInRight extends ComplexAnimationBuilder {
  constructor() {
    super(...arguments);
    _defineProperty(this, "build", () => {
      const delayFunction = this.getDelayFunction();
      const [animation, config] = this.getAnimationAndConfig();
      const delay = this.getDelay();
      const duration = this.getDuration();
      const callback = this.callbackV;
      const initialValues = this.initialValues;
      return values => {
        'worklet';

        return {
          animations: {
            opacity: delayFunction(delay, withTiming(1, {
              duration: duration
            })),
            transform: [{
              translateX: delayFunction(delay, animation(0, {
                ...config,
                duration: duration * 0.7
              }))
            }, {
              skewX: delayFunction(delay, withSequence(withTiming('10deg', {
                duration: duration * 0.7
              }), withTiming('-5deg', {
                duration: duration * 0.15
              }), withTiming('0deg', {
                duration: duration * 0.15
              })))
            }]
          },
          initialValues: {
            opacity: 0,
            transform: [{
              translateX: values.windowWidth
            }, {
              skewX: '-45deg'
            }],
            ...initialValues
          },
          callback: callback
        };
      };
    });
  }
  static createInstance() {
    return new LightSpeedInRight();
  }
}

/**
 * Entry from left animation with change in skew and opacity. You can modify the behavior by chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `entering` prop on [an Animated component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#lightspeed
 */
_defineProperty(LightSpeedInRight, "presetName", 'LightSpeedInRight');
export class LightSpeedInLeft extends ComplexAnimationBuilder {
  constructor() {
    super(...arguments);
    _defineProperty(this, "build", () => {
      const delayFunction = this.getDelayFunction();
      const [animation, config] = this.getAnimationAndConfig();
      const delay = this.getDelay();
      const duration = this.getDuration();
      const callback = this.callbackV;
      const initialValues = this.initialValues;
      return values => {
        'worklet';

        return {
          animations: {
            opacity: delayFunction(delay, withTiming(1, {
              duration: duration
            })),
            transform: [{
              translateX: delayFunction(delay, animation(0, {
                ...config,
                duration: duration * 0.7
              }))
            }, {
              skewX: delayFunction(delay, withSequence(withTiming('-10deg', {
                duration: duration * 0.7
              }), withTiming('5deg', {
                duration: duration * 0.15
              }), withTiming('0deg', {
                duration: duration * 0.15
              })))
            }]
          },
          initialValues: {
            opacity: 0,
            transform: [{
              translateX: -values.windowWidth
            }, {
              skewX: '45deg'
            }],
            ...initialValues
          },
          callback: callback
        };
      };
    });
  }
  static createInstance() {
    return new LightSpeedInLeft();
  }
}

/**
 * Exit to right animation with change in skew and opacity. You can modify the behavior by chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations#lightspeed
 */
_defineProperty(LightSpeedInLeft, "presetName", 'LightSpeedInLeft');
export class LightSpeedOutRight extends ComplexAnimationBuilder {
  constructor() {
    super(...arguments);
    _defineProperty(this, "build", () => {
      const delayFunction = this.getDelayFunction();
      const [animation, config] = this.getAnimationAndConfig();
      const delay = this.getDelay();
      const callback = this.callbackV;
      const initialValues = this.initialValues;
      return values => {
        'worklet';

        return {
          animations: {
            opacity: delayFunction(delay, animation(0, config)),
            transform: [{
              translateX: delayFunction(delay, animation(values.windowWidth, config))
            }, {
              skewX: delayFunction(delay, animation('-45deg', config))
            }]
          },
          initialValues: {
            opacity: 1,
            transform: [{
              translateX: 0
            }, {
              skewX: '0deg'
            }],
            ...initialValues
          },
          callback: callback
        };
      };
    });
  }
  static createInstance() {
    return new LightSpeedOutRight();
  }
}

/**
 * Exit to left animation with change in skew and opacity. You can modify the behavior by chaining methods like `.springify()` or `.duration(500)`.
 *
 * You pass it to the `exiting` prop on [an Animated component](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#animated-component).
 *
 * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations/#lightspeed
 */
_defineProperty(LightSpeedOutRight, "presetName", 'LightSpeedOutRight');
export class LightSpeedOutLeft extends ComplexAnimationBuilder {
  constructor() {
    super(...arguments);
    _defineProperty(this, "build", () => {
      const delayFunction = this.getDelayFunction();
      const [animation, config] = this.getAnimationAndConfig();
      const delay = this.getDelay();
      const callback = this.callbackV;
      const initialValues = this.initialValues;
      return values => {
        'worklet';

        return {
          animations: {
            opacity: delayFunction(delay, animation(0, config)),
            transform: [{
              translateX: delayFunction(delay, animation(-values.windowWidth, config))
            }, {
              skewX: delayFunction(delay, animation('45deg', config))
            }]
          },
          initialValues: {
            opacity: 1,
            transform: [{
              translateX: 0
            }, {
              skewX: '0deg'
            }],
            ...initialValues
          },
          callback: callback
        };
      };
    });
  }
  static createInstance() {
    return new LightSpeedOutLeft();
  }
}
_defineProperty(LightSpeedOutLeft, "presetName", 'LightSpeedOutLeft');
//# sourceMappingURL=Lightspeed.js.map