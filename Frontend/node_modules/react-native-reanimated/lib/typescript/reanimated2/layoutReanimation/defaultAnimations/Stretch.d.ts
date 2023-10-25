import type { IEntryExitAnimationBuilder, EntryExitAnimationFunction } from '../animationBuilder/commonTypes';
import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
export declare class StretchInX extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class StretchInY extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class StretchOutX extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
export declare class StretchOutY extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => EntryExitAnimationFunction;
}
