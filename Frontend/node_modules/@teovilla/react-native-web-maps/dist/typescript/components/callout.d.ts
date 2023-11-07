import * as React from 'react';
import type { MapCalloutProps, LatLng, Point } from 'react-native-maps';
export type CalloutContextType = {
    coordinate: LatLng;
    calloutVisible: boolean;
    toggleCalloutVisible: () => void;
    markerSize: {
        width: number;
        height: number;
    };
    anchor: Point;
};
export declare const CalloutContext: React.Context<CalloutContextType>;
export declare function Callout(props: MapCalloutProps): JSX.Element | null;
