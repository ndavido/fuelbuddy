import type { EntryAnimationsValues, ExitAnimationsValues, AnimationConfigFunction, IEntryAnimationBuilder, IExitAnimationBuilder } from '../animationBuilder/commonTypes';
import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
export declare class SlideInRight extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class SlideInLeft extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class SlideOutRight extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class SlideOutLeft extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class SlideInUp extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class SlideInDown extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class SlideOutUp extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class SlideOutDown extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
