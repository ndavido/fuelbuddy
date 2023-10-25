import type { ImageProps } from 'react-native';
import { Image } from 'react-native';
import { Component } from 'react';
import type { AnimateProps } from '../helperTypes';
declare class AnimatedImageClass extends Component<AnimateProps<ImageProps>> {
    getNode(): Image;
}
export type AnimatedImage = typeof AnimatedImageClass & Image;
export declare const AnimatedImage: AnimatedImage;
export {};
