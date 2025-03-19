
import { useCallback } from 'react';
import { fabric } from 'fabric';
import { CanvasSize } from '../types';

// Helper function to ensure text objects have valid font properties
const ensureValidTextProperties = (obj: fabric.Object) => {
  if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
    const textObj = obj as any;
    
    // Ensure fontFamily is never undefined or null - most critical property
    if (!textObj.fontFamily) {
      textObj.set('fontFamily', 'Arial');
      console.log('Fixed missing fontFamily');
    }
    
    // Ensure fontSize is valid - another critical property
    if (!textObj.fontSize || isNaN(textObj.fontSize)) {
      textObj.set('fontSize', 20);
      console.log('Fixed missing or invalid fontSize');
    }
    
    // Ensure fontStyle is one of the valid values
    if (!textObj.fontStyle || !['', 'normal', 'italic', 'oblique'].includes(textObj.fontStyle)) {
      textObj.set('fontStyle', 'normal');
      console.log('Fixed invalid fontStyle');
    }
    
    // Ensure fontWeight is defined and valid
    if (textObj.fontWeight === undefined || textObj.fontWeight === null) {
      textObj.set('fontWeight', 'normal');
      console.log('Fixed missing fontWeight');
    }
    
    // Ensure text align is defined and valid
    if (textObj.textAlign === undefined || textObj.textAlign === null) {
      textObj.set('textAlign', 'left');
      console.log('Fixed missing textAlign');
    }

    // Ensure underline is defined (optional property)
    if (textObj.underline === undefined) {
      textObj.set('underline', false);
    }

    // Ensure text background color is valid
    if (textObj.backgroundColor === undefined) {
      textObj.set('backgroundColor', '');
    }

    // Ensure lineHeight is valid
    if (textObj.lineHeight === undefined || isNaN(textObj.lineHeight)) {
      textObj.set('lineHeight', 1.16);
    }

    // Cache busting for font rendering
    textObj._forceClearCache = true;
  }
};

// Safely check and fix all text objects on the canvas
const fixAllTextObjectsSafely = (canvas: fabric.Canvas) => {
  if (!canvas) return;
  
  try {
    canvas.getObjects().forEach(obj => {
      try {
        ensureValidTextProperties(obj);
      } catch (e) {
        console.error('Error fixing text object:', e);
      }
    });
  } catch (e) {
    console.error('Error in fixAllTextObjectsSafely:', e);
  }
  
  // Don't call renderAll here to avoid recursion
};

export const useCanvasInitializer = (
  canvasSize: CanvasSize,
  onSelection: (obj: fabric.Object | null) => void,
  onModified: () => void
) => {
  const initCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    if (!canvasElement) return;

    // Create a new canvas instance
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      backgroundColor: '#ffffff',
      width: canvasSize.width,
      height: canvasSize.height,
      preserveObjectStacking: true,
      skipOffscreen: true, // Performance improvement
    });

    // Fix text properties when selecting objects
    fabricCanvas.on('selection:created', (e: fabric.IEvent) => {
      const selectedObj = e.selected?.[0] || null;
      if (selectedObj) {
        try {
          ensureValidTextProperties(selectedObj);
          console.log('Fixed properties on selection:created');
        } catch (err) {
          console.error('Error fixing properties on selection:created', err);
        }
      }
      onSelection(selectedObj);
    });

    fabricCanvas.on('selection:updated', (e: fabric.IEvent) => {
      const selectedObj = e.selected?.[0] || null;
      if (selectedObj) {
        try {
          ensureValidTextProperties(selectedObj);
          console.log('Fixed properties on selection:updated');
        } catch (err) {
          console.error('Error fixing properties on selection:updated', err);
        }
      }
      onSelection(selectedObj);
    });

    fabricCanvas.on('selection:cleared', () => {
      onSelection(null);
    });

    fabricCanvas.on('object:modified', (e: fabric.IEvent) => {
      if (e.target) {
        try {
          ensureValidTextProperties(e.target);
          console.log('Fixed properties on object:modified');
        } catch (err) {
          console.error('Error fixing properties on object:modified', err);
        }
      }
      onModified();
    });
    
    fabricCanvas.on('object:added', (e: fabric.IEvent) => {
      if (e.target) {
        try {
          ensureValidTextProperties(e.target);
          console.log('Fixed properties on object:added');
        } catch (err) {
          console.error('Error fixing properties on object:added', err);
        }
      }
    });
    
    // Initial fix for any objects already on the canvas - safely
    setTimeout(() => {
      try {
        fixAllTextObjectsSafely(fabricCanvas);
        fabricCanvas.requestRenderAll();
      } catch (err) {
        console.error('Error in initial text fix:', err);
      }
    }, 100);

    return fabricCanvas;
  }, [canvasSize, onSelection, onModified]);

  return { initCanvas };
};
