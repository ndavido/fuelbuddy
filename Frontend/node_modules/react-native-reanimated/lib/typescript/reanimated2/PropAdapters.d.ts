import type { AnimatedPropsAdapterFunction } from './helperTypes';
type createAnimatedPropAdapterType = (adapter: AnimatedPropsAdapterFunction, nativeProps?: string[]) => AnimatedPropsAdapterFunction;
export declare const createAnimatedPropAdapter: createAnimatedPropAdapterType;
export {};
