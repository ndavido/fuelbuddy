import { Component } from 'react';
import type { ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native';
import type { SharedValue } from '../commonTypes';
import type { AnimateProps } from '../helperTypes';
export interface AnimatedScrollViewProps extends ScrollViewProps {
    scrollViewOffset?: SharedValue<number>;
}
declare class AnimatedScrollViewClass extends Component<AnimateProps<AnimatedScrollViewProps>> {
    getNode(): ScrollView;
}
interface AnimatedScrollViewInterface extends ScrollView {
    getNode(): ScrollView;
}
export declare const AnimatedScrollView: AnimatedScrollView;
export type AnimatedScrollView = typeof AnimatedScrollViewClass & AnimatedScrollViewInterface;
export {};
