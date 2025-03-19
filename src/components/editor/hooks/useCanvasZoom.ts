
import { useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { CanvasSize } from '../types';

export const useCanvasZoom = (canvas: fabric.Canvas | null, canvasSize: CanvasSize) => {
  const [zoom, setZoom] = useState<number>(1);

  // Update zoom when canvas or canvasSize changes
  useEffect(() => {
    if (canvas) {
      // Set initial dimensions
      canvas.setDimensions({
        width: canvasSize.width,
        height: canvasSize.height
      });
      canvas.renderAll();
    }
  }, [canvas, canvasSize]);

  const updateCanvasZoom = useCallback((newZoom: number) => {
    if (!canvas) return;
    
    // Set zoom level
    canvas.setZoom(newZoom);
    
    // Update dimensions
    canvas.setDimensions({
      width: canvasSize.width * newZoom,
      height: canvasSize.height * newZoom
    });
    
    canvas.renderAll();
  }, [canvas, canvasSize]);

  const zoomIn = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.min(zoom + 0.1, 3);
    setZoom(newZoom);
    updateCanvasZoom(newZoom);
  }, [canvas, zoom, updateCanvasZoom]);

  const zoomOut = useCallback(() => {
    if (!canvas) return;
    
    const newZoom = Math.max(zoom - 0.1, 0.1);
    setZoom(newZoom);
    updateCanvasZoom(newZoom);
  }, [canvas, zoom, updateCanvasZoom]);

  const resetZoom = useCallback(() => {
    if (!canvas) return;
    
    setZoom(1);
    updateCanvasZoom(1);
  }, [canvas, updateCanvasZoom]);

  return {
    zoom,
    zoomIn,
    zoomOut,
    resetZoom
  };
};
