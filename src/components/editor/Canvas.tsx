import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { useEditor } from './context';
import { cn } from '../../lib/utils';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { toast } from 'sonner';
import CanvasContextMenu from './components/canvas-context-menu';

const ensureValidTextProperties = (textObject: any) => {
  if (!textObject) return textObject;

  try {
    if (textObject.type === 'text' || textObject.type === 'i-text' || textObject.type === 'textbox') {
      if (!textObject.fontFamily) {
        textObject.set('fontFamily', 'Arial');
        console.log('Fixed missing fontFamily in Canvas');
      }

      if (!textObject.fontSize || isNaN(textObject.fontSize)) {
        textObject.set('fontSize', 20);
        console.log('Fixed missing or invalid fontSize in Canvas');
      }

      if (!textObject.fontStyle || !['', 'normal', 'italic', 'oblique'].includes(textObject.fontStyle)) {
        textObject.set('fontStyle', 'normal');
        console.log('Fixed invalid fontStyle in Canvas');
      }

      if (textObject.fontWeight === undefined || textObject.fontWeight === null) {
        textObject.set('fontWeight', 'normal');
        console.log('Fixed missing fontWeight in Canvas');
      }

      if (textObject.textAlign === undefined || textObject.textAlign === null) {
        textObject.set('textAlign', 'left');
        console.log('Fixed missing textAlign in Canvas');
      }

      if (textObject.underline === undefined) {
        textObject.set('underline', false);
      }

      textObject._forceClearCache = true;
    }

    if (textObject.fill === undefined || textObject.fill === null) {
      textObject.set('fill', '#000000');
      console.log('Fixed missing fill in Canvas');
    }
  } catch (err) {
    console.error('Error in ensureValidTextProperties:', err);
  }

  return textObject;
};

const ensureObjectProperties = (object: any) => {
  if (!object) return object;

  try {
    if (object.selectable === undefined) {
      object.set('selectable', true);
    }

    if (object.hasControls === undefined) {
      object.set('hasControls', true);
    }

    if (object.hasBorders === undefined) {
      object.set('hasBorders', true);
    }

    if (object.fill === undefined && (object.type === 'rect' || object.type === 'circle' || object.type === 'triangle')) {
      object.set('fill', '#000000');
      console.log('Fixed missing fill in Canvas for shape');
    }
  } catch (err) {
    console.error('Error in ensureObjectProperties:', err);
  }

  return object;
};

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    canvas,
    canvasSize,
    initCanvas,
    saveToHistory,
    canvasBackgroundColor,
    isPanEnabled
  } = useEditor();

  useKeyboardShortcuts();

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = initCanvas(canvasRef.current);

    if (fabricCanvas) {
      fabricCanvas.selectionColor = 'rgba(65, 105, 225, 0.2)';
      fabricCanvas.selectionBorderColor = '#4169e1';
      fabricCanvas.selectionLineWidth = 1;

      fabricCanvas.on('before:render', () => {
        try {
          fabricCanvas.getObjects().forEach(obj => {
            if (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox') {
              ensureValidTextProperties(obj);
            }
            ensureObjectProperties(obj);
          });
        } catch (err) {
          console.error('Error in before:render handler:', err);
        }
      });

      fabricCanvas.on('mouse:down', (e: fabric.IEvent) => {
        if (e.target) {
          if (e.target.type === 'text' || e.target.type === 'i-text' || e.target.type === 'textbox') {
            ensureValidTextProperties(e.target);
          }
          ensureObjectProperties(e.target);
        }
      });

      fabricCanvas.on('object:added', (e: fabric.IEvent) => {
        if (e.target) {
          if (e.target.type === 'text' || e.target.type === 'i-text' || e.target.type === 'textbox') {
            ensureValidTextProperties(e.target);
          }
          ensureObjectProperties(e.target);
          console.log('Object added to canvas:', e.target.type);
        }
      });

      fabricCanvas.on('selection:created', (e: fabric.IEvent) => {
        console.log('Selection created:', e.selected?.map(obj => obj.type));
        if (e.selected && e.selected.length > 0) {
          e.selected.forEach(obj => {
            ensureObjectProperties(obj);
            console.log('Selected object:', obj.type, 'fill:', obj.fill);
          });
        }
      });

      fabricCanvas.on('selection:updated', (e: fabric.IEvent) => {
        console.log('Selection updated:', e.selected?.map(obj => obj.type));
        if (e.selected && e.selected.length > 0) {
          e.selected.forEach(obj => {
            ensureObjectProperties(obj);
            console.log('Updated selected object:', obj.type, 'fill:', obj.fill);
          });
        }
      });

      fabricCanvas.on('object:modified', (e: fabric.IEvent) => {
        if (e.target) {
          if (e.target.type === 'text' || e.target.type === 'i-text' || e.target.type === 'textbox') {
            ensureValidTextProperties(e.target);
          }
          ensureObjectProperties(e.target);
          console.log('Fixed properties on object:modified');

          if (saveToHistory) {
            saveToHistory(fabricCanvas);
          }
        }
      });
    }

    const fonts = [
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Courier New',
      'Georgia',
      'Verdana',
      'Roboto',
      'Open Sans',
      'Playfair Display'
    ];

    const fontPreloader = document.createElement('div');
    fontPreloader.style.opacity = '0';
    fontPreloader.style.position = 'absolute';
    fontPreloader.style.pointerEvents = 'none';

    fonts.forEach(font => {
      const span = document.createElement('span');
      span.style.fontFamily = font;
      span.innerText = 'Preloading Font';
      fontPreloader.appendChild(span);
    });

    document.body.appendChild(fontPreloader);

    toast.info("Tip: Use Ctrl+A to select all elements, then Delete to remove them all at once", {
      id: "canvas-tip",
      duration: 5000
    });

    return () => {
      if (canvas) {
        canvas.dispose();
      }
      if (document.getElementById('fontPreloader')) {
        document.body.removeChild(document.getElementById('fontPreloader')!);
      }
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    canvas.setWidth(canvasSize.width);
    canvas.setHeight(canvasSize.height);
    canvas.renderAll();
  }, [canvas, canvasSize]);

  useEffect(() => {
    if (!canvas) return;

    canvas.backgroundColor = canvasBackgroundColor;
    canvas.renderAll();
  }, [canvas, canvasBackgroundColor]);

  return (
    <div className="editor-main">
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Roboto:wght@300;400;500;700&family=Playfair+Display:wght@400;700&family=Open+Sans:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <CanvasContextMenu>
        <div className="canvas-wrapper flex justify-center items-center h-full w-full">
          <div
            ref={containerRef}
            className={cn(
              "editor-canvas-container animate-fade-in",
              isPanEnabled ? "cursor-grab active:cursor-grabbing" : ""
            )}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <canvas
              ref={canvasRef}
              id="fabric-canvas"
              className={cn(
                "absolute top-0 left-0",
                "touch-none select-none",
                isPanEnabled ? "cursor-grab active:cursor-grabbing" : ""
              )}
            />
          </div>
        </div>
      </CanvasContextMenu>
    </div>
  );
};

export default Canvas;
