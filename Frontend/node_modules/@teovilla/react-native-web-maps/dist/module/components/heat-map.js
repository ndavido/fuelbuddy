import React from 'react';
import { HeatmapLayer as GMHeatmap } from '@react-google-maps/api';
export function Heatmap(props) {
  var _props$gradient;
  return /*#__PURE__*/React.createElement(GMHeatmap, {
    data: (props.points || []).map(p => ({
      location: new google.maps.LatLng({
        lat: p.latitude,
        lng: p.longitude
      }),
      weight: p.weight || 0
    })),
    options: {
      radius: props.radius,
      gradient: (_props$gradient = props.gradient) === null || _props$gradient === void 0 ? void 0 : _props$gradient.colors,
      opacity: props.opacity
    }
  });
}
//# sourceMappingURL=heat-map.js.map