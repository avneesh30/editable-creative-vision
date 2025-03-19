import React from 'react';
import { useEditor } from './context';
import { Button } from '../../components/ui/button';
import { Tooltip } from '../../components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import {
  Save,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  PanelLeft,
  PanelRight,
  Type,
  Square,
  Circle,
  Image,
  Pencil,
  MousePointer,
  Trash,
  Copy,
  CheckSquare,
  X,
  Move3d
} from 'lucide-react';
// import { cn } from '../../lib/utils';
import { ToolbarProps } from './types';

const Toolbar: React.FC<ToolbarProps> = ({
  onExport,
  onSave,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  toggleLeftSidebar,
  toggleRightSidebar,
  zoom,
  onSelectAll,
  onClearCanvas,
  onResizeCanvas
}) => {
  const {
    mode,
    setMode,
    addText,
    addRect,
    addCircle,
    removeActiveObject,
    selectAll,
    clearCanvas,
    canvas
  } = useEditor();

  const handleAddText = () => {
    setMode('text');
    addText('New text');
  };

  const handleAddRect = () => {
    setMode('shape');
    addRect();
  };

  const handleAddCircle = () => {
    setMode('shape');
    addCircle();
  };

  return (
    <div className="editor-toolbar">
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLeftSidebar}
                className="h-9 w-9"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Sidebar</TooltipContent>
          </Tooltip>

          <div className="bg-secondary h-6 w-px mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'select' ? "default" : "ghost"}
                size="icon"
                onClick={() => setMode('select')}
                className="h-9 w-9"
              >
                <MousePointer className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select (V)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'text' ? "default" : "ghost"}
                size="icon"
                onClick={handleAddText}
                className="h-9 w-9"
              >
                <Type className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Text (T)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'shape' ? "default" : "ghost"}
                size="icon"
                onClick={handleAddRect}
                className="h-9 w-9"
              >
                <Square className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Rectangle (R)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'shape' ? "default" : "ghost"}
                size="icon"
                onClick={handleAddCircle}
                className="h-9 w-9"
              >
                <Circle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Circle (C)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'image' ? "default" : "ghost"}
                size="icon"
                onClick={() => setMode('image')}
                className="h-9 w-9"
              >
                <Image className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Image (I)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={mode === 'draw' ? "default" : "ghost"}
                size="icon"
                onClick={() => setMode('draw')}
                className="h-9 w-9"
              >
                <Pencil className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Draw (D)</TooltipContent>
          </Tooltip>

          <div className="bg-secondary h-6 w-px mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => selectAll()}
                className="h-9 w-9"
              >
                <CheckSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select All (Ctrl+A)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => clearCanvas()}
                className="h-9 w-9"
              >
                <X className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Canvas (Shift+Esc)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onResizeCanvas}
                className="h-9 w-9"
              >
                <Move3d className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Resize Canvas</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2 ml-auto mr-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                className="h-9 w-9"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out (-)</TooltipContent>
          </Tooltip>

          <div className="text-sm font-medium w-16 text-center">
            {Math.round(zoom * 100)}%
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                className="h-9 w-9"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In (+)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onResetZoom}
                className="h-9 w-9"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Zoom (0)</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e: any) => {
                  e.preventDefault();
                  console.log('Undo button clicked');
                  onUndo();
                }}
                className="h-9 w-9"
              >
                <Undo className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e: any) => {
                  e.preventDefault();
                  console.log('Redo button clicked');
                  onRedo();
                }}
                className="h-9 w-9"
              >
                <Redo className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>

          <div className="bg-secondary h-6 w-px mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeActiveObject}
                className="h-9 w-9"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete (Del)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy (Ctrl+C)</TooltipContent>
          </Tooltip>

          <div className="bg-secondary h-6 w-px mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSave}
                className="h-9 w-9"
              >
                <Save className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save (Ctrl+S)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onExport('png')}
                className="h-9 w-9"
              >
                <Download className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export</TooltipContent>
          </Tooltip>

          <div className="bg-secondary h-6 w-px mx-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRightSidebar}
                className="h-9 w-9"
              >
                <PanelRight className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Properties</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;
