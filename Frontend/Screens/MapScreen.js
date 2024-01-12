import React, {useState, useEffect, useRef} from "react";
import {View, Text, StyleSheet, Platform, Animated, Dimensions, Button} from "react-native";
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
                "http://ec2-54-172-255-239.compute-1.amazonaws.com/fuel_stations",
                config
            );
            const stations = await response.json();
            console.log("Stations: ", stations);
            setPetrolStations(stations);
        } catch (error) {
            console.error(error);
        }
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
        <View style={{flex: 1}}>{renderMap()}<PanGestureHandler
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
                        <Button title="Close" onPress={handleSheetClose}/>
                    </View>
                )}
            </Animated.View>
        </PanGestureHandler>
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
});

export default MapScreen;
