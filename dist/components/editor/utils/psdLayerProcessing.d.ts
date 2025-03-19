import { fabric } from 'fabric';
export declare const positionLayer: (obj: fabric.Object, node: any, canvasWidth: number, canvasHeight: number) => void;
export declare const addTextLayer: (node: any, canvas: fabric.Canvas) => Promise<void>;
export declare const addPixelDataLayer: (node: any, canvas: fabric.Canvas, canvasWidth: number, canvasHeight: number) => Promise<void>;
export declare const processLayers: (psd: any, tree: any, canvas: fabric.Canvas, width: number, height: number) => Promise<{
    layersAdded: number;
}>;
