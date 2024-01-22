"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePortal = void 0;

var _react = require("react");

var _constants = require("../state/constants");

var _portal = require("../contexts/portal");

const usePortal = (hostName = 'root') => {
  const dispatch = (0, _react.useContext)(_portal.PortalDispatchContext);

  if (dispatch === null) {
    throw new Error("'PortalDispatchContext' cannot be null, please add 'PortalProvider' to the root component.");
  } //#region methods


  const registerHost = (0, _react.useCallback)(() => {
    dispatch({
      type: _constants.ACTIONS.REGISTER_HOST,
      hostName: hostName
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const deregisterHost = (0, _react.useCallback)(() => {
    dispatch({
      type: _constants.ACTIONS.DEREGISTER_HOST,
      hostName: hostName
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addUpdatePortal = (0, _react.useCallback)((name, node) => {
    dispatch({
      type: _constants.ACTIONS.ADD_UPDATE_PORTAL,
      hostName,
      portalName: name,
      node
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const removePortal = (0, _react.useCallback)(name => {
    dispatch({
      type: _constants.ACTIONS.REMOVE_PORTAL,
      hostName,
      portalName: name
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //#endregion

  return {
    registerHost,
    deregisterHost,
    addPortal: addUpdatePortal,
    updatePortal: addUpdatePortal,
    removePortal
  };
};

exports.usePortal = usePortal;
//# sourceMappingURL=usePortal.js.map