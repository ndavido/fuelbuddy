import type { AnimationCallback, AnimatableValue, ReduceMotion } from '../commonTypes';
type withRepeatType = <T extends AnimatableValue>(animation: T, numberOfReps?: number, reverse?: boolean, callback?: AnimationCallback, reduceMotion?: ReduceMotion) => T;
export declare const withRepeat: withRepeatType;
export {};
