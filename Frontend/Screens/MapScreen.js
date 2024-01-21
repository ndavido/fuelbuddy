import React, {useState, useEffect, useRef, useMemo} from "react";
import {View, Text, StyleSheet, Animated, Platform, Linking, Button, TextInput, Modal, StatusBar} from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import MyMarker from '../Components/mymarker';
import * as Location from "expo-location";

const isWeb = Platform.OS !== "ios" && Platform.OS !== "android";

let MapView, MapViewDirections;
if (!isWeb) {
  MapView = require("react-native-map-clustering").default;
  MapViewDirections = require("react-native-maps-directions").default;
}

// Styling
import {H2, H3, H4, H5, H6} from "../styles/text";
import {Container, ButtonContainer, MenuButton} from "../styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiKey = process.env.googleMapsApiKey;

const MapScreen = () => {
    const [petrolStations, setPetrolStations] = useState([]);
    const [location, setLocation] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const mapRef = useRef(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [newPetrolPrice, setNewPetrolPrice] = useState('');
    const [newDieselPrice, setNewDieselPrice] = useState('');

    const snapPoints = useMemo(() => ['15%', '40%', '90%'], []);

    useEffect(() => {
        const fetchLocationAndPetrolStations = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Permission to access location was denied");
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({});
                setLocation(location);

                // TODO DEV ONLY
                console.log("User Location: ", location);
                mapRef.current?.animateToRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });

                // Fetch petrol stations using the obtained location
                fetchPetrolStations(location);

                Location.watchPositionAsync({distanceInterval: 10}, (newLocation) => {
                    // Update the user's live location
                    setLocation(newLocation);

                    // Animate the map to the new location
                    mapRef.current?.animateToRegion({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                });

            } catch (error) {
                console.error("Error fetching user location:", error);
            }
        };
        const fetchUserInfo = async () => {
            try {
                const userDataJson = await AsyncStorage.getItem('userData');
                if (userDataJson) {
                    setUserInfo(JSON.parse(userDataJson));
                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        fetchUserInfo();
        fetchLocationAndPetrolStations();
    }, []);

    const fetchPetrolStations = async (location) => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;
            const config = {
                headers: {
                    "X-API-Key": apiKey,
                },
            };
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/fuel_stations`,
                config
            );
            const stations = await response.json();
            console.log("Stations: ", stations);
            setPetrolStations(stations);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdatePress = async () => {
        try {
            // Prepare the payload
            const payload = {
                fuelPrices: [
                    {
                        station_id: selectedStation.id, // Assuming your station object has an 'id'
                        petrol_price: newPetrolPrice,
                        diesel_price: newDieselPrice,
                        timestamp: new Date().toISOString(),
                    },
                ],
            };

            // Make the API request
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/store_fuel_prices`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                console.log('Successfully updated fuel prices');
                // Optionally, update your local state or perform additional actions
            } else {
                console.error('Failed to update fuel prices');
                // Handle error accordingly
            }
        } catch (error) {
            console.error('Error updating fuel prices:', error);
        }

        setUpdateModalVisible(false);
    };

    const handleLikePress = async () => {
        try {
            if (selectedStation) {
                const payload = {
                    username: userInfo.username,
                    station_id: selectedStation.id,
                };

                console.log("Payload: ", payload)

                const apiKey = process.env.REACT_NATIVE_API_KEY;
                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': apiKey,
                    },
                    body: JSON.stringify(payload),
                };

                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/manage_favorite_fuel_station`,
                    config
                );

                if (response.ok) {
                    console.log('Favorite status updated successfully');
                } else {
                    console.error('Failed to update favorite status');
                }
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    const handleMarkerPress = (station) => {
        setSelectedStation(station);

        // TODO Remove Dev Only
        console.log("Selected Station: ", station);
    };

    const handleRoutePress = () => {
        if (selectedStation && location) {
            const origin = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            const destination = {
                latitude: selectedStation.location.latitude,
                longitude: selectedStation.location.longitude,
            };

            const waypoints = [
                {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
                destination,
            ];

            const directionsOptions = {
                origin,
                destination,
                waypoints,
                optimizeWaypoints: true,
                travelMode: 'DRIVING',
                unitSystem: 'METRIC',
            };

            setUpdateModalVisible(false);

            mapRef.current.fitToCoordinates(waypoints, {
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            });
        }
    };


    const renderMap = () => {
        if (isWeb) {
            return (
                <View style={{flex: 1}}>
                    <H2>Switch to Mobile plz x</H2>
                </View>
            );
        } else {
            return (
                <MapView
                    style={{flex: 1}}
                    initialRegion={{
                        latitude: 53.98444410090042,
                        longitude: -6.393485737521783,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    ref={mapRef}
                    showsUserLocation={true}
                    userInterfaceStyle={"dark"}
                >
                    {petrolStations.map((station, index) => (
                        <MyMarker
                            key={index}
                            coordinate={{
                                latitude: station.location.latitude,
                                longitude: station.location.longitude,
                            }}
                            onPress={() => handleMarkerPress(station)}
                        />
                    ))}
                    {selectedStation && location && (
                        <MapViewDirections
                            timePrecision="now"
                            origin={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            destination={{
                                latitude: selectedStation.location.latitude,
                                longitude: selectedStation.location.longitude,
                            }}
                            waypoints={[
                                {
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                },
                            ]}
                            apikey={apiKey}
                            strokeWidth={3}
                            strokeColor="hotpink"
                        />
                    )}
                </MapView>
            );
        }
    };

    const renderBottomSheet = () => {
        if (!isWeb) {
            return (
                <BottomSheet snapPoints={snapPoints}>
                    {selectedStation && (
                        <Container>
                            <H3 weight='600' style={{lineHeight: 24}}>{selectedStation.name}</H3>
                            <H6 style={{opacity: 0.6, lineHeight: 16}}>Fuel Station</H6>
                            <ButtonContainer>
                                <MenuButton title='Route To Station'
                                            bgColor='#3891FA'
                                            txtColor='white'
                                            width='50%'
                                            emoji="📍"
                                            onPress={handleRoutePress}/>
                                <MenuButton title=''
                                            bgColor='white'
                                            txtColor='white'
                                            width='40px'
                                            emoji="❤️"
                                            onPress={handleLikePress}/>
                                <MenuButton title=''
                                            bgColor='#6BFF91'
                                            txtColor='white'
                                            width='40px'
                                            emoji="➕"
                                            onPress={() => setUpdateModalVisible(true)}/>
                            </ButtonContainer>
                            <H4>Current Prices</H4>
                            <H4>About</H4>
                            <H6 style={{opacity: 0.6}}>NOT WORKING!!! About the petrol station amenities such as
                                bathrooms </H6>
                            <H6 style={{opacity: 0.6}}>{selectedStation.details}</H6>
                            <H6>Address</H6>
                            <H6 style={{opacity: 0.6}}>{selectedStation.address},</H6>
                            <H6 style={{opacity: 0.6}}>Ireland</H6>
                            <H4>Past Prices</H4>
                        </Container>
                    )}
                </BottomSheet>
            );
        } else {
            return (
                <H4>Note: The Map Clustering, The bottom Sheet, The Map Directions & The Map itself doesnt work on Web</H4>
            );
        }
    };

    return (
        <View style={{flex: 1}}>
            {renderMap()}
            {renderBottomSheet()}
        </View>
    );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default MapScreen;
