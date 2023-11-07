import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from './marker';
export function UserLocationMarker(props) {
  return /*#__PURE__*/React.createElement(Marker, {
    coordinate: props.coordinates,
    anchor: {
      x: 0.5,
      y: 0.5
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }));
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1380FF',
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    shadowOffset: {
      width: 0,
      height: 5
    }
  }
});
//# sourceMappingURL=user-location-marker.js.map