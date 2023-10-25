import type { IEntryExitAnimationBuilder, EntryExitAnimationFunction, EntryAnimationsValues, ExitAnimationsValues, AnimationConfigFunction, IEntryAnimationBuilder, IExitAnimationBuilder } from '../animationBuilder/commonTypes';
import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
export declare class FlipInXUp extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class FlipInYLeft extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class FlipInXDown extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class FlipInYRight extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class FlipInEasyX extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class FlipInEasyY extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class FlipOutXUp extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class FlipOutYLeft extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class FlipOutXDown extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class FlipOutYRight extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class FlipOutEasyX extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class FlipOutEasyY extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
