import type { IEntryExitAnimationBuilder, EntryExitAnimationFunction, EntryAnimationsValues, ExitAnimationsValues, AnimationConfigFunction, IEntryAnimationBuilder, IExitAnimationBuilder } from '../animationBuilder/commonTypes';
import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
export declare class ZoomIn extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomInRotate extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomInLeft extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomInRight extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomInUp extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomInDown extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomInEasyUp extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class ZoomInEasyDown extends ComplexAnimationBuilder implements IEntryAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export declare class ZoomOut extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomOutRotate extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomOutLeft extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomOutRight extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomOutUp extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomOutDown extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class ZoomOutEasyUp extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export declare class ZoomOutEasyDown extends ComplexAnimationBuilder implements IExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
