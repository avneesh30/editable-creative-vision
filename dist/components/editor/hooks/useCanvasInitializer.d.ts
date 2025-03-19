import { fabric } from 'fabric';
import { CanvasSize } from '../types';
export declare const useCanvasInitializer: (canvasSize: CanvasSize, onSelection: (obj: fabric.Object | null) => void, onModified: () => void) => {
    initCanvas: (canvasElement: HTMLCanvasElement) => fabric.Canvas | undefined;
};
