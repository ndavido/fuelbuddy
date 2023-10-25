import type { StyleLayoutAnimation } from './commonTypes';
import { ReduceMotion } from '../commonTypes';
import type { SharedValue, AnimatableValue, AnimationObject } from '../commonTypes';
export declare function initialUpdaterRun<T>(updater: () => T): T;
/**
 * Returns whether the motion should be reduced for a specified config.
 * By default returns the system setting.
 */
export declare function getReduceMotionFromConfig(config?: ReduceMotion): boolean;
/**
 * Returns the value that should be assigned to `animation.reduceMotion`
 * for a given config. If the config is not defined, `undefined` is returned.
 */
export declare function getReduceMotionForAnimation(config?: ReduceMotion): boolean | undefined;
type AnimationToDecoration<T extends AnimationObject | StyleLayoutAnimation, U extends AnimationObject | StyleLayoutAnimation> = T extends StyleLayoutAnimation ? Record<string, unknown> : U | (() => U) | AnimatableValue;
export declare function defineAnimation<T extends AnimationObject | StyleLayoutAnimation, // type that's supposed to be returned
U extends AnimationObject | StyleLayoutAnimation = T>(starting: AnimationToDecoration<T, U>, factory: () => T): T;
export declare function cancelAnimation<T>(sharedValue: SharedValue<T>): void;
export {};
