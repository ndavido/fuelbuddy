type StackDetails = [Error, number, number];
export declare function registerWorkletStackDetails(hash: number, stackDetails: StackDetails): void;
export declare function reportFatalErrorOnJS({ message, stack, }: {
    message: string;
    stack?: string;
}): void;
export {};
