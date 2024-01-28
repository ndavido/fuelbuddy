import type { ILayoutAnimationBuilder, LayoutAnimationFunction } from './reanimated2/layoutReanimation';
import type { StyleProps } from './reanimated2/commonTypes';
export declare function maybeBuild(layoutAnimationOrBuilder: ILayoutAnimationBuilder | LayoutAnimationFunction | Keyframe, style: StyleProps | undefined, displayName: string): LayoutAnimationFunction | Keyframe;
