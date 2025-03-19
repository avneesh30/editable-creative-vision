import { fabric } from 'fabric';
interface PanCanvas extends fabric.Canvas {
    isDragging?: boolean;
    lastPosX?: number;
    lastPosY?: number;
}
export declare const usePanMode: (canvas: PanCanvas | null) => {
    isPanEnabled: boolean;
    enablePan: () => void;
    disablePan: () => void;
};
export {};
