import type { SharedValue } from './commonTypes';
import type { Descriptor } from './hook/commonTypes';
export interface ViewRefSet<T> {
    items: Set<T>;
    add: (item: T) => void;
    remove: (item: T) => void;
}
export interface ViewDescriptorsSet {
    sharableViewDescriptors: SharedValue<Descriptor[]>;
    add: (item: Descriptor) => void;
    remove: (viewTag: number) => void;
}
export declare function makeViewDescriptorsSet(): ViewDescriptorsSet;
export declare function makeViewsRefSet<T>(): ViewRefSet<T>;
