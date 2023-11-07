/**
 * This component is taken from `react-native-maps`
 * I just replaced the inner components with the web ones
 * I guess this has been tested by the creators lol
 * https://github.com/react-native-maps/react-native-maps/blob/master/src/Geojson.js
 */

import React from 'react';
import { getColor, getStrokeWidth, makeOverlays } from '../utils/geojson';
import { Marker } from './marker';
import { Polygon } from './polygon';
import { Polyline } from './polyline';
export function Geojson(props) {
  const {
    title,
    zIndex,
    onPress,
    lineCap,
    lineJoin,
    tappable,
    miterLimit,
    lineDashPhase,
    lineDashPattern,
    markerComponent
  } = props;
  const overlays = makeOverlays(props.geojson.features);
  return /*#__PURE__*/React.createElement(React.Fragment, null, overlays.map((overlay, index) => {
    const fillColor = getColor(props, overlay, 'fill', 'fillColor');
    const strokeColor = getColor(props, overlay, 'stroke', 'strokeColor');
    const markerColor = getColor(props, overlay, 'marker-color', 'color');
    const strokeWidth = getStrokeWidth(props, overlay);
    if (overlay.type === 'point') {
      return /*#__PURE__*/React.createElement(Marker, {
        key: index,
        coordinate: overlay.coordinates,
        title: title,
        pinColor: markerColor,
        zIndex: zIndex,
        onPress: () => onPress && onPress(overlay)
      }, markerComponent);
    }
    if (overlay.type === 'polygon') {
      return /*#__PURE__*/React.createElement(Polygon, {
        key: index,
        coordinates: overlay.coordinates,
        holes: overlay.holes,
        strokeColor: strokeColor,
        fillColor: fillColor,
        strokeWidth: strokeWidth,
        tappable: tappable,
        onPress: () => onPress && onPress(overlay),
        zIndex: zIndex
      });
    }
    if (overlay.type === 'polyline') {
      return /*#__PURE__*/React.createElement(Polyline, {
        key: index,
        coordinates: overlay.coordinates,
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        lineDashPhase: lineDashPhase,
        lineDashPattern: lineDashPattern,
        lineCap: lineCap,
        lineJoin: lineJoin,
        miterLimit: miterLimit,
        zIndex: zIndex,
        tappable: tappable,
        onPress: () => onPress && onPress(overlay)
      });
    }
    return null;
  }));
}
//# sourceMappingURL=geojson.js.map