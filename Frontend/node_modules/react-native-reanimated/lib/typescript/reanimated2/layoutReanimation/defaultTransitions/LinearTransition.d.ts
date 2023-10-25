import type { BaseAnimationBuilder } from '../animationBuilder';
import { ComplexAnimationBuilder } from '../animationBuilder';
import type { ILayoutAnimationBuilder, LayoutAnimationFunction } from '../animationBuilder/commonTypes';
export declare class LinearTransition extends ComplexAnimationBuilder implements ILayoutAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => LayoutAnimationFunction;
}
export declare const Layout: typeof LinearTransition;
