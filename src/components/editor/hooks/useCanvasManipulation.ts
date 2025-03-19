
import { fabric } from 'fabric';

export const useCanvasManipulation = (
  canvas: fabric.Canvas | null | any,
  setActiveObject: (obj: fabric.Object | null) => void,
  onManipulation: () => void
) => {
  const removeActiveObject = () => {
    if (!canvas || !canvas.getActiveObject()) return;

    const activeObject: any = canvas.getActiveObject();

    // If the selection is a group of objects (activeSelection)
    if (activeObject instanceof fabric.ActiveSelection) {
      // Get all objects in the selection
      const objects = activeObject.getObjects();

      // Remove each object individually
      objects.forEach(obj => {
        canvas.remove(obj);
      });

      // After removing all objects, clear the selection
      canvas.discardActiveObject();
    } else {
      // Remove a single object
      canvas.remove(activeObject);
    }

    setActiveObject(null);
    canvas.renderAll();
    onManipulation();
  };

  const bringForward = () => {
    if (!canvas || !canvas.getActiveObject()) return;

    canvas.bringForward(canvas.getActiveObject());
    canvas.renderAll();
    onManipulation();
  };

  const sendBackward = () => {
    if (!canvas || !canvas.getActiveObject()) return;

    canvas.sendBackwards(canvas.getActiveObject());
    canvas.renderAll();
    onManipulation();
  };

  const bringToFront = () => {
    if (!canvas || !canvas.getActiveObject()) return;

    canvas.bringToFront(canvas.getActiveObject());
    canvas.renderAll();
    onManipulation();
  };

  const sendToBack = () => {
    if (!canvas || !canvas.getActiveObject()) return;

    canvas.sendToBack(canvas.getActiveObject());
    canvas.renderAll();
    onManipulation();
  };

  const groupSelected = () => {
    if (!canvas) return;

    if (!canvas.getActiveObject()) return;
    const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeSelection || !activeSelection.type || activeSelection.type !== 'activeSelection') return;

    const group = activeSelection.toGroup();
    canvas.setActiveObject(group);
    onManipulation();
  };

  const ungroupSelected = () => {
    if (!canvas) return;

    if (!canvas.getActiveObject()) return;
    const activeObject = canvas.getActiveObject() as fabric.Group;
    if (!activeObject || !activeObject.type || activeObject.type !== 'group') return;

    const items = activeObject.toActiveSelection();
    canvas.setActiveObject(items);
    canvas.requestRenderAll();
    onManipulation();
  };

  const cloneSelected = () => {
    if (!canvas || !canvas.getActiveObject()) return;

    const activeObj: any = canvas.getActiveObject();

    activeObj.clone(function (clonedObj: fabric.Object) {
      clonedObj.set({
        left: (clonedObj.left || 0) + 20,
        top: (clonedObj.top || 0) + 20,
      });
      canvas.add(clonedObj);
      canvas.setActiveObject(clonedObj);
      setActiveObject(clonedObj);
      onManipulation();
    });
  };

  // Function to select all objects on canvas
  const selectAll = () => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length === 0) return;

    if (objects.length === 1) {
      canvas.setActiveObject(objects[0]);
    } else {
      const selection = new fabric.ActiveSelection(objects, { canvas });
      canvas.setActiveObject(selection);
    }

    canvas.requestRenderAll();
    setActiveObject(canvas.getActiveObject());
  };

  // Function to clear all objects from canvas
  const clearCanvas = () => {
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.requestRenderAll();
    setActiveObject(null);
    onManipulation();
  };

  return {
    removeActiveObject,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    groupSelected,
    ungroupSelected,
    cloneSelected,
    selectAll,
    clearCanvas
  };
};
