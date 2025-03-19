import { fabric } from 'fabric';
export declare const useCanvasHistory: () => {
    saveToHistory: (canvas: fabric.Canvas | null) => void;
    undo: (canvas: fabric.Canvas | null) => void;
    redo: (canvas: fabric.Canvas | null) => void;
    canUndo: boolean;
    canRedo: boolean;
};
