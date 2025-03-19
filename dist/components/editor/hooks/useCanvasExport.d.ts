import { fabric } from 'fabric';
export declare const useCanvasExport: (canvas: fabric.Canvas | null) => {
    saveToJSON: () => string;
    loadFromJSON: (json: string) => void;
    exportToImage: (format: "png" | "jpeg" | "svg", quality?: "normal" | "high") => Promise<string>;
    exportToHTML: () => string;
    downloadImage: (format: "png" | "jpeg" | "svg", quality?: "normal" | "high") => void;
    createTemplateFromImage: (imageUrl: string, name: string) => {
        thumbnailUrl: string;
        canvasJson: string;
        size: {
            width: number;
            height: number;
        };
    };
};
