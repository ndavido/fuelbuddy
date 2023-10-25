import type { ProgressAnimation } from '../animationBuilder/commonTypes';
export declare class ProgressTransitionManager {
    private _sharedElementCount;
    private _eventHandler;
    addProgressAnimation(viewTag: number, progressAnimation: ProgressAnimation): void;
    removeProgressAnimation(viewTag: number): void;
    private registerEventHandlers;
    private unregisterEventHandlers;
}
declare function createProgressTransitionRegister(): {
    addProgressAnimation: (viewTag: number, progressAnimation: ProgressAnimation) => void;
    removeProgressAnimation: (viewTag: number) => void;
    onTransitionStart: (viewTag: number, snapshot: any) => void;
    frame: (progress: number) => void;
    onAndroidFinishTransitioning: () => void;
    onTransitionEnd: (removeViews?: boolean) => void;
};
export type ProgressTransitionRegister = ReturnType<typeof createProgressTransitionRegister>;
export {};
