
import { useCallback } from 'react';
import { fabric } from 'fabric';

export const useCursor = (canvas: fabric.Canvas | null) => {
  const setCursor = useCallback((cursor: string) => {
    if (!canvas) return;
    canvas.defaultCursor = cursor;
  }, [canvas]);

  return { setCursor };
};
