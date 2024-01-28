'use strict';

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import React from 'react';
import { findNodeHandle, Platform } from 'react-native';
import WorkletEventHandler from '../reanimated2/WorkletEventHandler';
import '../reanimated2/layoutReanimation/animationsManager';
import invariant from 'invariant';
import { adaptViewConfig } from '../ConfigHelper';
import { RNRenderer } from '../reanimated2/platform-specific/RNRenderer';
import { configureLayoutAnimations, enableLayoutAnimations } from '../reanimated2/core';
import { SharedTransition, LayoutAnimationType } from '../reanimated2/layoutReanimation';
import { getShadowNodeWrapperFromRef } from '../reanimated2/fabricUtils';
import { removeFromPropsRegistry } from '../reanimated2/PropsRegistry';
import { getReduceMotionFromConfig } from '../reanimated2/animation/util';
import { maybeBuild } from '../animationBuilder';
import { SkipEnteringContext } from '../reanimated2/component/LayoutAnimationConfig';
import JSPropsUpdater from './JSPropsUpdater';
import { has, flattenArray } from './utils';
import setAndForwardRef from './setAndForwardRef';
import { isFabric, isJest, isWeb, shouldBeUseWeb } from '../reanimated2/PlatformChecker';
import { InlinePropManager } from './InlinePropManager';
import { PropsFilter } from './PropsFilter';
import { startWebLayoutAnimation, tryActivateLayoutTransition, configureWebLayoutAnimations, getReducedMotionFromConfig } from '../reanimated2/layoutReanimation/web';
const IS_WEB = isWeb();
const IS_FABRIC = isFabric();
function onlyAnimatedStyles(styles) {
  return styles.filter(style => style === null || style === void 0 ? void 0 : style.viewDescriptors);
}
function isSameAnimatedStyle(style1, style2) {
  // We cannot use equality check to compare useAnimatedStyle outputs directly.
  // Instead, we can compare its viewsRefs.
  return (style1 === null || style1 === void 0 ? void 0 : style1.viewsRef) === (style2 === null || style2 === void 0 ? void 0 : style2.viewsRef);
}
const isSameAnimatedProps = isSameAnimatedStyle;

/**
 * Lets you create an Animated version of any React Native component.
 *
 * @param component - The component you want to make animatable.
 * @returns A component that Reanimated is capable of animating.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
 */

/**
 * @deprecated Please use `Animated.FlatList` component instead of calling `Animated.createAnimatedComponent(FlatList)` manually.
 */ // @ts-ignore This is required to create this overload, since type of createAnimatedComponent is incorrect and doesn't include typeof FlatList
