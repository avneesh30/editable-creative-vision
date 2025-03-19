import { fabric } from 'fabric';
import { CanvasSize } from '../types';
export declare const useCanvasSize: (canvas: fabric.Canvas | null, initialCanvasSize: CanvasSize, onCanvasSizeChange: () => void) => {
    canvasSize: CanvasSize;
    setCanvasSize: (newSize: CanvasSize) => void;
};
