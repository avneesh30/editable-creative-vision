
import { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';

export const useCanvasHistory = () => {
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Update state based on stack lengths
  useEffect(() => {
    setCanUndo(undoStack.current.length > 1);
    setCanRedo(redoStack.current.length > 0);
  }, [undoStack.current.length, redoStack.current.length]);

  const saveToHistory = (canvas: fabric.Canvas | null) => {
    if (!canvas) return;
    
    try {
      // Save current state to undo stack
      const json = JSON.stringify(canvas.toJSON(['id', 'selectable', 'hasControls', 'hasBorders']));
      undoStack.current.push(json);
      
      // Clear redo stack when new state is added
      redoStack.current = [];
      
      // Limit history size to prevent memory issues
      if (undoStack.current.length > 50) {
        undoStack.current.shift();
      }
      
      // Update state
      setCanUndo(undoStack.current.length > 1);
      setCanRedo(false);
      
      console.log('Saved to history, undo stack length:', undoStack.current.length);
    } catch (error) {
      console.error('Error saving canvas state to history:', error);
    }
  };

  const undo = (canvas: fabric.Canvas | null) => {
    if (!canvas || undoStack.current.length <= 1) return;
    
    try {
      // Save current state to redo stack before removing it from undo stack
      const currentState = undoStack.current.pop() || '';
      redoStack.current.push(currentState);
      
      // Restore previous state
      const previousState = undoStack.current[undoStack.current.length - 1];
      if (previousState) {
        canvas.loadFromJSON(JSON.parse(previousState), () => {
          canvas.renderAll();
          console.log('Undo: Loaded previous state from history');
        });
      }
      
      // Update state
      setCanUndo(undoStack.current.length > 1);
      setCanRedo(redoStack.current.length > 0);
    } catch (error) {
      console.error('Error in undo operation:', error);
    }
  };

  const redo = (canvas: fabric.Canvas | null) => {
    if (!canvas || redoStack.current.length === 0) return;
    
    try {
      // Get state from redo stack
      const nextState = redoStack.current.pop();
      if (nextState) {
        // Push the current state to undo stack before loading the next state
        if (undoStack.current.length > 0) {
          // No need to re-save the current state as it's already in the undo stack
        }
        
        // Load the state from redo stack
        canvas.loadFromJSON(JSON.parse(nextState), () => {
          canvas.renderAll();
          console.log('Redo: Loaded next state from history');
          
          // After loading the state from redo, add it to the undo stack
          undoStack.current.push(nextState);
        });
      }
      
      // Update state
      setCanUndo(true); // After redo, we can always undo
      setCanRedo(redoStack.current.length > 0);
    } catch (error) {
      console.error('Error in redo operation:', error);
    }
  };

  return {
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo
  };
};
