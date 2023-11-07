"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapMouseEventToMapEvent = mapMouseEventToMapEvent;
function mapMouseEventToMapEvent(e, defaultCoordinate, map, action) {
  var _e$latLng, _e$latLng2, _map$getProjection, _e$latLng3, _e$latLng4;
  return {
    preventDefault: e === null || e === void 0 ? void 0 : e.stop,
    stopPropagation: e === null || e === void 0 ? void 0 : e.stop,
    nativeEvent: {
      action,
      coordinate: {
        latitude: (e === null || e === void 0 || (_e$latLng = e.latLng) === null || _e$latLng === void 0 ? void 0 : _e$latLng.lat()) || (defaultCoordinate === null || defaultCoordinate === void 0 ? void 0 : defaultCoordinate.latitude) || 0,
        longitude: (e === null || e === void 0 || (_e$latLng2 = e.latLng) === null || _e$latLng2 === void 0 ? void 0 : _e$latLng2.lng()) || (defaultCoordinate === null || defaultCoordinate === void 0 ? void 0 : defaultCoordinate.longitude) || 0
      },
      position: (map === null || map === void 0 || (_map$getProjection = map.getProjection()) === null || _map$getProjection === void 0 ? void 0 : _map$getProjection.fromLatLngToPoint({
        lat: (e === null || e === void 0 || (_e$latLng3 = e.latLng) === null || _e$latLng3 === void 0 ? void 0 : _e$latLng3.lat()) || Number(defaultCoordinate === null || defaultCoordinate === void 0 ? void 0 : defaultCoordinate.latitude) || 0,
        lng: (e === null || e === void 0 || (_e$latLng4 = e.latLng) === null || _e$latLng4 === void 0 ? void 0 : _e$latLng4.lng()) || Number(defaultCoordinate === null || defaultCoordinate === void 0 ? void 0 : defaultCoordinate.longitude) || 0
      })) || {
        x: 0,
        y: 0
      }
    }
  };
}
//# sourceMappingURL=mouse-event.js.map