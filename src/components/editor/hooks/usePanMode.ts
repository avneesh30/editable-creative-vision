import { useCallback, useState, useRef } from 'react';
import { fabric } from 'fabric';

// Create a custom interface for the fabric Canvas with panning properties
interface PanCanvas extends fabric.Canvas {
  isDragging?: boolean;
  lastPosX?: number;
  lastPosY?: number;
}

export const usePanMode = (canvas: fabric.Canvas | null) => {
  const [isPanEnabled, setIsPanEnabled] = useState<boolean>(false);
  const isPanEnabledRef = useRef<boolean>(false);

  // Enable panning mode
  const enablePan = useCallback(() => {
    if (!canvas) return;

    setIsPanEnabled(true);
    isPanEnabledRef.current = true;
    
    canvas.defaultCursor = 'grab';
    canvas.getObjects().forEach((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });
    canvas.selection = false;
    canvas.renderAll();

    // Remove existing handlers to prevent duplicates
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    canvas.on('mouse:down', function(this: PanCanvas, opt) {
      const evt = opt.e;
      if (isPanEnabledRef.current) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        canvas.defaultCursor = 'grabbing';
      }
    });

    canvas.on('mouse:move', function(this: PanCanvas, opt) {
      if (this.isDragging && isPanEnabledRef.current) {
        const evt = opt.e;
        const vpt = this.viewportTransform;
        if (vpt) {
          vpt[4] += evt.clientX - this.lastPosX!;
          vpt[5] += evt.clientY - this.lastPosY!;
          this.requestRenderAll();
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      }
    });

    canvas.on('mouse:up', function(this: PanCanvas) {
      this.isDragging = false;
      this.selection = isPanEnabledRef.current ? false : true;
      canvas.defaultCursor = isPanEnabledRef.current ? 'grab' : 'default';
    });

  }, [canvas]);

  // Disable panning mode
  const disablePan = useCallback(() => {
    if (!canvas) return;

    setIsPanEnabled(false);
    isPanEnabledRef.current = false;
    
    canvas.defaultCursor = 'default';
    canvas.getObjects().forEach((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });
    canvas.selection = true;
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.renderAll();
  }, [canvas]);

  return {
    isPanEnabled,
    enablePan,
    disablePan
  };
};
