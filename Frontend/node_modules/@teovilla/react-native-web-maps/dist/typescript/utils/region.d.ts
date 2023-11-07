import type { BBox } from 'geojson';
import type { Region } from 'react-native-maps';
/**
 * Code taken from https://github.com/react-native-maps/react-native-maps/issues/356
 * Solution by https://github.com/MatsMaker
 */
export declare const getBoundByRegion: (region: Region, scale?: number) => BBox;
