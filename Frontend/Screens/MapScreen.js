import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from '../Components/mymap';
import MainLogo from '../styles/mainLogo';
const apiKey = process.env.googleMapsApiKey;

const MapScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <MainLogo/>
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
        apiKey="AIzaSyCcXAgwPsQHnVmSUu3qsmK-L5t0OOA2y9o"
      />
    </View>
  );
};

export default MapScreen;