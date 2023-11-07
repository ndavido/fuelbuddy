import * as Location from 'expo-location';
import type { UserLocationChangeEvent } from 'react-native-maps';
interface UseUserLocationOptions {
    requestPermission: boolean;
    onUserLocationChange?(e: UserLocationChangeEvent): void;
    followUserLocation: boolean;
    showUserLocation: boolean;
}
export declare function useUserLocation(options: UseUserLocationOptions): Location.LocationObject | undefined;
export {};
