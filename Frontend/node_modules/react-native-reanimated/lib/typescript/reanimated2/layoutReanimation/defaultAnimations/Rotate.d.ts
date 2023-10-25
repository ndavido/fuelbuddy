import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
import type { EntryAnimationsValues, ExitAnimationsValues, AnimationConfigFunction, IEntryAnimationBuilder, IExitAnimationBuilder } from '../animationBuilder/commonTypes';
export declare class RotateInDownLeft extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class RotateInDownRight extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class RotateInUpLeft extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class RotateInUpRight extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class RotateOutDownLeft extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class RotateOutDownRight extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class RotateOutUpLeft extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class RotateOutUpRight extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
