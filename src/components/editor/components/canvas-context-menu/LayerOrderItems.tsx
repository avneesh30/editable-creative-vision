
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '../../../../components/ui/context-menu';
import { MoveUp, MoveDown } from 'lucide-react';
import { useEditor } from '../../context';

const LayerOrderItems = () => {
  const { bringToFront, bringForward, sendBackward, sendToBack, activeObject } = useEditor();

  return (
    <>
      <ContextMenuItem onClick={() => bringToFront()} disabled={!activeObject}>
        <MoveUp className="mr-2 h-4 w-4" />
        Bring to front
        <ContextMenuShortcut>]</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => bringForward()} disabled={!activeObject}>
        <MoveUp className="mr-2 h-4 w-4" />
        Bring forward
      </ContextMenuItem>

      <ContextMenuItem onClick={() => sendBackward()} disabled={!activeObject}>
        <MoveDown className="mr-2 h-4 w-4" />
        Send backward
      </ContextMenuItem>

      <ContextMenuItem onClick={() => sendToBack()} disabled={!activeObject}>
        <MoveDown className="mr-2 h-4 w-4" />
        Send to back
        <ContextMenuShortcut>[</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuSeparator />
    </>
  );
};

export default LayerOrderItems;
