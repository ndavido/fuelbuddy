import React, { useState, useEffect } from "react";
import { View, Text, Platform } from "react-native";
import MapView from "../Components/mymap";
// import MyMarker from '../Components/mymarker';
import Marker from "@teovilla/react-native-web-maps";
import * as Location from "expo-location"; // For user location

const MapScreen = () => {
  const [petrolStations, setPetrolStations] = useState([]);
  const [location, setLocation] = useState(null);
  const apiKey = process.env.googleMapsApiKey;

  useEffect(() => {
    if (Platform.OS === "web") {
      // Mobile implementation using Expo's Location API
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        fetchPetrolStations(location);
      })();
    } else {
      // Mobile implementation using Expo's Location API
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        fetchPetrolStations(location);
      })();
    }
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
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
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
          />
        </View>
      );
    } else {
      return (
        <MapView
          style={{ flex: 1 }}
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
                station.prices !== "No prices available"
                  ? `Petrol: ${station.prices.petrol_price}, Diesel: ${station.prices.diesel_price}`
                  : station.prices
              }
            />
          ))}
        </MapView>
      );
    }
  };

  return <View style={{ flex: 1 }}>{renderMap()}</View>;
};

export default MapScreen;
