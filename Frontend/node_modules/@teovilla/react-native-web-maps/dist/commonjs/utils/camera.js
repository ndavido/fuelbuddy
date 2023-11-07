"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformRNCameraObject = transformRNCameraObject;
function transformRNCameraObject(camera) {
  var _camera$center, _camera$center2;
  return {
    tilt: camera.pitch,
    heading: camera.heading,
    zoom: camera.zoom,
    center: camera.center ? {
      lat: (_camera$center = camera.center) === null || _camera$center === void 0 ? void 0 : _camera$center.latitude,
      lng: (_camera$center2 = camera.center) === null || _camera$center2 === void 0 ? void 0 : _camera$center2.longitude
    } : undefined
  };
}
//# sourceMappingURL=camera.js.map