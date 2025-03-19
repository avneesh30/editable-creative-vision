import React from 'react';
interface EditorProviderProps {
    children: React.ReactNode;
    initialWidth?: number;
    initialHeight?: number;
    initialTemplate?: string;
}
export declare const EditorProvider: React.FC<EditorProviderProps>;
export {};
