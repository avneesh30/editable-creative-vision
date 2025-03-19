import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { fabric } from 'fabric';
import { 
  CanvasSize, 
  EditorContextType, 
  EditorMode
} from '../types';
import { EditorContext } from './EditorContext';

// Import custom hooks
import { useCanvasHistory } from '../hooks/useCanvasHistory';
import { useCanvasInitializer } from '../hooks/useCanvasInitializer';
import { useCanvasObjects } from '../hooks/useCanvasObjects';
import { useCanvasManipulation } from '../hooks/useCanvasManipulation';
import { useCanvasExport } from '../hooks/useCanvasExport';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { useClipboard } from '../hooks/useClipboard';
import { usePanMode } from '../hooks/usePanMode';
import { useCursor } from '../hooks/useCursor';
import { useCanvasBackground } from '../hooks/useCanvasBackground';
import { useEditorMode } from '../hooks/useEditorMode';
import { useCanvasSize } from '../hooks/useCanvasSize';
import { useHistoryEvents } from '../hooks/useHistoryEvents';

const defaultCanvasSize: CanvasSize = { width: 800, height: 600 };

interface EditorProviderProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  initialTemplate?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ 
  children, 
  initialWidth, 
  initialHeight,
  initialTemplate
}) => {
  const initialCanvasSize = {
    width: initialWidth || defaultCanvasSize.width,
    height: initialHeight || defaultCanvasSize.height
  };

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  
  // History management with enhanced undo/redo capability
  const { saveToHistory, undo: historyUndo, redo: historyRedo, canUndo, canRedo } = useCanvasHistory();
  
  // Hooks for various canvas functionalities
  const { isPanEnabled, enablePan, disablePan } = usePanMode(canvas);
  const { setCursor } = useCursor(canvas);
  const { canvasBackgroundColor, setCanvasBackgroundColor, initializeBackground } = useCanvasBackground(canvas, () => saveToHistory(canvas));
  const { mode, setMode } = useEditorMode(canvas, setCursor, isPanEnabled, disablePan);
  const { canvasSize, setCanvasSize } = useCanvasSize(canvas, initialCanvasSize, () => saveToHistory(canvas));
  
  // Register history event listeners
  useHistoryEvents(canvas, saveToHistory);
  
  // Canvas initializer
  const { initCanvas: initCanvasBase } = useCanvasInitializer(
    canvasSize,
    setActiveObject,
    () => saveToHistory(canvas)
  );
  
  // Initialize canvas and set it to state
  const initCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    if (!canvasElement) return;
    
    const fabricCanvas = initCanvasBase(canvasElement);
    if (fabricCanvas) {
      setCanvas(fabricCanvas);
      return fabricCanvas;
    }
  }, [initCanvasBase]);
  
  // Load initial template if provided
  useEffect(() => {
    if (canvas && initialTemplate) {
      try {
        canvas.loadFromJSON(JSON.parse(initialTemplate), () => {
          canvas.renderAll();
          saveToHistory(canvas);
        });
      } catch (error) {
        console.error('Failed to load initial template:', error);
      }
    }
  }, [canvas, initialTemplate, saveToHistory]);
  
  // Canvas object add functions
  const { 
    addText, 
    addRect, 
    addCircle, 
    addTriangle, 
    addImage, 
    addShape,
    createBusinessCardTemplate 
  } = useCanvasObjects(
    canvas,
    setActiveObject,
    () => saveToHistory(canvas)
  );
  
  // Canvas manipulation functions
  const {
    removeActiveObject,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupSelected,
    ungroupSelected,
    cloneSelected,
    selectAll,
    clearCanvas
  } = useCanvasManipulation(canvas, setActiveObject, () => saveToHistory(canvas));
  
  // Canvas export functions
  const {
    saveToJSON,
    loadFromJSON,
    exportToImage,
    exportToHTML,
    downloadImage
  } = useCanvasExport(canvas);
  
  // Canvas zoom functions
  const { zoom, zoomIn, zoomOut, resetZoom } = useCanvasZoom(canvas, canvasSize);
  
  // Clipboard functions
  const { copyToClipboard, pasteFromClipboard, pasteAtPosition } = useClipboard(canvas, () => saveToHistory(canvas));
  
  // Undo and redo wrappers with improved logging
  const undo = useCallback(() => {
    console.log('Undo triggered in Editor Provider');
    historyUndo(canvas);
  }, [historyUndo, canvas]);
  
  const redo = useCallback(() => {
    console.log('Redo triggered in Editor Provider');
    historyRedo(canvas);
  }, [historyRedo, canvas]);
  
  // Initialize background when canvas is created
  useEffect(() => {
    if (canvas) {
      initializeBackground();
    }
  }, [canvas, initializeBackground]);

  // Prepare context value
  const value = useMemo<EditorContextType>(() => ({
    canvas,
    activeObject,
    mode,
    setMode,
    canvasSize,
    setCanvasSize,
    canvasBackgroundColor,
    setCanvasBackgroundColor,
    initCanvas,
    addText,
    addRect,
    addCircle,
    addImage,
    addTriangle,
    removeActiveObject,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupSelected,
    ungroupSelected,
    cloneSelected,
    saveToJSON,
    loadFromJSON,
    exportToImage,
    exportToHTML,
    zoomIn,
    zoomOut,
    resetZoom,
    undo,
    redo,
    downloadImage,
    copyToClipboard,
    pasteFromClipboard,
    pasteAtPosition,
    setCursor,
    zoom,
    createBusinessCardTemplate,
    selectAll,
    clearCanvas,
    saveToHistory,
    canUndo,
    canRedo,
    addShape,
    enablePan,
    disablePan,
    isPanEnabled
  }), [
    canvas, activeObject, mode, canvasSize, initCanvas, 
    addText, addRect, addCircle, addImage, addTriangle,
    removeActiveObject, bringForward, sendBackward, bringToFront, sendToBack,
    groupSelected, ungroupSelected, cloneSelected,
    saveToJSON, loadFromJSON, exportToImage, exportToHTML,
    zoomIn, zoomOut, resetZoom, undo, redo, downloadImage,
    copyToClipboard, pasteFromClipboard, pasteAtPosition, zoom, createBusinessCardTemplate,
    selectAll, clearCanvas, setCanvasSize, saveToHistory,
    canUndo, canRedo, addShape, canvasBackgroundColor, setCanvasBackgroundColor,
    enablePan, disablePan, isPanEnabled, setCursor
  ]);

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};
