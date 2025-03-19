
import { useEffect } from 'react';
import { fabric } from 'fabric';

export const useHistoryEvents = (
  canvas: fabric.Canvas | null,
  saveToHistory: (canvas: fabric.Canvas | null) => void
) => {
  // Register object modification events to save history states
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectModified = () => {
      console.log('Object modified - saving to history');
      saveToHistory(canvas);
    };
    
    const handleObjectAdded = () => {
      console.log('Object added - saving to history');
      saveToHistory(canvas);
    };
    
    const handleObjectRemoved = () => {
      console.log('Object removed - saving to history');
      saveToHistory(canvas);
    };
    
    // Add event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Save initial state
    saveToHistory(canvas);
    
    // Clean up event listeners
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas, saveToHistory]);
};
