import type { EntryExitAnimationFunction, IEntryExitAnimationBuilder } from '../animationBuilder/commonTypes';
import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
export declare class BounceIn extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceInDown extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceInUp extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceInLeft extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceInRight extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceOut extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceOutDown extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceOutUp extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceOutLeft extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
export declare class BounceOutRight extends ComplexAnimationBuilder implements IEntryExitAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static getDuration(): number;
    getDuration(): number;
    build: () => EntryExitAnimationFunction;
}
