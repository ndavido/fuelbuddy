import React, {useState, useEffect, useRef, useMemo} from "react";
import {View, Text, StyleSheet, Animated, Platform, Dimensions, Button, TextInput, Modal} from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import MapView from "../Components/mymap";
import MyMarker from '../Components/mymarker';
import * as Location from "expo-location";

// Styling
import {H2, H3, H4, H5, H6} from "../styles/text";
import {Container, ButtonContainer, MenuButton} from "../styles/styles";

const apiKey = process.env.googleMapsApiKey;

const MapScreen = () => {
    const [petrolStations, setPetrolStations] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [newPetrolPrice, setNewPetrolPrice] = useState('');
    const [newDieselPrice, setNewDieselPrice] = useState('');

    const snapPoints = useMemo(() => ['15%', '40%', '100%'], []);

    useEffect(() => {
        const fetchLocationAndPetrolStations = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            fetchPetrolStations(location);
        };

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

    const handleMarkerPress = (station) => {
        setSelectedStation(station);

        // TODO Remove Dev Only
        console.log("Selected Station: ", station);
    };

    const renderMap = () => {
        if (Platform.OS === "web") {
            return (
                <View style={{flex: 1}}>
                    <MapView
                        style={{flex: 1}}
                        initialRegion={{
                            latitude: 53.79053893099578,
                            longitude: -6.239838384012141,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        provider="google"
                        customMapStyle={[]}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        loadingEnabled={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        zoomEnabled={true}
                        rotateEnabled={true}
                        scrollEnabled={true}
                        googleMapsApiKey={apiKey}
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
                    </MapView>
                </View>
            );
        } else {
            return (

                <MapView
                    style={{flex: 1}}
                    initialRegion={{
                        latitude: location ? location.coords.latitude : 0,
                        longitude: location ? location.coords.longitude : 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
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
                </MapView>

            );
        }
    };

    const renderBottomSheet = () => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
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
                                            emoji="📍"/>
                                <MenuButton title=''
                                            bgColor='white'
                                            txtColor='white'
                                            width='40px'
                                            emoji="❤️"/>
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
