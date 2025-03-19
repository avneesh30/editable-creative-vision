import React from 'react';
import { EditorContextType } from '../types';
declare const EditorContext: React.Context<EditorContextType | null>;
export declare const useEditor: () => EditorContextType;
interface EditorProviderProps {
    children: React.ReactNode;
    initialWidth?: number;
    initialHeight?: number;
    initialTemplate?: string;
}
export declare const EditorProvider: React.FC<EditorProviderProps>;
export { EditorContext };
