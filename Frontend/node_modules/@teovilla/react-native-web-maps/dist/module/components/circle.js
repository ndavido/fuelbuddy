import React from 'react';
import { Circle as GMCircle } from '@react-google-maps/api';
export function Circle(props) {
  return /*#__PURE__*/React.createElement(GMCircle, {
    center: {
      lat: props.center.latitude,
      lng: props.center.longitude
    },
    radius: props.radius,
    options: {
      fillColor: props.fillColor,
      strokeColor: props.strokeColor,
      zIndex: props.zIndex
    }
  });
}
//# sourceMappingURL=circle.js.map