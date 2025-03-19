
import { useState, useCallback } from 'react';
import { fabric } from 'fabric';

export const useCanvasBackground = (
  canvas: fabric.Canvas | null | any,
  onBackgroundChange: () => void
) => {
  const [canvasBackgroundColor, setCanvasBackgroundColorState] = useState<string>('#ffffff');

  const setCanvasBackgroundColor = useCallback((color: string) => {
    if (!canvas) return;

    console.log('Setting canvas background color to:', color);

    try {
      // Set both background color
      canvas.backgroundColor = color;
      canvas.backgroundImage = null; // Clear any background image
      canvas.renderAll();

      setCanvasBackgroundColorState(color);
      onBackgroundChange();
    } catch (error) {
      console.error('Error setting canvas background color:', error);
    }
  }, [canvas, onBackgroundChange]);

  // Initialize background color when canvas is created
  const initializeBackground = useCallback(() => {
    if (!canvas) return;
    if (!canvas.backgroundColor) {
      setCanvasBackgroundColor('#ffffff');
    } else {
      setCanvasBackgroundColorState(canvas.backgroundColor as string);
    }
  }, [canvas, setCanvasBackgroundColor]);

  return {
    canvasBackgroundColor,
    setCanvasBackgroundColor,
    initializeBackground
  };
};
