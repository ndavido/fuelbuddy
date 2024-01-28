'use strict';

import { useEffect, useRef } from 'react';
import { makeRemote } from '../core';
import { isWeb, isJest } from '../PlatformChecker';
import { areDependenciesEqual, buildDependencies } from './utils';

/**
 * Lets you find out whether the event handler dependencies have changed.
 *
 * @param handlers - An object of event handlers.
 * @param dependencies - An optional array of dependencies.
 * @returns An object containing a boolean indicating whether the dependencies have changed, and a boolean indicating whether the code is running on the web.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/advanced/useHandler
 */ // @ts-expect-error This overload is required by our API.
export function useHandler(handlers, dependencies) {
  const initRef = useRef(null);
  if (initRef.current === null) {
    initRef.current = {
      context: makeRemote({}),
      savedDependencies: []
    };
  }
  useEffect(() => {
    return () => {
      initRef.current = null;
    };
  }, []);
  const {
    context,
    savedDependencies
  } = initRef.current;
  dependencies = buildDependencies(dependencies, handlers);
  const doDependenciesDiffer = !areDependenciesEqual(dependencies, savedDependencies);
  initRef.current.savedDependencies = dependencies;
  const useWeb = isWeb() || isJest();
  return {
    context,
    doDependenciesDiffer,
    useWeb
  };
}
//# sourceMappingURL=useHandler.js.map