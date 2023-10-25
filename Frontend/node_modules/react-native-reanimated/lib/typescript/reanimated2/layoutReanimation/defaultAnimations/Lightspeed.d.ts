import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
import type { EntryExitAnimationFunction, IEntryExitAnimationBuilder } from '../animationBuilder/commonTypes';
export declare class LightSpeedInRight extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class LightSpeedInLeft extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class LightSpeedOutRight extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class LightSpeedOutLeft extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
