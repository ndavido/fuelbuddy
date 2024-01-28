import type { SharedValue, ShareableSyncDataHolderRef } from './commonTypes';
export declare function makeUIMutable<T>(initial: T, syncDataHolder?: ShareableSyncDataHolderRef<T>): {
    value: T;
    /**
     * _value prop should only be accessed by the valueSetter implementation
     * which may make the decision about updating the mutable value depending
     * on the provided new value. All other places should only attempt to modify
     * the mutable by assigning to value prop directly.
     */
    _value: T;
    modify: (modifier?: ((value: T) => T) | undefined, forceUpdate?: boolean) => void;
    addListener: (id: number, listener: (newValue: T) => void) => void;
    removeListener: (id: number) => void;
    _animation: null;
    _isReanimatedSharedValue: boolean;
};
export declare function makeMutable<T>(initial: T, oneWayReadsOnly?: boolean): SharedValue<T>;
export declare function makeRemote<T extends object>(initial?: T): T;
