import { ACTIONS } from './constants';
import { print } from '../utilities/logger';

const registerHost = (state, hostName) => {
  if (!(hostName in state)) {
    state[hostName] = [];
  }

  return state;
};

const deregisterHost = (state, hostName) => {
  delete state[hostName];
  return state;
};

const addUpdatePortal = (state, hostName, portalName, node) => {
  if (!(hostName in state)) {
    state = registerHost(state, hostName);
  }
  /**
   * updated portal, if it was already added.
   */


  const index = state[hostName].findIndex(item => item.name === portalName);

  if (index !== -1) {
    state[hostName][index].node = node;
  } else {
    state[hostName].push({
      name: portalName,
      node
    });
  }

  return state;
};

const removePortal = (state, hostName, portalName) => {
  if (!(hostName in state)) {
    print({
      component: reducer.name,
      method: removePortal.name,
      params: "Failed to remove portal '".concat(portalName, "', '").concat(hostName, "' was not registered!")
    });
    return state;
  }

  const index = state[hostName].findIndex(item => item.name === portalName);
  if (index !== -1) state[hostName].splice(index, 1);
  return state;
};

export const reducer = (state, action) => {
  const {
    type
  } = action;
  let clonedState = { ...state
  };

  switch (type) {
    case ACTIONS.REGISTER_HOST:
      return registerHost(clonedState, action.hostName);

    case ACTIONS.DEREGISTER_HOST:
      return deregisterHost(clonedState, action.hostName);

    case ACTIONS.ADD_UPDATE_PORTAL:
      return addUpdatePortal(clonedState, action.hostName, action.portalName, action.node);

    case ACTIONS.REMOVE_PORTAL:
      return removePortal(clonedState, action.hostName, action.portalName);

    default:
      return state;
  }
};
//# sourceMappingURL=reducer.js.map