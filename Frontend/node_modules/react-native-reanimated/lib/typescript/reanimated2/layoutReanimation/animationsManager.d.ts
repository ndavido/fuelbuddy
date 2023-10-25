import type { LayoutAnimationFunction, LayoutAnimationsValues } from './animationBuilder';
import { LayoutAnimationType } from './animationBuilder';
declare function createLayoutAnimationManager(): {
    start(tag: number, type: LayoutAnimationType, yogaValues: LayoutAnimationsValues, config: LayoutAnimationFunction): void;
    stop(tag: number): void;
};
export type LayoutAnimationsManager = ReturnType<typeof createLayoutAnimationManager>;
export {};
