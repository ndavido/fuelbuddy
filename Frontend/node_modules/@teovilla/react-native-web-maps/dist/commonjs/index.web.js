"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Polygon: true,
  Marker: true,
  Callout: true,
  Polyline: true,
  Circle: true,
  Geojson: true
};
Object.defineProperty(exports, "Callout", {
  enumerable: true,
  get: function () {
    return _callout.Callout;
  }
});
Object.defineProperty(exports, "Circle", {
  enumerable: true,
  get: function () {
    return _circle.Circle;
  }
});
Object.defineProperty(exports, "Geojson", {
  enumerable: true,
  get: function () {
    return _geojson.Geojson;
  }
});
Object.defineProperty(exports, "Marker", {
  enumerable: true,
  get: function () {
    return _marker.Marker;
  }
});
Object.defineProperty(exports, "Polygon", {
  enumerable: true,
  get: function () {
    return _polygon.Polygon;
  }
});
Object.defineProperty(exports, "Polyline", {
  enumerable: true,
  get: function () {
    return _polyline.Polyline;
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _mapView.MapView;
  }
});
var _mapView = require("./components/map-view");
var _polygon = require("./components/polygon");
var _marker = require("./components/marker");
var _callout = require("./components/callout");
var _polyline = require("./components/polyline");
var _circle = require("./components/circle");
var _geojson = require("./components/geojson");
var _markerClusterer = require("./components/marker-clusterer");
Object.keys(_markerClusterer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _markerClusterer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _markerClusterer[key];
    }
  });
});
//# sourceMappingURL=index.web.js.map