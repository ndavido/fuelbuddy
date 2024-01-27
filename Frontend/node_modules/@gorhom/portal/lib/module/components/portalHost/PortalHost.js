import React, { memo, useEffect } from 'react';
import { usePortalState } from '../../hooks/usePortalState';
import { usePortal } from '../../hooks/usePortal';

const PortalHostComponent = ({
  name
}) => {
  //#region hooks
  const state = usePortalState(name);
  const {
    registerHost,
    deregisterHost
  } = usePortal(name); //#endregion
  //#region effects

  useEffect(() => {
    registerHost();
    return () => {
      deregisterHost();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //#endregion
  //#region render

  return /*#__PURE__*/React.createElement(React.Fragment, null, state.map(item => item.node)); //#endregion
};

export const PortalHost = /*#__PURE__*/memo(PortalHostComponent);
PortalHost.displayName = 'PortalHost';
//# sourceMappingURL=PortalHost.js.map