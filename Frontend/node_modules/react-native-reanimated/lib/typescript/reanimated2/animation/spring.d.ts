import type { AnimationCallback, AnimatableValue } from '../commonTypes';
import type { SpringConfig } from './springUtils';
type withSpringType = <T extends AnimatableValue>(toValue: T, userConfig?: SpringConfig, callback?: AnimationCallback) => T;
export declare const withSpring: withSpringType;
export {};
