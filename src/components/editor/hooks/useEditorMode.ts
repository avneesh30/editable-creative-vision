
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { EditorMode } from '../types';

export const useEditorMode = (
  canvas: fabric.Canvas | null,
  setCursor: (cursor: string) => void,
  isPanEnabled: boolean,
  disablePan: () => void
) => {
  const [mode, setMode] = useState<EditorMode>('select');

  // Handle mode effects
  useEffect(() => {
    if (!canvas) return;
    
    // Disable pan mode when changing to other modes
    if (isPanEnabled && mode !== 'select') {
      disablePan();
    }

    canvas.isDrawingMode = mode === 'draw';
    
    if (mode === 'draw') {
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = '#000000';
    }

    switch (mode) {
      case 'select':
        setCursor('default');
        break;
      case 'draw':
        setCursor('crosshair');
        break;
      case 'text':
        setCursor('text');
        break;
      case 'image':
        setCursor('cell');
        break;
      case 'shape':
        setCursor('crosshair');
        break;
      default:
        setCursor('default');
    }
  }, [mode, canvas, isPanEnabled, disablePan, setCursor]);

  return {
    mode,
    setMode
  };
};
