
import { fabric } from 'fabric';
import { useState } from 'react';
import { toast } from 'sonner';

export const useClipboard = (
  canvas: fabric.Canvas | null,
  onClipboardAction: () => void
) => {
  const [clipboardData, setClipboardData] = useState<string | null>(null);

  const copyToClipboard = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      toast.error('No object selected to copy');
      return;
    }

    // Clone with the proper function signature for Fabric.js
    activeObject.clone((cloned: fabric.Object) => {
      setClipboardData(JSON.stringify(cloned.toJSON()));
      toast.success('Copied to clipboard');
    }, ['data']);  // Add required parameter - typically an array of properties to include
  };

  const pasteFromClipboard = () => {
    if (!canvas || !clipboardData) {
      if (!clipboardData) {
        toast.error('Nothing to paste');
      }
      return;
    }

    try {
      const activeObject = canvas.getActiveObject();

      // Handle replacement of active object
      if (activeObject) {
        fabric.util.enlivenObjects(
          [JSON.parse(clipboardData)],
          (objects: any) => {
            if (objects.length > 0) {
              const newObj = objects[0];

              newObj.set({
                left: activeObject.left,
                top: activeObject.top,
                scaleX: activeObject.scaleX,
                scaleY: activeObject.scaleY,
                angle: activeObject.angle
              });

              canvas.remove(activeObject);
              canvas.add(newObj);
              canvas.setActiveObject(newObj);
              canvas.renderAll();
              onClipboardAction();
              toast.success('Object replaced');
            }
          },
          'fabric' // Add required namespace parameter
        );
      } else {
        // Handle paste without specific location
        fabric.util.enlivenObjects(
          [JSON.parse(clipboardData)],
          (objects: any) => {
            if (objects.length > 0) {
              const pastedObj = objects[0];

              pastedObj.set({
                left: (pastedObj.left || 0) + 20,
                top: (pastedObj.top || 0) + 20
              });

              canvas.add(pastedObj);
              canvas.setActiveObject(pastedObj);
              canvas.renderAll();
              onClipboardAction();
              toast.success('Pasted from clipboard');
            }
          },
          'fabric' // Add required namespace parameter
        );
      }
    } catch (error) {
      console.error('Error pasting from clipboard:', error);
      toast.error('Error pasting from clipboard');
    }
  };

  // Add a new function for pasting at a specific location
  const pasteAtPosition = (x: number, y: number) => {
    if (!canvas || !clipboardData) {
      if (!clipboardData) {
        toast.error('Nothing to paste');
      }
      return;
    }

    try {
      fabric.util.enlivenObjects(
        [JSON.parse(clipboardData)],
        (objects: any) => {
          if (objects.length > 0) {
            const pastedObj = objects[0];

            pastedObj.set({
              left: x - (pastedObj.width || 0) * (pastedObj.scaleX || 1) / 2,
              top: y - (pastedObj.height || 0) * (pastedObj.scaleY || 1) / 2
            });

            canvas.add(pastedObj);
            canvas.setActiveObject(pastedObj);
            canvas.renderAll();
            onClipboardAction();
            toast.success('Pasted from clipboard');
          }
        },
        'fabric' // Add required namespace parameter
      );
    } catch (error) {
      console.error('Error pasting from clipboard:', error);
      toast.error('Error pasting from clipboard');
    }
  };

  return {
    copyToClipboard,
    pasteFromClipboard,
    pasteAtPosition
  };
};

export default useClipboard;
