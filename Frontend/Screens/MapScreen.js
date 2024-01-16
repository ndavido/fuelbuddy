import React, {useState, useEffect, useRef} from "react";
import {View, Text, StyleSheet, Platform, Animated, Dimensions, Button, TextInput, Modal} from "react-native";
import MapView from "../Components/mymap";
import MyMarker from '../Components/mymarker';
import * as Location from "expo-location";
import {Easing} from "react-native-reanimated";
import {PanResponder} from "react-native-web"; // For user location
import {PanGestureHandler, State} from 'react-native-gesture-handler';

const MapScreen = () => {
    const [petrolStations, setPetrolStations] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);

    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [newPetrolPrice, setNewPetrolPrice] = useState('');
    const [newDieselPrice, setNewDieselPrice] = useState('');

    const smallSheetHeight = 75; // Adjust as needed
    const largeSheetHeight = Dimensions.get('window').height / 2;
    const snapPoints = [smallSheetHeight, largeSheetHeight];
    const bottomSheetTranslation = useRef(new Animated.Value(smallSheetHeight))
        .current;

    const apiKey = process.env.googleMapsApiKey;

    const handleSheetClose = () => {
        Animated.timing(bottomSheetTranslation, {
            toValue: smallSheetHeight,
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.ease,
        }).start();
    };

    const onGestureEvent = Animated.event(
        [{nativeEvent: {translationY: bottomSheetTranslation}}],
        {useNativeDriver: false}
    );

    const onHandlerStateChange = ({nativeEvent}) => {
        if (nativeEvent.oldState === State.ACTIVE) {
            const velocityY = nativeEvent.velocityY;

            Animated.spring(bottomSheetTranslation, {
                toValue: velocityY < 0 ? largeSheetHeight : smallSheetHeight,
                useNativeDriver: false,
            }).start();
        }
    };

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

        if (Platform.OS === "web") {
            fetchLocationAndPetrolStations();
        } else {
            fetchLocationAndPetrolStations();
        }
    }, []);

    const handleMarkerPress = (station) => {
        setSelectedStation(station);
        Animated.spring(bottomSheetTranslation, {
            toValue: smallSheetHeight,
            useNativeDriver: false,
        }).start();
    };

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

    const renderMap = () => {
        if (Platform.OS === "web") {
            return (
                <View style={{flex: 1}}>
                    <MapView
                        style={{flex: 1}}
                        initialRegion={{
                            latitude: 37.78825,
                            longitude: -122.4324,
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
                                title={station.name}
                                description={
                                    station.prices !== "No prices available"
                                        ? `Petrol: ${station.prices.petrol_price}, Diesel: ${station.prices.diesel_price}`
                                        : station.prices
                                }
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
                            title={station.name}
                            description={
                                station.prices !== 'No prices available'
                                    ? `Petrol: ${station.prices.petrol_price}, Diesel: ${station.prices.diesel_price}`
                                    : station.prices
                            }
                            onPress={() => handleMarkerPress(station)}
                        />
                    ))}
                </MapView>

            );
        }
    };

    return (
        <View style={{flex: 1}}>
            {renderMap()}
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
            >
                <Animated.View
                    style={[styles.bottomSheet, {height: bottomSheetTranslation}]}
                >
                    <View style={styles.handleBar}/>
                    {selectedStation && (
                        <View>
                            <Text>{selectedStation.name}</Text>
                            <Text>Details: {selectedStation.details}</Text>
                            <Text>Address: {selectedStation.address}</Text>
                            <Button title="Update Fuel Price" onPress={() => setUpdateModalVisible(true)}/>
                            <Button title="Close" onPress={handleSheetClose}/>
                        </View>
                    )}
                </Animated.View>
            </PanGestureHandler>

            <Modal
                animationType="slide"
                transparent={true}
                visible={updateModalVisible}
                onRequestClose={() => setUpdateModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Update Fuel Prices</Text>
                        <TextInput
                            placeholder="New Petrol Price"
                            keyboardType="numeric"
                            value={newPetrolPrice}
                            onChangeText={(text) => setNewPetrolPrice(text)}
                        />
                        <TextInput
                            placeholder="New Diesel Price"
                            keyboardType="numeric"
                            value={newDieselPrice}
                            onChangeText={(text) => setNewDieselPrice(text)}
                        />
                        <Button title="Update" onPress={handleUpdatePress}/>
                        <Button title="Cancel" onPress={() => setUpdateModalVisible(false)}/>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 5,
    },
    handleBar: {
        height: 5,
        width: 40,
        backgroundColor: 'gray',
        alignSelf: 'center',
        marginTop: 8,
        borderRadius: 2,
    },
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
