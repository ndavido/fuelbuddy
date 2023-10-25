import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { Component } from 'react';
import type { AnimateProps } from '../helperTypes';
declare class AnimatedViewClass extends Component<AnimateProps<ViewProps>> {
    getNode(): View;
}
export type AnimatedView = typeof AnimatedViewClass & View;
export declare const AnimatedView: import("react").ComponentClass<AnimateProps<ViewProps>, any>;
export {};
