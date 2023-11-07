/**
 * This file is taken from `react-native-maps`
 * I guess this has been tested by the creators lol
 * Tried to type it but it's a pain
 * TODO: Type this bs
 * https://github.com/react-native-maps/react-native-maps/blob/master/src/Geojson.js
 */
export declare const makeOverlays: (features: GeoJSON.Feature[]) => {
    type: string;
    feature: GeoJSON.Feature;
    coordinates: number | undefined | GeoJSON.Position;
    holes: any;
}[];
export declare const flatten: <T extends []>(prev: T, curr: T) => never[];
export declare const makeOverlay: (coordinates: import("geojson").Position, feature: GeoJSON.Feature) => {
    feature: GeoJSON.Feature;
    coordinates: number | undefined | GeoJSON.Position;
    holes: any;
};
export declare const makePoint: (c: import("geojson").Position) => {
    latitude: number | undefined;
    longitude: number | undefined;
};
export declare const makeLine: (l: GeoJSON.Position[]) => {
    latitude: number | undefined;
    longitude: number | undefined;
}[];
export declare const makeCoordinates: (feature: GeoJSON.Feature) => {
    latitude: number | undefined;
    longitude: number | undefined;
}[] | {
    latitude: number | undefined;
    longitude: number | undefined;
}[][] | {
    latitude: number | undefined;
    longitude: number | undefined;
}[][][];
export declare const doesOverlayContainProperty: (overlay: any, property: any) => any;
export declare const getRgbaFromHex: (hex: string, alpha?: number) => string;
export declare const getColor: (props: any, overlay: any, colorType: any, overrideColorProp: any) => any;
export declare const getStrokeWidth: (props: any, overlay: any) => any;
