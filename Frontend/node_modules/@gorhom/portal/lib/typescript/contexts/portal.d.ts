/// <reference types="react" />
import type { ActionTypes } from '../state/types';
import type { PortalType } from '../types';
export declare const PortalStateContext: import("react").Context<Record<string, PortalType[]> | null>;
export declare const PortalDispatchContext: import("react").Context<import("react").Dispatch<ActionTypes> | null>;
