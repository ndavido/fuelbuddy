import type { ILayoutAnimationBuilder, LayoutAnimationFunction } from '../animationBuilder/commonTypes';
import { BaseAnimationBuilder } from '../animationBuilder';
export declare class SequencedTransition extends BaseAnimationBuilder implements ILayoutAnimationBuilder {
    reversed: boolean;
    static createInstance<T extends typeof BaseAnimationBuilder>(this: T): InstanceType<T>;
    static reverse(): SequencedTransition;
    reverse(): SequencedTransition;
    build: () => LayoutAnimationFunction;
}
