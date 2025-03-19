
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '../../../../components/ui/context-menu';
import { FlipHorizontal, FlipVertical, Send } from 'lucide-react';
import { useEditor } from '../../context';

const TransformItems = () => {
  const { activeObject, canvas, removeActiveObject } = useEditor();

  return (
    <>
      <ContextMenuItem onClick={() => {
        if (activeObject && canvas) {
          activeObject.set('flipX', !activeObject.flipX);
          canvas.renderAll();
        }
      }} disabled={!activeObject}>
        <FlipHorizontal className="mr-2 h-4 w-4" />
        Flip horizontal
        <ContextMenuShortcut>H</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => {
        if (activeObject && canvas) {
          activeObject.set('flipY', !activeObject.flipY);
          canvas.renderAll();
        }
      }} disabled={!activeObject}>
        <FlipVertical className="mr-2 h-4 w-4" />
        Flip vertical
        <ContextMenuShortcut>V</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem onClick={() => removeActiveObject()} disabled={!activeObject}>
        <Send className="mr-2 h-4 w-4" />
        Delete
        <ContextMenuShortcut>Delete</ContextMenuShortcut>
      </ContextMenuItem>
    </>
  );
};

export default TransformItems;
