import type { NativeSyntheticEvent } from 'react-native';
import type { EventPayload, ReanimatedEvent } from './hook/commonTypes';
type JSEvent<Event extends object> = NativeSyntheticEvent<EventPayload<Event>>;
export default class WorkletEventHandler<Event extends object> {
    worklet: (event: ReanimatedEvent<Event>) => void;
    eventNames: string[];
    reattachNeeded: boolean;
    listeners: Record<string, (event: ReanimatedEvent<ReanimatedEvent<Event>>) => void> | Record<string, (event: JSEvent<Event>) => void>;
    viewTag: number | undefined;
    registrations: number[];
    constructor(worklet: (event: ReanimatedEvent<Event>) => void, eventNames?: string[]);
    updateWorklet(newWorklet: (event: ReanimatedEvent<Event>) => void): void;
    registerForEvents(viewTag: number, fallbackEventName?: string): void;
    registerForEventByName(eventName: string): void;
    unregisterFromEvents(): void;
}
export {};
