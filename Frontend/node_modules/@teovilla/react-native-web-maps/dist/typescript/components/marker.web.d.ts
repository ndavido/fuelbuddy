import React from 'react';
import type { MapMarkerProps } from 'react-native-maps';
interface MarkerState {
    calloutVisible: boolean;
}
export declare class Marker extends React.Component<MapMarkerProps, MarkerState> {
    constructor(props: MapMarkerProps);
    showCallout(): void;
    hideCallout(): void;
    render(): React.ReactNode;
}
export {};
