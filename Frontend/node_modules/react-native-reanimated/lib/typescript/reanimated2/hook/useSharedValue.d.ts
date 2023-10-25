import type { SharedValue } from '../commonTypes';
export declare function useSharedValue<T>(init: T, oneWayReadsOnly?: boolean): SharedValue<T>;
