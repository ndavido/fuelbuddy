import type { WorkletFunction } from '../commonTypes';
import type { DependencyList } from './commonTypes';
export declare function buildWorkletsHash(worklets: Record<string, WorkletFunction> | WorkletFunction[]): string;
export declare function buildDependencies(dependencies: DependencyList, handlers: Record<string, WorkletFunction | undefined>): unknown[];
export declare function areDependenciesEqual(nextDeps: DependencyList, prevDeps: DependencyList): boolean;
export declare function isAnimated(prop: unknown): boolean;
export declare function shallowEqual(a: any, b: any): boolean;
export declare function validateAnimatedStyles(styles: unknown[] | object): void;
