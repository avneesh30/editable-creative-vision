import React from 'react';
export interface DesignEditorProps {
    initialTemplate?: string;
    onSave?: (jsonData: string) => void;
    width?: number;
    height?: number;
    containerClassName?: string;
    toolbarClassName?: string;
    canvasClassName?: string;
    showLeftSidebar?: boolean;
    showRightSidebar?: boolean;
    plugins?: Array<{
        name: string;
        component: React.ReactNode;
    }>;
}
declare const DesignEditor: React.FC<DesignEditorProps>;
export default DesignEditor;
