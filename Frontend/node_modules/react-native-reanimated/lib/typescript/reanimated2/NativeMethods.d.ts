import type { MeasuredDimensions } from './commonTypes';
import type { AnimatedRef } from './hook/commonTypes';
import type { Component } from 'react';
export declare let measure: <T extends Component>(animatedRef: AnimatedRef<T>) => MeasuredDimensions | null;
export declare let dispatchCommand: <T extends Component>(animatedRef: AnimatedRef<T>, commandName: string, args?: Array<unknown>) => void;
export declare let scrollTo: <T extends Component>(animatedRef: AnimatedRef<T>, x: number, y: number, animated: boolean) => void;
export declare let setGestureState: (handlerTag: number, newState: number) => void;
