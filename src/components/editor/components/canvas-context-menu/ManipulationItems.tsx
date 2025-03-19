
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '../../../../components/ui/context-menu';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { useEditor } from '../../context';

const ManipulationItems = () => {
  const { activeObject, canvas } = useEditor();

  return (
    <>
      <ContextMenuItem onClick={() => {
        if (activeObject && canvas) {
          activeObject.set('selectable', !activeObject.selectable);
          activeObject.set('evented', !activeObject.evented);
          canvas.renderAll();
        }
      }} disabled={!activeObject}>
        {activeObject?.selectable ? (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Lock
          </>
        ) : (
          <>
            <Unlock className="mr-2 h-4 w-4" />
            Unlock
          </>
        )}
        <ContextMenuShortcut>⌘L</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => {
        if (activeObject && canvas) {
          activeObject.set('visible', !activeObject.visible);
          canvas.renderAll();
        }
      }} disabled={!activeObject}>
        {activeObject?.visible !== false ? (
          <>
            <EyeOff className="mr-2 h-4 w-4" />
            Hide
          </>
        ) : (
          <>
            <Eye className="mr-2 h-4 w-4" />
            Show
          </>
        )}
        <ContextMenuShortcut>⌘H</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuSeparator />
    </>
  );
};

export default ManipulationItems;
