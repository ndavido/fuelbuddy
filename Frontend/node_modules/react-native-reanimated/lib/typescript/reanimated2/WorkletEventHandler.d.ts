import type { NativeEvent } from './commonTypes';
export default class WorkletEventHandler<T extends NativeEvent<T>> {
    worklet: (event: T) => void;
    eventNames: string[];
    reattachNeeded: boolean;
    listeners: Record<string, (event: T) => void>;
    viewTag: number | undefined;
    registrations: number[];
    constructor(worklet: (event: T) => void, eventNames?: string[]);
    updateWorklet(newWorklet: (event: T) => void): void;
    registerForEvents(viewTag: number, fallbackEventName?: string): void;
    registerForEventByName(eventName: string): void;
    unregisterFromEvents(): void;
}
