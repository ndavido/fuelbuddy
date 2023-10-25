import type { __ComplexWorkletFunction } from './commonTypes';
export type WorkletRuntime = {
    __hostObjectWorkletRuntime: never;
    readonly name: string;
};
export declare function createWorkletRuntime(name: string, initializer?: __ComplexWorkletFunction<[], void>): WorkletRuntime;
