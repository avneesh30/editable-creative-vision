
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '../../../../components/ui/context-menu';
import { Package, PackageOpen } from 'lucide-react';
import { useEditor } from '../../context';

const GroupingItems = () => {
  const { groupSelected, ungroupSelected, activeObject } = useEditor();

  return (
    <>
      <ContextMenuItem onClick={() => groupSelected()} disabled={!activeObject || !activeObject.type || activeObject.type !== 'activeSelection'}>
        <Package className="mr-2 h-4 w-4" />
        Group selection
        <ContextMenuShortcut>⌘G</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuItem onClick={() => ungroupSelected()} disabled={!activeObject || !activeObject.type || activeObject.type !== 'group'}>
        <PackageOpen className="mr-2 h-4 w-4" />
        Ungroup
        <ContextMenuShortcut>⌘⇧G</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuSeparator />
    </>
  );
};

export default GroupingItems;
