import { fabric } from 'fabric';
import { ElementOptions } from '../types';
export declare const useCanvasObjects: (canvas: fabric.Canvas | null, setActiveObject: (obj: fabric.Object | null) => void, onObjectAdded: () => void) => {
    addText: (text: string, options?: ElementOptions) => void;
    addRect: (options?: ElementOptions) => void;
    addCircle: (options?: ElementOptions) => void;
    addTriangle: (options?: ElementOptions) => void;
    addImage: (url: string, options?: ElementOptions) => void;
    addShape: (shapeType: string, options?: any) => fabric.Group | fabric.Rect | fabric.Circle | fabric.Triangle | fabric.Ellipse | fabric.Polygon | fabric.Path | undefined;
    createBusinessCardTemplate: () => void;
};
