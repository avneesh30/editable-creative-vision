
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '../../../../components/ui/context-menu';
import { useEditor } from '../../context';
import CopyPasteItems from './CopyPasteItems';
import LayerOrderItems from './LayerOrderItems';
import GroupingItems from './GroupingItems';
import ManipulationItems from './ManipulationItems';
import TransformItems from './TransformItems';

interface CanvasContextMenuProps {
  children: React.ReactNode;
}

const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({ children }) => {
  const { canvas } = useEditor();

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full h-full">{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-popover shadow-lg">
        <CopyPasteItems />
        <LayerOrderItems />
        <GroupingItems />
        <ManipulationItems />
        <TransformItems />
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CanvasContextMenu;
