import React, {useState, useEffect, useRef, useMemo} from "react";
import {View, Text, StyleSheet, Animated, Platform, Linking, Button, TextInput, Modal, StatusBar} from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import MyMarker from '../Components/mymarker';
import * as Location from "expo-location";
import MapView from "react-native-maps";

const isWeb = Platform.OS !== "ios" && Platform.OS !== "android";

let MapViewDirections;
if (!isWeb) {
    // MapView = require("react-native-map-clustering").default;
    MapViewDirections = require("react-native-maps-directions").default;
}

const url = process.env.REACT_APP_BACKEND_URL

// Styling
import {H2, H3, H4, H5, H6, H7, H8} from "../styles/text";
import {Container, ButtonContainer, MenuButton, Cardsml, CardContainer} from "../styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AnimatedGenericButton, AnimatedHeartButton, TAnimatedGenericButton} from "../styles/AnimatedIconButton";
import CustomMarker from "../Components/customMarker";


const apiKey = process.env.googleMapsApiKey;

const MapScreen = () => {
    const [petrolStations, setPetrolStations] = useState([]);
    const [location, setLocation] = useState(null);
    const [userInfo, setUserInfo] = useState({});

    const [heartActive, setHeartActive] = useState(false);

    const mapRef = useRef(null);
    const [estimatedDuration, setEstimatedDuration] = useState(null);
    const [estimatedDistance, setEstimatedDistance] = useState(null);

    const [selectedStation, setSelectedStation] = useState(null);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [newPetrolPrice, setNewPetrolPrice] = useState('');
    const [newDieselPrice, setNewDieselPrice] = useState('');

    const [showStationInfo, setShowStationInfo] = useState(true);
    const [showRouteInfo, setShowRouteInfo] = useState(false);
    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => ['20%', '40%', '90%'], []);

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

                fetchPetrolStations(location);

                Location.watchPositionAsync({distanceInterval: 10}, (newLocation) => {

                    setLocation(newLocation);

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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/fuel_stations`, config);
            const stations = await response.json();

            setPetrolStations(stations);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdatePress = async () => {
        try {
            const payload = {
                fuelPrices: [{
                    station_id: selectedStation.id,
                    petrol_price: newPetrolPrice, diesel_price: newDieselPrice, timestamp: new Date().toISOString(),
                },],
            };

            // Make the API request
            const response = await fetch(`${url}/store_fuel_prices`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Successfully updated fuel prices');
            } else {
                console.error('Failed to update fuel prices');
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
                    username: userInfo.username, station_id: selectedStation.id,
                };

                console.log("Payload: ", payload)

                const apiKey = process.env.REACT_NATIVE_API_KEY;
                const config = {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json', 'X-API-Key': apiKey,
                    }, body: JSON.stringify(payload),
                };

                const response = await fetch(`${url}/manage_favorite_fuel_station`, config);

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

        setShowStationInfo(true);
        setShowRouteInfo(false);
        // TODO Remove Dev Only
        console.log("Selected Station: ", station);
    };

    const handleRoutePress = () => {
        if (selectedStation && location) {
            const origin = {
                latitude: location.coords.latitude, longitude: location.coords.longitude,
            };

            const destination = {
                latitude: selectedStation.location.latitude, longitude: selectedStation.location.longitude,
            };

            const directionsOptions = {
                origin, destination, waypoints: [{
                    latitude: location.coords.latitude, longitude: location.coords.longitude,
                },], optimizeWaypoints: true, travelMode: 'DRIVING', unitSystem: 'METRIC',
            };

            setUpdateModalVisible(false);

            mapRef.current.fitToCoordinates([{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }, {
                latitude: selectedStation.location.latitude,
                longitude: selectedStation.location.longitude
            },], {edgePadding: {top: 50, right: 50, bottom: 50, left: 50}});

            const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const duration = data.routes[0].legs[0].duration.text;
                    const distance = data.routes[0].legs[0].distance.text;

                    console.log('Estimated Duration:', duration);
                    console.log('Distance:', distance);

                    setEstimatedDuration(duration);
                    setEstimatedDistance(distance);

                })
                .catch(error => {
                    console.error('Error fetching directions:', error);
                });
            setShowStationInfo(false);
            setShowRouteInfo(true);
        }
    };

    const handleCancelPress = () => {
        setShowStationInfo(true);
        setShowRouteInfo(false);
    };

    const renderMap = () => {
        if (isWeb) {
            return (<View style={{flex: 1}}>
                <H2>Switch to Mobile plz x</H2>
            </View>);
        } else {
            return (<MapView
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
                {petrolStations.map((station, index) => (<CustomMarker
                    key={index}
                    coordinate={{
                        latitude: station.location.latitude, longitude: station.location.longitude,
                    }}
                    onPress={() => handleMarkerPress(station)}
                />))}
                {selectedStation && location && showRouteInfo && (<MapViewDirections
                    timePrecision="now"
                    origin={{
                        latitude: location.coords.latitude, longitude: location.coords.longitude,
                    }}
                    destination={{
                        latitude: selectedStation.location.latitude,
                        longitude: selectedStation.location.longitude,
                    }}
                    waypoints={[{
                        latitude: location.coords.latitude, longitude: location.coords.longitude,
                    },]}
                    apikey={apiKey}
                    strokeWidth={3}
                    strokeColor="hotpink"
                />)}
            </MapView>);
        }
    };

    const renderStationBottomSheet = () => {
        if (!isWeb && showStationInfo) {
            return (
                <BottomSheet snapPoints={snapPoints}
                             backgroundStyle={{
                                 backgroundColor: '#F7F7F7'
                             }}>
                    {selectedStation && showStationInfo && (
                        <Container>
                            <H3 weight='600' style={{lineHeight: 24}}>{selectedStation.name}</H3>
                            <H6 style={{opacity: 0.6, lineHeight: 16}}>Fuel Station</H6>
                            <ButtonContainer>
                                <TAnimatedGenericButton text="Route To Station" onPress={handleRoutePress}/>
                                <AnimatedHeartButton initialIsActive={heartActive} onPress={handleLikePress}/>
                                <AnimatedGenericButton onPress={() => setUpdateModalVisible(true)}/>
                            </ButtonContainer>
                            <H4>Current Prices</H4>
                            <CardContainer>
                                <Cardsml>
                                    <H5 style={{opacity: 0.6, textAlign: 'center'}}>Petrol</H5>
                                    <H3 style={{textAlign: 'center'}}>No Price Avaliable</H3>
                                    <H8 style={{opacity: 0.6, textAlign: 'center'}}>Last Updated: NA</H8>
                                </Cardsml>
                                <Cardsml>
                                    <H5 style={{opacity: 0.6, textAlign: 'center'}}>Diesel</H5>
                                    <H3 style={{textAlign: 'center'}}>No Price Avaliable</H3>
                                    <H8 style={{opacity: 0.6, textAlign: 'center'}}>Last Updated: NA</H8>
                                </Cardsml>
                            </CardContainer>
                            <H4>About</H4>
                            <H6 style={{opacity: 0.6}}>NOT WORKING!!! About the petrol station amenities such as
                                bathrooms </H6>
                            <H6 style={{opacity: 0.6}}>{selectedStation.details}</H6>
                            <H6>Address</H6>
                            <H6 style={{opacity: 0.6}}>{selectedStation.address},</H6>
                            <H6 style={{opacity: 0.6}}>Ireland</H6>
                            <H4 tmargin="20px">Past Prices</H4>
                        </Container>)}
                </BottomSheet>);
        } else {
            return (<H4></H4>);
        }
    };

    const renderRouteInfoBottomSheet = () => {
        if (!isWeb && showRouteInfo) {
            return (
                <BottomSheet snapPoints={['20%', '20%']} index={0} ref={bottomSheetRef}
                             handleIndicatorStyle={{display: "none"}}>
                    <Container>
                        <H4 style={{flexDirection: 'row'}}>{estimatedDuration} ({estimatedDistance})</H4>
                        <H6>Estimated Price: €</H6>
                        <ButtonContainer>
                            <Button title='Start Journey' onPress={() => {
                            }}/>
                            <Button title='Cancel' onPress={handleCancelPress}/>
                            <Button title='Save Route' onPress={() => {
                            }}/>
                        </ButtonContainer>
                    </Container>
                </BottomSheet>
            );
        } else {
            return (<H4></H4>);
        }
    };

    return (<View style={{flex: 1}}>
        {renderMap()}
        {renderStationBottomSheet()}
        {renderRouteInfoBottomSheet()}

    </View>);
};

export default MapScreen;