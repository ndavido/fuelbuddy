/// <reference types="google.maps" />
import type { AnimatedRegion, LatLng } from 'react-native-maps';
export declare function mapMouseEventToMapEvent<T>(e?: google.maps.MapMouseEvent | null, defaultCoordinate?: LatLng | AnimatedRegion | null, map?: google.maps.Map | null, action?: string): T;
