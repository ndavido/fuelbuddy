import React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';

const CustomMarker = ({ coordinate, onPress }) => {

  const customMarkerIcon = require('../assets/FBMapIcon-Green.png');

  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <Image source={customMarkerIcon} style={{ width: 32, height: 32 }} />
    </Marker>
  );
};

export default CustomMarker;