export function createAnimatedComponent(Component, options) {
  invariant(typeof Component !== 'function' || Component.prototype && Component.prototype.isReactComponent, `Looks like you're passing a function component \`${Component.name}\` to \`createAnimatedComponent\` function which supports only class components. Please wrap your function component with \`React.forwardRef()\` or use a class component instead.`);
  class AnimatedComponent extends React.Component {
    constructor(props) {
      super(props);
      _defineProperty(this, "_styles", null);
      _defineProperty(this, "_animatedProps", void 0);
      _defineProperty(this, "_viewTag", -1);
      _defineProperty(this, "_isFirstRender", true);
      _defineProperty(this, "animatedStyle", {
        value: {}
      });
      _defineProperty(this, "_component", null);
      _defineProperty(this, "_sharedElementTransition", null);
      _defineProperty(this, "_jsPropsUpdater", new JSPropsUpdater());
      _defineProperty(this, "_InlinePropManager", new InlinePropManager());
      _defineProperty(this, "_PropsFilter", new PropsFilter());
      _defineProperty(this, "_viewInfo", void 0);
      _defineProperty(this, "context", void 0);
      _defineProperty(this, "_setComponentRef", setAndForwardRef({
        getForwardedRef: () => this.props.forwardedRef,
        setLocalRef: ref => {
          // TODO update config

          const tag = IS_WEB ? ref : findNodeHandle(ref);
          const {
            layout,
            entering,
            exiting,
            sharedTransitionTag
          } = this.props;
          if ((layout || entering || exiting || sharedTransitionTag) && tag != null) {
            var _this$context;
            if (!shouldBeUseWeb()) {
              enableLayoutAnimations(true, false);
            }
            if (layout) {
              configureLayoutAnimations(tag, LayoutAnimationType.LAYOUT, maybeBuild(layout, undefined /* We don't have to warn user if style has common properties with animation for LAYOUT */, AnimatedComponent.displayName));
            }
            const skipEntering = (_this$context = this.context) === null || _this$context === void 0 ? void 0 : _this$context.current;
            if (entering && !skipEntering) {
              var _this$props;
              configureLayoutAnimations(tag, LayoutAnimationType.ENTERING, maybeBuild(entering, (_this$props = this.props) === null || _this$props === void 0 ? void 0 : _this$props.style, AnimatedComponent.displayName));
            }
            if (exiting) {
              const reduceMotionInExiting = 'getReduceMotion' in exiting && typeof exiting.getReduceMotion === 'function' ? getReduceMotionFromConfig(exiting.getReduceMotion()) : getReduceMotionFromConfig();
              if (!reduceMotionInExiting) {
                var _this$props2;
                configureLayoutAnimations(tag, LayoutAnimationType.EXITING, maybeBuild(exiting, (_this$props2 = this.props) === null || _this$props2 === void 0 ? void 0 : _this$props2.style, AnimatedComponent.displayName));
              }
            }
            if (sharedTransitionTag && !IS_WEB) {
              const sharedElementTransition = this.props.sharedTransitionStyle ?? new SharedTransition();
              const reduceMotionInTransition = getReduceMotionFromConfig(sharedElementTransition.getReduceMotion());
              if (!reduceMotionInTransition) {
                sharedElementTransition.registerTransition(tag, sharedTransitionTag);
                this._sharedElementTransition = sharedElementTransition;
              }
            }
          }
          if (ref !== this._component) {
            this._component = ref;
          }
        }
      }));
      if (isJest()) {
        this.animatedStyle = {
          value: {}
        };
      }
    }
    componentDidMount() {
      this._attachNativeEvents();
      this._jsPropsUpdater.addOnJSPropsChangeListener(this);
      this._attachAnimatedStyles();
      this._InlinePropManager.attachInlineProps(this, this._getViewInfo());
      if (IS_WEB) {
        configureWebLayoutAnimations();
        if (!this.props.entering) {
          this._isFirstRender = false;
          return;
        }
        if (getReducedMotionFromConfig(this.props.entering)) {
          this._isFirstRender = false;
          return;
        }
        startWebLayoutAnimation(this.props, this._component, LayoutAnimationType.ENTERING);
      }
      this._isFirstRender = false;
    }
    componentWillUnmount() {
      var _this$_sharedElementT;
      this._detachNativeEvents();
      this._jsPropsUpdater.removeOnJSPropsChangeListener(this);
      this._detachStyles();
      this._InlinePropManager.detachInlineProps();
      (_this$_sharedElementT = this._sharedElementTransition) === null || _this$_sharedElementT === void 0 ? void 0 : _this$_sharedElementT.unregisterTransition(this._viewTag);
      if (IS_WEB && this.props.exiting && !getReducedMotionFromConfig(this.props.exiting)) {
        startWebLayoutAnimation(this.props, this._component, LayoutAnimationType.EXITING);
      }
    }
    _getEventViewRef() {
      var _this$_component, _getScrollableNode, _ref;
      // Make sure to get the scrollable node for components that implement
      // `ScrollResponder.Mixin`.
      return (_this$_component = this._component) !== null && _this$_component !== void 0 && _this$_component.getScrollableNode ? (_getScrollableNode = (_ref = this._component).getScrollableNode) === null || _getScrollableNode === void 0 ? void 0 : _getScrollableNode.call(_ref) : this._component;
    }
    _attachNativeEvents() {
      const node = this._getEventViewRef();
      let viewTag = null; // We set it only if needed

      for (const key in this.props) {
        const prop = this.props[key];
        if (has('current', prop) && prop.current instanceof WorkletEventHandler) {
          if (viewTag === null) {
            viewTag = findNodeHandle(options !== null && options !== void 0 && options.setNativeProps ? this : node);
          }
          prop.current.registerForEvents(viewTag, key);
        }
      }
    }
    _detachNativeEvents() {
      for (const key in this.props) {
        const prop = this.props[key];
        if (has('current', prop) && prop.current instanceof WorkletEventHandler) {
          prop.current.unregisterFromEvents();
        }
      }
    }
    _detachStyles() {
      if (IS_WEB && this._styles !== null) {
        for (const style of this._styles) {
          if (style !== null && style !== void 0 && style.viewsRef) {
            style.viewsRef.remove(this);
          }
        }
      } else if (this._viewTag !== -1 && this._styles !== null) {
        var _this$props$animatedP;
        for (const style of this._styles) {
          style.viewDescriptors.remove(this._viewTag);
        }
        if ((_this$props$animatedP = this.props.animatedProps) !== null && _this$props$animatedP !== void 0 && _this$props$animatedP.viewDescriptors) {
          this.props.animatedProps.viewDescriptors.remove(this._viewTag);
        }
        if (IS_FABRIC) {
          removeFromPropsRegistry(this._viewTag);
        }
      }
    }
    _reattachNativeEvents(prevProps) {
      for (const key in prevProps) {
        const prop = this.props[key];
        if (has('current', prop) && prop.current instanceof WorkletEventHandler && prop.current.reattachNeeded) {
          prop.current.unregisterFromEvents();
        }
      }
      let viewTag = null;
      for (const key in this.props) {
        const prop = this.props[key];
        if (has('current', prop) && prop.current instanceof WorkletEventHandler && prop.current.reattachNeeded) {
          if (viewTag === null) {
            const node = this._getEventViewRef();
            viewTag = findNodeHandle(options !== null && options !== void 0 && options.setNativeProps ? this : node);
          }
          prop.current.registerForEvents(viewTag, key);
          prop.current.reattachNeeded = false;
        }
      }
    }
    _updateFromNative(props) {
      if (options !== null && options !== void 0 && options.setNativeProps) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        options.setNativeProps(this._component, props);
      } else {
        var _this$_component2, _this$_component2$set;
        // eslint-disable-next-line no-unused-expressions
        (_this$_component2 = this._component) === null || _this$_component2 === void 0 ? void 0 : (_this$_component2$set = _this$_component2.setNativeProps) === null || _this$_component2$set === void 0 ? void 0 : _this$_component2$set.call(_this$_component2, props);
      }
    }
    _getViewInfo() {
      var _this$_component3, _getAnimatableRef, _ref2;
      if (this._viewInfo !== undefined) {
        return this._viewInfo;
      }
      let viewTag;
      let viewName;
      let shadowNodeWrapper = null;
      let viewConfig;
      // Component can specify ref which should be animated when animated version of the component is created.
      // Otherwise, we animate the component itself.
      const component = (_this$_component3 = this._component) !== null && _this$_component3 !== void 0 && _this$_component3.getAnimatableRef ? (_getAnimatableRef = (_ref2 = this._component).getAnimatableRef) === null || _getAnimatableRef === void 0 ? void 0 : _getAnimatableRef.call(_ref2) : this;
      if (IS_WEB) {
        // At this point I assume that `_setComponentRef` was already called and `_component` is set.
        // `this._component` on web represents HTMLElement of our component, that's why we use casting
        viewTag = this._component;
        viewName = null;
        shadowNodeWrapper = null;
        viewConfig = null;
      } else {
        var _hostInstance$viewCon;
        // hostInstance can be null for a component that doesn't render anything (render function returns null). Example: svg Stop: https://github.com/react-native-svg/react-native-svg/blob/develop/src/elements/Stop.tsx
        const hostInstance = RNRenderer.findHostInstance_DEPRECATED(component);
        if (!hostInstance) {
          throw new Error('[Reanimated] Cannot find host instance for this component. Maybe it renders nothing?');
        }
        // we can access view tag in the same way it's accessed here https://github.com/facebook/react/blob/e3f4eb7272d4ca0ee49f27577156b57eeb07cf73/packages/react-native-renderer/src/ReactFabric.js#L146
        viewTag = hostInstance === null || hostInstance === void 0 ? void 0 : hostInstance._nativeTag;
        /**
         * RN uses viewConfig for components for storing different properties of the component(example: https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/ScrollView/ScrollViewNativeComponent.js#L24).
         * The name we're looking for is in the field named uiViewClassName.
         */
        viewName = hostInstance === null || hostInstance === void 0 ? void 0 : (_hostInstance$viewCon = hostInstance.viewConfig) === null || _hostInstance$viewCon === void 0 ? void 0 : _hostInstance$viewCon.uiViewClassName;
        viewConfig = hostInstance === null || hostInstance === void 0 ? void 0 : hostInstance.viewConfig;
        if (IS_FABRIC) {
          shadowNodeWrapper = getShadowNodeWrapperFromRef(this);
        }
      }
      this._viewInfo = {
        viewTag,
        viewName,
        shadowNodeWrapper,
        viewConfig
      };
      return this._viewInfo;
    }
    _attachAnimatedStyles() {
      var _this$props$animatedP2, _this$props$animatedP3;
      const styles = this.props.style ? onlyAnimatedStyles(flattenArray(this.props.style)) : [];
      const prevStyles = this._styles;
      this._styles = styles;
      const prevAnimatedProps = this._animatedProps;
      this._animatedProps = this.props.animatedProps;
      const {
        viewTag,
        viewName,
        shadowNodeWrapper,
        viewConfig
      } = this._getViewInfo();

      // update UI props whitelist for this view
      const hasReanimated2Props = ((_this$props$animatedP2 = this.props.animatedProps) === null || _this$props$animatedP2 === void 0 ? void 0 : _this$props$animatedP2.viewDescriptors) || styles.length;
      if (hasReanimated2Props && viewConfig) {
        adaptViewConfig(viewConfig);
      }
      this._viewTag = viewTag;

      // remove old styles
      if (prevStyles) {
        // in most of the cases, views have only a single animated style and it remains unchanged
        const hasOneSameStyle = styles.length === 1 && prevStyles.length === 1 && isSameAnimatedStyle(styles[0], prevStyles[0]);
        if (!hasOneSameStyle) {
          // otherwise, remove each style that is not present in new styles
          for (const prevStyle of prevStyles) {
            const isPresent = styles.some(style => isSameAnimatedStyle(style, prevStyle));
            if (!isPresent) {
              prevStyle.viewDescriptors.remove(viewTag);
            }
          }
        }
      }
      styles.forEach(style => {
        style.viewDescriptors.add({
          tag: viewTag,
          name: viewName,
          shadowNodeWrapper
        });
        if (isJest()) {
          /**
           * We need to connect Jest's TestObject instance whose contains just props object
           * with the updateProps() function where we update the properties of the component.
           * We can't update props object directly because TestObject contains a copy of props - look at render function:
           * const props = this._filterNonAnimatedProps(this.props);
           */
          this.animatedStyle.value = {
            ...this.animatedStyle.value,
            ...style.initial.value
          };
          style.animatedStyle.current = this.animatedStyle;
        }
      });

      // detach old animatedProps
      if (prevAnimatedProps && !isSameAnimatedProps(prevAnimatedProps, this.props.animatedProps)) {
        prevAnimatedProps.viewDescriptors.remove(viewTag);
      }

      // attach animatedProps property
      if ((_this$props$animatedP3 = this.props.animatedProps) !== null && _this$props$animatedP3 !== void 0 && _this$props$animatedP3.viewDescriptors) {
        this.props.animatedProps.viewDescriptors.add({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          tag: viewTag,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          name: viewName,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          shadowNodeWrapper: shadowNodeWrapper
        });
      }
    }
    componentDidUpdate(prevProps, _prevState,
    // This type comes straight from React
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot) {
      this._reattachNativeEvents(prevProps);
      this._attachAnimatedStyles();
      this._InlinePropManager.attachInlineProps(this, this._getViewInfo());

      // Snapshot won't be undefined because it comes from getSnapshotBeforeUpdate method
      if (IS_WEB && snapshot !== null && this.props.layout && !getReducedMotionFromConfig(this.props.layout)) {
        tryActivateLayoutTransition(this.props, this._component, snapshot);
      }
    }
    // This is a component lifecycle method from React, therefore we are not calling it directly.
    // It is called before the component gets rerendered. This way we can access components' position before it changed
    // and later on, in componentDidUpdate, calculate translation for layout transition.
    getSnapshotBeforeUpdate() {
      if (this._component.getBoundingClientRect !== undefined) {
        return this._component.getBoundingClientRect();
      }
      return null;
    }
    render() {
      const props = this._PropsFilter.filterNonAnimatedProps(this);
      if (isJest()) {
        props.animatedStyle = this.animatedStyle;
      }

      // Layout animations on web are set inside `componentDidMount` method, which is called after first render.
      // Because of that we can encounter a situation in which component is visible for a short amount of time, and later on animation triggers.
      // I've tested that on various browsers and devices and it did not happen to me. To be sure that it won't happen to someone else,
      // I've decided to hide component at first render. Its visibility is reset in `componentDidMount`.
      if (this._isFirstRender && IS_WEB && props.entering && !getReducedMotionFromConfig(props.entering)) {
        props.style = {
          ...(props.style ?? {}),
          visibility: 'hidden' // Hide component until `componentDidMount` triggers
        };
      }

      const platformProps = Platform.select({
        web: {},
        default: {
          collapsable: false
        }
      });
      return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
        // Casting is used here, because ref can be null - in that case it cannot be assigned to HTMLElement.
        // After spending some time trying to figure out what to do with this problem, we decided to leave it this way
        ref: this._setComponentRef
      }, platformProps));
    }
  }
  _defineProperty(AnimatedComponent, "displayName", void 0);
  _defineProperty(AnimatedComponent, "contextType", SkipEnteringContext);
  AnimatedComponent.displayName = `AnimatedComponent(${Component.displayName || Component.name || 'Component'})`;
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    return /*#__PURE__*/React.createElement(AnimatedComponent, _extends({}, props, ref === null ? null : {
      forwardedRef: ref
    }));
  });
}
//# sourceMappingURL=createAnimatedComponent.js.map