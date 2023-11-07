import React from 'react';
import { Polyline as GMPolyline, useGoogleMap } from '@react-google-maps/api';
import { mapMouseEventToMapEvent } from '../utils/mouse-event';
export function Polyline(props) {
  const map = useGoogleMap();
  return /*#__PURE__*/React.createElement(GMPolyline, {
    path: props.coordinates.map(c => ({
      lat: c.latitude,
      lng: c.longitude
    })),
    onClick: e => {
      var _props$onPress;
      return (_props$onPress = props.onPress) === null || _props$onPress === void 0 ? void 0 : _props$onPress.call(props, mapMouseEventToMapEvent(e, null, map, 'polyline-press'));
    },
    options: {
      geodesic: props.geodesic,
      clickable: props.tappable,
      strokeColor: props.strokeColor,
      strokeWeight: props.strokeWidth
    }
  });
}
//# sourceMappingURL=polyline.js.map