import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker } from '../marker';
export function Cluster(props) {
  return /*#__PURE__*/React.createElement(Marker, {
    coordinate: props.coordinate,
    anchor: {
      x: 0.5,
      y: 0.5
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.text
  }, props.pointCountAbbreviated)));
}
export const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: '#1380FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    fontWeight: '500'
  }
});
//# sourceMappingURL=cluster.js.map