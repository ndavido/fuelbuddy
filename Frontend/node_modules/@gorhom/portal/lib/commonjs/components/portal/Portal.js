"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Portal = void 0;

var _react = require("react");

var _nonSecure = require("nanoid/non-secure");

var _usePortal = require("../../hooks/usePortal");

const PortalComponent = ({
  name: _providedName,
  hostName,
  handleOnMount: _providedHandleOnMount,
  handleOnUnmount: _providedHandleOnUnmount,
  handleOnUpdate: _providedHandleOnUpdate,
  children
}) => {
  //#region hooks
  const {
    addPortal: addUpdatePortal,
    removePortal
  } = (0, _usePortal.usePortal)(hostName); //#endregion
  //#region variables

  const name = (0, _react.useMemo)(() => _providedName || (0, _nonSecure.nanoid)(), [_providedName]); //#endregion
  //#region refs

  const handleOnMountRef = (0, _react.useRef)();
  const handleOnUnmountRef = (0, _react.useRef)();
  const handleOnUpdateRef = (0, _react.useRef)(); //#endregion
  //#region callbacks

  const handleOnMount = (0, _react.useCallback)(() => {
    if (_providedHandleOnMount) {
      _providedHandleOnMount(() => addUpdatePortal(name, children));
    } else {
      addUpdatePortal(name, children);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [_providedHandleOnMount, addUpdatePortal]);
  handleOnMountRef.current = handleOnMount;
  const handleOnUnmount = (0, _react.useCallback)(() => {
    if (_providedHandleOnUnmount) {
      _providedHandleOnUnmount(() => removePortal(name));
    } else {
      removePortal(name);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [_providedHandleOnUnmount, removePortal]);
  handleOnUnmountRef.current = handleOnUnmount;
  const handleOnUpdate = (0, _react.useCallback)(() => {
    if (_providedHandleOnUpdate) {
      _providedHandleOnUpdate(() => addUpdatePortal(name, children));
    } else {
      addUpdatePortal(name, children);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [_providedHandleOnUpdate, addUpdatePortal, children]);
  handleOnUpdateRef.current = handleOnUpdate; //#endregion
  //#region effects

  (0, _react.useEffect)(() => {
    var _handleOnMountRef$cur;

    (_handleOnMountRef$cur = handleOnMountRef.current) === null || _handleOnMountRef$cur === void 0 ? void 0 : _handleOnMountRef$cur.call(handleOnMountRef);
    return () => {
      var _handleOnUnmountRef$c;

      (_handleOnUnmountRef$c = handleOnUnmountRef.current) === null || _handleOnUnmountRef$c === void 0 ? void 0 : _handleOnUnmountRef$c.call(handleOnUnmountRef); // remove callbacks refs

      handleOnMountRef.current = undefined;
      handleOnUnmountRef.current = undefined;
      handleOnUpdateRef.current = undefined;
    };
  }, []);
  (0, _react.useEffect)(() => {
    var _handleOnUpdateRef$cu;

    (_handleOnUpdateRef$cu = handleOnUpdateRef.current) === null || _handleOnUpdateRef$cu === void 0 ? void 0 : _handleOnUpdateRef$cu.call(handleOnUpdateRef);
  }, [children]); //#endregion

  return null;
};

const Portal = /*#__PURE__*/(0, _react.memo)(PortalComponent);
exports.Portal = Portal;
Portal.displayName = 'Portal';
//# sourceMappingURL=Portal.js.map