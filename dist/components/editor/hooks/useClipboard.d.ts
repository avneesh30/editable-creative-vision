import { fabric } from 'fabric';
export declare const useClipboard: (canvas: fabric.Canvas | null, onClipboardAction: () => void) => {
    copyToClipboard: () => void;
    pasteFromClipboard: () => void;
    pasteAtPosition: (x: number, y: number) => void;
};
export default useClipboard;
