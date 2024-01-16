'use strict';

const mockTargetValues = {
  targetOriginX: 0,
  targetOriginY: 0,
  targetWidth: 0,
  targetHeight: 0,
  targetGlobalOriginX: 0,
  targetGlobalOriginY: 0,
  targetBorderRadius: 0,
  windowWidth: 0,
  windowHeight: 0,
  currentOriginX: 0,
  currentOriginY: 0,
  currentWidth: 0,
  currentHeight: 0,
  currentGlobalOriginX: 0,
  currentGlobalOriginY: 0,
  currentBorderRadius: 0
};
export function maybeBuild(layoutAnimationOrBuilder, style, displayName) {
  const isAnimationBuilder = value => 'build' in layoutAnimationOrBuilder && typeof layoutAnimationOrBuilder.build === 'function';
  if (isAnimationBuilder(layoutAnimationOrBuilder)) {
    const animationFactory = layoutAnimationOrBuilder.build();
    const layoutAnimation = animationFactory(mockTargetValues);
    const animatedStyle = layoutAnimation.animations;
    const getCommonProperties = (obj1, obj2) => Object.keys(obj1).filter(key => Object.prototype.hasOwnProperty.call(obj2, key));
    const commonProperties = getCommonProperties(animatedStyle, style || {});
    if (commonProperties.length > 0) {
      console.warn(`[Reanimated] ${commonProperties.length === 1 ? 'Property' : 'Properties: '} "${commonProperties}" of ${displayName} may be overwritten with layout animation. Please create a wrapper with the layout animation you want to apply.`);
    }
    return layoutAnimationOrBuilder.build();
  } else {
    return layoutAnimationOrBuilder;
  }
}
//# sourceMappingURL=animationBuilder.js.map