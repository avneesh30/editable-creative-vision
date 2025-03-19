import { fabric } from 'fabric';
import { CanvasSize } from '../types';
export declare const useCanvasZoom: (canvas: fabric.Canvas | null, canvasSize: CanvasSize) => {
    zoom: number;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
};
