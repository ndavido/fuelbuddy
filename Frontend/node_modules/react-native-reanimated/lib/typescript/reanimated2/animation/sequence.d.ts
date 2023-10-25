import type { AnimatableValue, ReduceMotion } from '../commonTypes';
export declare function withSequence<T extends AnimatableValue>(_reduceMotion: ReduceMotion, ...animations: T[]): T;
export declare function withSequence<T extends AnimatableValue>(...animations: T[]): T;
