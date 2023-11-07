"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logDeprecationWarning = logDeprecationWarning;
exports.logMethodNotImplementedWarning = logMethodNotImplementedWarning;
function logDeprecationWarning(methodName) {
  console.warn(`[WARNING] Method ${methodName} is deprecated therefore not implemented. Check https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md#types`);
}
function logMethodNotImplementedWarning(methodName) {
  console.warn(`[WARNING] Method ${methodName} is not implemented on web`);
}
//# sourceMappingURL=log.js.map