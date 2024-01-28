import React, { memo, useReducer } from 'react';
import { PortalHost } from '../portalHost/PortalHost';
import { PortalDispatchContext, PortalStateContext } from '../../contexts/portal';
import { INITIAL_STATE } from '../../state/constants';
import { reducer } from '../../state/reducer';

const PortalProviderComponent = ({
  rootHostName = 'root',
  shouldAddRootHost = true,
  children
}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return /*#__PURE__*/React.createElement(PortalDispatchContext.Provider, {
    value: dispatch
  }, /*#__PURE__*/React.createElement(PortalStateContext.Provider, {
    value: state
  }, children, shouldAddRootHost && /*#__PURE__*/React.createElement(PortalHost, {
    name: rootHostName
  })));
};

export const PortalProvider = /*#__PURE__*/memo(PortalProviderComponent);
PortalProvider.displayName = 'PortalProvider';
//# sourceMappingURL=PortalProvider.js.map