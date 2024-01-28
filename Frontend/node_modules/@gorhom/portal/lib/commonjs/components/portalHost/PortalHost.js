"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PortalHost = void 0;

var _react = _interopRequireWildcard(require("react"));

var _usePortalState = require("../../hooks/usePortalState");

var _usePortal = require("../../hooks/usePortal");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const PortalHostComponent = ({
  name
}) => {
  //#region hooks
  const state = (0, _usePortalState.usePortalState)(name);
  const {
    registerHost,
    deregisterHost
  } = (0, _usePortal.usePortal)(name); //#endregion
  //#region effects

  (0, _react.useEffect)(() => {
    registerHost();
    return () => {
      deregisterHost();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //#endregion
  //#region render

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, state.map(item => item.node)); //#endregion
};

const PortalHost = /*#__PURE__*/(0, _react.memo)(PortalHostComponent);
exports.PortalHost = PortalHost;
PortalHost.displayName = 'PortalHost';
//# sourceMappingURL=PortalHost.js.map