import type { FrameInfo } from '../frameCallback/FrameCallbackRegistryUI';
export type FrameCallback = {
    setActive: (isActive: boolean) => void;
    isActive: boolean;
    callbackId: number;
};
export declare function useFrameCallback(callback: (frameInfo: FrameInfo) => void, autostart?: boolean): FrameCallback;
