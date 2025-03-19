import { fabric } from 'fabric';
export declare const loadCompositeImage: (psd: any, canvas: fabric.Canvas, width: number, height: number) => Promise<{
    success: boolean;
}>;
export declare const loadFlattenedImage: (psd: any, canvas: fabric.Canvas, width: number, height: number) => Promise<{
    success: boolean;
}>;
