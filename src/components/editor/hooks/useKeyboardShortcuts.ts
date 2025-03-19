
import { useEffect, useCallback } from 'react';
import { useEditor } from '../context';

export const useKeyboardShortcuts = () => {
  const {
    undo,
    redo,
    removeActiveObject,
    copyToClipboard,
    pasteFromClipboard,
    setMode,
    addText,
    addRect,
    addCircle,
    zoomIn,
    zoomOut,
    resetZoom,
    selectAll,
    clearCanvas
  } = useEditor();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts when focusing input elements
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return;
      }

      // Command/Ctrl + Z - Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        console.log('Undo keyboard shortcut triggered');
        undo();
      }

      // Command/Ctrl + Shift + Z - Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        console.log('Redo keyboard shortcut triggered');
        redo();
      }

      // Command/Ctrl + Y - Redo (alternative)
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        console.log('Redo keyboard shortcut triggered (Ctrl+Y)');
        redo();
      }

      // Delete or Backspace - Delete selected objects
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeActiveObject();
      }

      // Command/Ctrl + C - Copy
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        copyToClipboard();
      }

      // Command/Ctrl + V - Paste
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        pasteFromClipboard();
      }
      
      // Command/Ctrl + A - Select All
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        selectAll();
      }

      // V - Select tool
      if (e.key === 'v' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        setMode('select');
      }

      // T - Text tool
      if (e.key === 't' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        setMode('text');
        addText('New text');
      }

      // R - Rectangle tool
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        setMode('shape');
        addRect();
      }

      // C - Circle tool
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        setMode('shape');
        addCircle();
      }

      // D - Draw tool
      if (e.key === 'd' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        setMode('draw');
      }

      // I - Image tool
      if (e.key === 'i' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        setMode('image');
      }

      // + or = - Zoom in
      if (e.key === '+' || e.key === '=') {
        zoomIn();
      }

      // - or _ - Zoom out
      if (e.key === '-' || e.key === '_') {
        zoomOut();
      }

      // 0 - Reset zoom
      if (e.key === '0') {
        resetZoom();
      }
      
      // Escape - Clear canvas
      if (e.key === 'Escape' && e.shiftKey) {
        clearCanvas();
      }
    },
    [
      undo,
      redo,
      removeActiveObject,
      copyToClipboard,
      pasteFromClipboard,
      setMode,
      addText,
      addRect,
      addCircle,
      zoomIn,
      zoomOut,
      resetZoom,
      selectAll,
      clearCanvas
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
