import type { AnimatableValue, ReduceMotion } from '../commonTypes';
type withDelayType = <T extends AnimatableValue>(delayMs: number, delayedAnimation: T, reduceMotion?: ReduceMotion) => T;
export declare const withDelay: withDelayType;
export {};
