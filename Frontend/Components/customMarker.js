import React from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';

const CustomMarker = ({ coordinate, onPress, petrolUpdatedAt, dieselUpdatedAt }) => {
  const customMarkerIcon = getMarkerIcon(petrolUpdatedAt, dieselUpdatedAt);

  return (
    <Marker coordinate={coordinate} onPress={onPress} pinColor={customMarkerIcon.color}>
      <Image source={customMarkerIcon.icon} style={{ width: 32, height: 32 }} />
    </Marker>
  );
};

const getMarkerIcon = (petrolUpdatedAt, dieselUpdatedAt) => {
  const currentDate = new Date();
  const petrolUpdateDate = new Date(petrolUpdatedAt);
  const dieselUpdateDate = new Date(dieselUpdatedAt);

  const petrolDaysDifference = Math.floor((currentDate - petrolUpdateDate) / (1000 * 60 * 60 * 24));
  const dieselDaysDifference = Math.floor((currentDate - dieselUpdateDate) / (1000 * 60 * 60 * 24));

  if (petrolDaysDifference > 7 || dieselDaysDifference > 7) {
    return { icon: require('../assets/FBMapIcon-Grey.png'), color: 'grey' };
  } else if (petrolDaysDifference > 3 || dieselDaysDifference > 3) {
    return { icon: require('../assets/FBMapIcon-Red.png'), color: 'red' };
  } else if (petrolDaysDifference >= 1 || dieselDaysDifference >= 1) {
    return { icon: require('../assets/FBMapIcon-Orange.png'), color: 'orange' };
  } else {
    return { icon: require('../assets/FBMapIcon-Green.png'), color: 'green' };
  }
};

export default CustomMarker;
