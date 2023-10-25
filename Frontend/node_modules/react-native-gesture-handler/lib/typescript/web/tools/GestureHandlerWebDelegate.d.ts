import type GestureHandler from '../handlers/GestureHandler';
import { GestureHandlerDelegate, MeasureResult } from './GestureHandlerDelegate';
export declare class GestureHandlerWebDelegate implements GestureHandlerDelegate<HTMLElement> {
    private view;
    private gestureHandler;
    private eventManagers;
    getView(): HTMLElement;
    init(viewRef: number, handler: GestureHandler): void;
    isPointerInBounds({ x, y }: {
        x: number;
        y: number;
    }): boolean;
    measureView(): MeasureResult;
    reset(): void;
    tryResetCursor(): void;
    onBegin(): void;
    onActivate(): void;
    onEnd(): void;
    onCancel(): void;
    onFail(): void;
}
