import { fabric } from 'fabric';
export declare const useCanvasBackground: (canvas: fabric.Canvas | null, onBackgroundChange: () => void) => {
    canvasBackgroundColor: string;
    setCanvasBackgroundColor: (color: string) => void;
};
