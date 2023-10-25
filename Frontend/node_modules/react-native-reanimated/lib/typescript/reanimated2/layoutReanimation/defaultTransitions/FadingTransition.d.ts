import type { ILayoutAnimationBuilder, LayoutAnimationFunction } from '../animationBuilder/commonTypes';
import { BaseAnimationBuilder } from '../animationBuilder';
export declare class FadingTransition extends BaseAnimationBuilder implements ILayoutAnimationBuilder {
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    build: () => LayoutAnimationFunction;
}
