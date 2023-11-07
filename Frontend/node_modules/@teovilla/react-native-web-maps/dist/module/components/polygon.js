import React from 'react';
import { Polygon as GMPolygon, useGoogleMap } from '@react-google-maps/api';
import { mapMouseEventToMapEvent } from '../utils/mouse-event';
export function Polygon(props) {
  const map = useGoogleMap();
  return /*#__PURE__*/React.createElement(GMPolygon, {
    path: props.coordinates.map(c => ({
      lat: c.latitude,
      lng: c.longitude
    })),
    onClick: e => mapMouseEventToMapEvent(e, null, map, 'polygon-press'),
    options: {
      geodesic: props.geodesic,
      clickable: props.tappable,
      fillColor: props.fillColor,
      strokeColor: props.strokeColor,
      strokeWeight: props.strokeWidth
    }
  });
}
//# sourceMappingURL=polygon.js.map