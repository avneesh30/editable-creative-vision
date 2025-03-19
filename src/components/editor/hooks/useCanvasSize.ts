
import { useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { CanvasSize } from '../types';

export const useCanvasSize = (
  canvas: fabric.Canvas | null,
  initialCanvasSize: CanvasSize,
  onCanvasSizeChange: () => void
) => {
  const [canvasSize, setCanvasSizeState] = useState<CanvasSize>(initialCanvasSize);
  
  // Resize canvas function
  const resizeCanvas = useCallback((newSize: CanvasSize) => {
    if (!canvas) return;
    
    console.log('Resizing canvas to:', newSize);
    
    try {
      setCanvasSizeState(newSize);
      canvas.setWidth(newSize.width);
      canvas.setHeight(newSize.height);
      
      // Center objects after resize if needed
      const canvasObjects = canvas.getObjects();
      if (canvasObjects.length > 0) {
        const selectionGroup = new fabric.ActiveSelection(canvasObjects, { canvas });
        selectionGroup.center();
        canvas.discardActiveObject();
      }
      
      canvas.renderAll();
      onCanvasSizeChange();
    } catch (error) {
      console.error('Error resizing canvas:', error);
    }
  }, [canvas, onCanvasSizeChange]);

  return {
    canvasSize,
    setCanvasSize: resizeCanvas
  };
};
