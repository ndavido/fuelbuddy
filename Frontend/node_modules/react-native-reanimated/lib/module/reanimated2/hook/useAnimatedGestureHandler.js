import { useEvent, useHandler } from './Hooks';
const EventType = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5
};
export function useAnimatedGestureHandler(handlers, dependencies) {
  const {
    context,
    doDependenciesDiffer,
    useWeb
  } = useHandler(handlers, dependencies);
  const handler = e => {
    'worklet';

    const event = useWeb ? e.nativeEvent : e;
    if (event.state === EventType.BEGAN && handlers.onStart) {
      handlers.onStart(event, context);
    }
    if (event.state === EventType.ACTIVE && handlers.onActive) {
      handlers.onActive(event, context);
    }
    if (event.oldState === EventType.ACTIVE && event.state === EventType.END && handlers.onEnd) {
      handlers.onEnd(event, context);
    }
    if (event.oldState === EventType.BEGAN && event.state === EventType.FAILED && handlers.onFail) {
      handlers.onFail(event, context);
    }
    if (event.oldState === EventType.ACTIVE && event.state === EventType.CANCELLED && handlers.onCancel) {
      handlers.onCancel(event, context);
    }
    if ((event.oldState === EventType.BEGAN || event.oldState === EventType.ACTIVE) && event.state !== EventType.BEGAN && event.state !== EventType.ACTIVE && handlers.onFinish) {
      handlers.onFinish(event, context, event.state === EventType.CANCELLED || event.state === EventType.FAILED);
    }
  };
  if (useWeb) {
    return handler;
  }
  return useEvent(handler, ['onGestureHandlerStateChange', 'onGestureHandlerEvent'], doDependenciesDiffer); // this is not correct but we want to make GH think it receives a function
}
//# sourceMappingURL=useAnimatedGestureHandler.js.map