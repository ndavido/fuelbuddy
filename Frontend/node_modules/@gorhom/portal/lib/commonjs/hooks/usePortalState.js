"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePortalState = void 0;

var _react = require("react");

var _portal = require("../contexts/portal");

const usePortalState = hostName => {
  const state = (0, _react.useContext)(_portal.PortalStateContext);

  if (state === null) {
    throw new Error("'PortalStateContext' cannot be null, please add 'PortalProvider' to the root component.");
  }

  return state[hostName] || [];
};

exports.usePortalState = usePortalState;
//# sourceMappingURL=usePortalState.js.map