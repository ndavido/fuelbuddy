import { Component } from 'react';
import type { TextProps } from 'react-native';
import { Text } from 'react-native';
import type { AnimateProps } from '../helperTypes';
declare class AnimatedTextClass extends Component<AnimateProps<TextProps>> {
    getNode(): Text;
}
export declare const AnimatedText: AnimatedText;
export type AnimatedText = typeof AnimatedTextClass & AnimatedTextClass & Text;
export {};
