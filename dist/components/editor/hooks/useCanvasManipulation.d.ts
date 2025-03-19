import { fabric } from 'fabric';
export declare const useCanvasManipulation: (canvas: fabric.Canvas | null, setActiveObject: (obj: fabric.Object | null) => void, onManipulation: () => void) => {
    removeActiveObject: () => void;
    bringForward: () => void;
    sendBackward: () => void;
    bringToFront: () => void;
    sendToBack: () => void;
    groupSelected: () => void;
    ungroupSelected: () => void;
    cloneSelected: () => void;
    selectAll: () => void;
    clearCanvas: () => void;
};
