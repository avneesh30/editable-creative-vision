import React, { useState, useEffect } from 'react';
import { EditorProvider, useEditor } from './context';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import PropertyPanel from './PropertyPanel';
import Canvas from './Canvas';
import TextEditorToolbar from './TextEditorToolbar';
import ExportDialog from './dialogs/ExportDialog';
import ResizeCanvasDialog from './dialogs/ResizeCanvasDialog';
import { toast } from "sonner";

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

const EditorContent: React.FC<{
  onSave?: (jsonData: string) => void;
  containerClassName?: string;
  toolbarClassName?: string;
  canvasClassName?: string;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
}> = ({ 
  onSave,
  containerClassName = "",
  toolbarClassName = "",
  canvasClassName = "",
  showLeftSidebar = true,
  showRightSidebar = true
}) => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(!showLeftSidebar);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(!showRightSidebar);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [resizeDialogOpen, setResizeDialogOpen] = useState(false);
  const [exportQuality, setExportQuality] = useState<'normal' | 'high'>('normal');
  const { 
    activeObject,
    zoomIn, 
    zoomOut, 
    resetZoom, 
    zoom,
    undo,
    redo,
    saveToJSON, 
    downloadImage,
    selectAll,
    clearCanvas,
    canvasSize,
    setCanvasSize
  } = useEditor();
  
  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed(!leftSidebarCollapsed);
  };
  
  const toggleRightSidebar = () => {
    setRightSidebarCollapsed(!rightSidebarCollapsed);
  };
  
  const handleExport = (format: 'png' | 'jpeg' | 'svg' | 'html') => {
    console.log(`Exporting as ${format} with quality ${exportQuality}`);
    setExportDialogOpen(false);
    
    if (format === 'png' || format === 'jpeg') {
      downloadImage(format, exportQuality);
    } else if (format === 'svg') {
      downloadImage(format, exportQuality);
    }
    
    toast.success(`Design exported as ${format.toUpperCase()}`);
  };
  
  const handleSave = () => {
    const jsonData = saveToJSON();
    toast.success("Design saved successfully");
    
    if (onSave) {
      onSave(jsonData);
    }
    
    return jsonData;
  };
  
  const handleSelectAll = () => {
    selectAll();
    toast.success("All objects selected");
  };
  
  const handleClearCanvas = () => {
    clearCanvas();
    toast.success("Canvas cleared");
  };
  
  const handleResizeCanvas = (newSize: { width: number; height: number }) => {
    setCanvasSize(newSize);
    toast.success(`Canvas resized to ${newSize.width}x${newSize.height}`);
  };

  const isTextObject = activeObject && 
    (activeObject.type === 'text' || 
     activeObject.type === 'textbox' || 
     activeObject.type === 'i-text');

  return (
    <div className={`design-editor flex flex-col h-screen ${containerClassName}`}>
      <Toolbar 
        onExport={() => setExportDialogOpen(true)}
        onSave={handleSave}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleRightSidebar={toggleRightSidebar}
        zoom={zoom}
        onSelectAll={handleSelectAll}
        onClearCanvas={handleClearCanvas}
        onResizeCanvas={() => setResizeDialogOpen(true)}
      />
      
      <TextEditorToolbar />
      
      <div className={`editor-workspace flex-1 flex ${canvasClassName}`}>
        {showLeftSidebar && (
          <Sidebar 
            collapsed={leftSidebarCollapsed} 
            onToggle={toggleLeftSidebar} 
          />
        )}
        
        <Canvas />
        
        {showRightSidebar && (
          <PropertyPanel 
            collapsed={rightSidebarCollapsed} 
            onToggle={toggleRightSidebar} 
          />
        )}
      </div>
      
      <ExportDialog 
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExport}
      />
      
      <ResizeCanvasDialog
        isOpen={resizeDialogOpen}
        onClose={() => setResizeDialogOpen(false)}
        currentSize={canvasSize}
        onResize={handleResizeCanvas}
      />
    </div>
  );
};

const DesignEditor: React.FC<DesignEditorProps> = ({ 
  initialTemplate, 
  onSave,
  width = 800,
  height = 600,
  containerClassName,
  toolbarClassName,
  canvasClassName,
  showLeftSidebar = true,
  showRightSidebar = true,
  plugins = []
}) => {
  return (
    <EditorProvider initialWidth={width} initialHeight={height} initialTemplate={initialTemplate}>
      <EditorContent 
        onSave={onSave}
        containerClassName={containerClassName}
        toolbarClassName={toolbarClassName}
        canvasClassName={canvasClassName}
        showLeftSidebar={showLeftSidebar}
        showRightSidebar={showRightSidebar}
      />
    </EditorProvider>
  );
};

export default DesignEditor;
