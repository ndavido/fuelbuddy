import type { ShareableRef, ShareableSyncDataHolderRef, Value3D, ValueRotation } from '../commonTypes';
import type { LayoutAnimationFunction, LayoutAnimationType } from '../layoutReanimation';
import type { WorkletRuntime } from '../runtimes';
export interface NativeReanimatedModule {
    installValueUnpacker(valueUnpackerCode: string): void;
    makeShareableClone<T>(value: T, shouldPersistRemote: boolean): ShareableRef<T>;
    makeSynchronizedDataHolder<T>(valueRef: ShareableRef<T>): ShareableSyncDataHolderRef<T>;
    getDataSynchronously<T>(ref: ShareableSyncDataHolderRef<T>): T;
    scheduleOnUI<T>(shareable: ShareableRef<T>): void;
    createWorkletRuntime(name: string, initializer: ShareableRef<() => void>): WorkletRuntime;
    scheduleOnRuntime<T>(workletRuntime: WorkletRuntime, worklet: ShareableRef<T>): void;
    registerEventHandler<T>(eventHandler: ShareableRef<T>, eventName: string, emitterReactTag: number): number;
    unregisterEventHandler(id: number): void;
    getViewProp<T>(viewTag: number, propName: string, callback?: (result: T) => void): Promise<T>;
    enableLayoutAnimations(flag: boolean): void;
    registerSensor(sensorType: number, interval: number, iosReferenceFrame: number, handler: ShareableRef<(data: Value3D | ValueRotation) => void>): number;
    unregisterSensor(sensorId: number): void;
    configureProps(uiProps: string[], nativeProps: string[]): void;
    subscribeForKeyboardEvents(handler: ShareableRef<number>, isStatusBarTranslucent: boolean): number;
    unsubscribeFromKeyboardEvents(listenerId: number): void;
    configureLayoutAnimation(viewTag: number, type: LayoutAnimationType, sharedTransitionTag: string, config: ShareableRef<Keyframe | LayoutAnimationFunction>): void;
    setShouldAnimateExitingForTag(viewTag: number, shouldAnimate: boolean): void;
}
export declare class NativeReanimated {
    private InnerNativeModule;
    constructor();
    makeShareableClone<T>(value: T, shouldPersistRemote: boolean): ShareableRef<T>;
    makeSynchronizedDataHolder<T>(valueRef: ShareableRef<T>): ShareableSyncDataHolderRef<T>;
    getDataSynchronously<T>(ref: ShareableSyncDataHolderRef<T>): T;
    scheduleOnUI<T>(shareable: ShareableRef<T>): void;
    createWorkletRuntime(name: string, initializer: ShareableRef<() => void>): WorkletRuntime;
    scheduleOnRuntime<T>(workletRuntime: WorkletRuntime, shareableWorklet: ShareableRef<T>): void;
    registerSensor(sensorType: number, interval: number, iosReferenceFrame: number, handler: ShareableRef<(data: Value3D | ValueRotation) => void>): number;
    unregisterSensor(sensorId: number): void;
    registerEventHandler<T>(eventHandler: ShareableRef<T>, eventName: string, emitterReactTag: number): number;
    unregisterEventHandler(id: number): void;
    getViewProp<T>(viewTag: number, propName: string, callback?: (result: T) => void): Promise<T>;
    configureLayoutAnimation(viewTag: number, type: LayoutAnimationType, sharedTransitionTag: string, config: ShareableRef<Keyframe | LayoutAnimationFunction>): void;
    setShouldAnimateExitingForTag(viewTag: number, shouldAnimate: boolean): void;
    enableLayoutAnimations(flag: boolean): void;
    configureProps(uiProps: string[], nativeProps: string[]): void;
    subscribeForKeyboardEvents(handler: ShareableRef<number>, isStatusBarTranslucent: boolean): number;
    unsubscribeFromKeyboardEvents(listenerId: number): void;
}
