import type { PortalType } from '../types';
import type { ActionTypes } from './types';
export declare const reducer: (state: Record<string, Array<PortalType>>, action: ActionTypes) => Record<string, PortalType[]>;
