let isLoggingEnabled = false; // __DEV__ global is by default not defined in React Native Web builds

const isDev = Boolean(typeof __DEV__ !== 'undefined' && __DEV__);

const enableLogging = () => {
  if (!isDev) {
    console.warn('[Portal] could not enable logging on production!');
    return;
  }

  isLoggingEnabled = true;
};

let print = () => {};

if (isDev) {
  print = ({
    component,
    method,
    params
  }) => {
    if (!isLoggingEnabled) {
      return;
    }

    let message = '';

    if (typeof params === 'object') {
      message = Object.keys(params).map(key => "".concat(key, ":").concat(params[key])).join(' ');
    } else {
      message = "".concat(params !== null && params !== void 0 ? params : '');
    }

    console.log("[Portal::".concat([component, method].filter(Boolean).join('::'), "]"), message);
  };
}

Object.freeze(print);
export { print, enableLogging };
//# sourceMappingURL=logger.js.map