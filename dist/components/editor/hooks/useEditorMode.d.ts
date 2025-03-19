import { fabric } from 'fabric';
import { EditorMode } from '../types';
export declare const useEditorMode: (canvas: fabric.Canvas | null, setCursor: (cursor: string) => void, isPanEnabled: boolean, disablePan: () => void) => {
    mode: EditorMode;
    setMode: import("react").Dispatch<import("react").SetStateAction<EditorMode>>;
};
