import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from '../Components/mymap';
import Logo from '../styles/logo';
const apiKey = process.env.googleMapsApiKey;

const MapScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Logo/>
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
};

export default MapScreen;