import { fabric } from 'fabric';
export type EditorMode = 'select' | 'draw' | 'text' | 'image' | 'shape';
export interface CanvasSize {
    width: number;
    height: number;
}
export interface DesignTemplate {
    id: string;
    name: string;
    category: string;
    size: CanvasSize;
    json?: string;
    thumbnail?: string;
}
export interface PsdTemplate {
    id: string;
    name: string;
    thumbnailUrl: string;
    demoUrl: string;
    size: {
        width: number;
        height: number;
    };
    category: string;
    jsonPath?: string;
    photographer?: string;
    photographerUrl?: string;
    pexelsUrl?: string;
}
export interface UserTemplate {
    id: string;
    name: string;
    thumbnailUrl: string;
    size: {
        width: number;
        height: number;
    };
    category: string;
    canvasJson: string;
    dateCreated: string;
}
export interface ElementOptions {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: string;
    fontWeight?: string;
    fontStyle?: "" | "normal" | "italic" | "oblique";
    lineHeight?: number;
    charSpacing?: number;
    width?: number;
    height?: number;
    radius?: number;
    rx?: number;
    ry?: number;
    src?: string;
    [key: string]: any;
}
export interface EditorContextType {
    canvas: fabric.Canvas | null;
    activeObject: fabric.Object | null;
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;
    canvasSize: CanvasSize;
    setCanvasSize: (size: CanvasSize) => void;
    canvasBackgroundColor: string;
    setCanvasBackgroundColor: (color: string) => void;
    initCanvas: (canvasElement: HTMLCanvasElement) => fabric.Canvas | undefined;
    addText: (text: string, options?: ElementOptions) => void;
    addRect: (options?: ElementOptions) => void;
    addCircle: (options?: ElementOptions) => void;
    addImage: (url: string, options?: ElementOptions) => void;
    addTriangle: (options?: ElementOptions) => void;
    removeActiveObject: () => void;
    bringForward: () => void;
    sendBackward: () => void;
    bringToFront: () => void;
    sendToBack: () => void;
    groupSelected: () => void;
    ungroupSelected: () => void;
    cloneSelected: () => void;
    saveToJSON: () => string;
    loadFromJSON: (json: string) => void;
    exportToImage: (format: 'png' | 'jpeg' | 'svg', quality?: 'normal' | 'high') => Promise<string>;
    exportToHTML: () => string;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    undo: () => void;
    redo: () => void;
    downloadImage: (format: 'png' | 'jpeg' | 'svg', quality?: 'normal' | 'high') => void;
    copyToClipboard: () => void;
    pasteFromClipboard: () => void;
    pasteAtPosition: (x: number, y: number) => void;
    setCursor: (cursor: string) => void;
    zoom: number;
    createBusinessCardTemplate: () => void;
    selectAll: () => void;
    clearCanvas: () => void;
    saveToHistory: (canvas: fabric.Canvas | null) => void;
    canUndo?: boolean;
    canRedo?: boolean;
    addShape: (shapeType: string, options?: any) => void;
    enablePan: () => void;
    disablePan: () => void;
    isPanEnabled: boolean;
}
export interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}
export interface PropertyPanelProps {
    collapsed: boolean;
    onToggle: () => void;
}
export interface ToolbarProps {
    onExport: (format: 'png' | 'jpeg' | 'svg' | 'html') => void;
    onSave: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;
    zoom: number;
    onSelectAll?: () => void;
    onClearCanvas?: () => void;
    onResizeCanvas?: () => void;
}
export interface CanvasElementProps {
    onObjectSelect: (e: fabric.IEvent) => void;
    onObjectModified: (e: fabric.IEvent) => void;
    onSelectionCleared: () => void;
}
export interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}
export interface ElementPropertiesProps {
    activeObject: fabric.Object | null;
}
export interface TemplateGalleryProps {
    templates: DesignTemplate[];
    onSelect: (template: DesignTemplate) => void;
}
export interface ImageGalleryProps {
    onSelect: (imageUrl: string) => void;
}
export interface ShapeGalleryProps {
    onSelect: (shapeType: string) => void;
}
export interface TextStylesProps {
    onApply: (styles: ElementOptions) => void;
}
export interface ElementListProps {
    canvas: fabric.Canvas | null;
    onSelect: (obj: fabric.Object) => void;
}
export interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageDataUrl: string | null;
}
export interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: 'png' | 'jpeg' | 'svg' | 'html') => void;
}
export interface ResizeCanvasDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentSize: CanvasSize;
    onResize: (size: CanvasSize) => void;
}
export interface HistoryManager {
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    save: () => void;
    clear: () => void;
}
