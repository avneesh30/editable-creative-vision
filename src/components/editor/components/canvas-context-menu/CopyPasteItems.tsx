
import React from 'react';
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '../../../../components/ui/context-menu';
import { Copy, ClipboardPaste, ArrowRightLeft } from 'lucide-react';
import { useEditor } from '../../context';

const CopyPasteItems = () => {
  const { copyToClipboard, pasteFromClipboard, pasteAtPosition, activeObject, canvas } = useEditor();

  const handlePasteHere = (e: React.MouseEvent) => {
    if (!canvas) return;

    const pointer = canvas.getPointer(e.nativeEvent as unknown as Event);
    pasteAtPosition(pointer.x, pointer.y);
  };

  return (
    <>
      <ContextMenuItem onClick={() => copyToClipboard()}>
        <Copy className="mr-2 h-4 w-4" />
        Copy
        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuItem onClick={handlePasteHere}>
        <ClipboardPaste className="mr-2 h-4 w-4" />
        Paste here
      </ContextMenuItem>

      <ContextMenuItem disabled={!activeObject} onClick={() => {
        if (activeObject) pasteFromClipboard();
      }}>
        <ArrowRightLeft className="mr-2 h-4 w-4" />
        Paste to replace
        <ContextMenuShortcut>⌘⇧R</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuSeparator />
    </>
  );
};

export default CopyPasteItems;
