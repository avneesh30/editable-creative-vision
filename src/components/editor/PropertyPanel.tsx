
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Layers, Settings, Move, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Slider, SmoothSlider } from '../../components/ui/slider';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';
import { useEditor } from './context';
import { PropertyPanelProps } from './types';
import ColorPicker from './components/ColorPicker';
import { toast } from 'sonner';
import { Separator } from '../../components/ui/separator';
import debounce from 'lodash.debounce';

const PropertyPanel: React.FC<PropertyPanelProps> = ({ collapsed, onToggle }) => {
  const {
    activeObject,
    removeActiveObject,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    canvas
  } = useEditor();

  const [activeTab, setActiveTab] = useState('style');
  const [properties, setProperties] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!activeObject) {
      setProperties({});
      return;
    }

    try {
      // Extract properties from the active object
      const props: Record<string, any> = {};

      // Common properties
      props.type = activeObject.type;
      props.left = Math.round(activeObject.left || 0);
      props.top = Math.round(activeObject.top || 0);
      props.width = Math.round(activeObject.width || 0);
      props.height = Math.round(activeObject.height || 0);
      props.angle = activeObject.angle || 0;
      props.opacity = activeObject.opacity || 1;

      // Handle fill color with fallback
      const objectFill = activeObject.fill || '#000000';
      props.fill = objectFill;

      // Type-specific properties
      if (activeObject.type === 'textbox' || activeObject.type === 'text' || activeObject.type === 'i-text') {
        // Fix: Cast to any to access text-specific properties
        const textObj = activeObject as any;
        props.text = textObj.text || '';
        props.fontSize = textObj.fontSize || 20;
        props.fontFamily = textObj.fontFamily || 'Arial';
        props.fontWeight = textObj.fontWeight || 'normal';
        props.fontStyle = textObj.fontStyle || 'normal';
        props.textAlign = textObj.textAlign || 'left';
        props.charSpacing = textObj.charSpacing || 0;
        props.lineHeight = textObj.lineHeight || 1.16;
      } else if (activeObject.type === 'image') {
        // Cast to any to access image-specific properties
        const imgObj = activeObject as any;
        props.src = imgObj.src || '';
      } else if (activeObject.type === 'rect' || activeObject.type === 'circle' || activeObject.type === 'triangle') {
        props.stroke = activeObject.stroke || '';
        props.strokeWidth = activeObject.strokeWidth || 0;
      }

      setProperties(props);
    } catch (error) {
      console.error('Error getting object properties:', error);
    }
  }, [activeObject]);

  // Create a memo-ized debounced update function to avoid recreating it on each render
  const debouncedUpdateCanvas = useMemo(() =>
    debounce((obj: any, canvas: any) => {
      if (!obj || !canvas) return;
      canvas.renderAll();
      canvas.fire('object:modified', { target: obj });
    }, 50),
    []
  );

  const updateObjectProperty = (property: string, value: any) => {
    if (!activeObject || !canvas) return;

    try {
      // Immediately update local state for responsive UI feel
      setProperties(prev => ({ ...prev, [property]: value }));

      // Immediately update the object property for real-time feedback
      if (property in activeObject) {
        (activeObject as any)[property] = value;
      }

      // Special handling for fill color
      if (property === 'fill') {
        activeObject.set('fill', value);
      }

      // Render changes immediately to see the effect
      canvas.requestRenderAll();

      // Debounce the final update and history recording
      debouncedUpdateCanvas(activeObject, canvas);

    } catch (error) {
      console.error(`Error updating property ${property}:`, error);
      toast.error('Failed to update property. Please try again.');
    }
  };

  const PropertyGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <Separator className="flex-1 mx-2" />
      </div>
      <div className="space-y-3 pl-0.5">
        {children}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "editor-properties panel-transition bg-white/95 shadow-md dark:bg-gray-800/95",
        collapsed ? "collapsed" : ""
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/40">
        <h3 className="font-medium text-base text-foreground flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          Properties
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 rounded-full hover:bg-secondary"
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {!activeObject ? (
        <div className="p-8 text-center flex flex-col items-center justify-center h-[200px] text-muted-foreground space-y-2">
          <Settings className="h-12 w-12 text-muted-foreground/30" />
          <p>Select an element to edit its properties</p>
        </div>
      ) : (
        <Tabs
          defaultValue="style"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3 p-1 bg-secondary/40 border-b border-border">
            <TabsTrigger value="style" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4 mr-1" />
              <span>Style</span>
            </TabsTrigger>
            <TabsTrigger value="position" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Move className="h-4 w-4 mr-1" />
              <span>Position</span>
            </TabsTrigger>
            <TabsTrigger value="arrange" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Layers className="h-4 w-4 mr-1" />
              <span>Arrange</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-180px)] overflow-y-auto">
            <TabsContent value="style" className="p-5 space-y-6 focus:outline-none">
              {/* Element Type Indicator */}
              <div className="flex items-center justify-center mb-4">
                <span className="px-3 py-1 bg-secondary/60 text-xs font-medium rounded-full text-muted-foreground capitalize">
                  {properties.type || 'Unknown'} Element
                </span>
              </div>

              {/* Common style properties */}
              <PropertyGroup title="Appearance">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-medium">Fill Color</Label>
                    <ColorPicker
                      color={properties.fill || '#000000'}
                      onChange={(color) => {
                        updateObjectProperty('fill', color);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs text-muted-foreground font-medium">Opacity</Label>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((properties.opacity || 1) * 100)}%
                      </span>
                    </div>
                    <SmoothSlider
                      value={[(properties.opacity || 1) * 100]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateObjectProperty('opacity', value[0] / 100)}
                      className="my-1"
                    />
                  </div>
                </div>
              </PropertyGroup>

              {/* Text-specific properties */}
              {(properties.type === 'textbox' || properties.type === 'text' || properties.type === 'i-text') && (
                <PropertyGroup title="Typography">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs text-muted-foreground font-medium">Font Size</Label>
                        <span className="text-xs text-muted-foreground">
                          {properties.fontSize || 20}px
                        </span>
                      </div>
                      <SmoothSlider
                        value={[properties.fontSize || 20]}
                        min={8}
                        max={72}
                        step={1}
                        onValueChange={(value) => updateObjectProperty('fontSize', value[0])}
                        className="my-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-medium">Font Family</Label>
                      <select
                        className="w-full p-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-ring focus:outline-none"
                        value={properties.fontFamily || 'Arial'}
                        onChange={(e) => updateObjectProperty('fontFamily', e.target.value)}
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={properties.fontWeight === 'bold' ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newWeight = properties.fontWeight === 'bold' ? 'normal' : 'bold';
                          updateObjectProperty('fontWeight', newWeight);
                        }}
                        className="h-8"
                      >
                        Bold
                      </Button>
                      <Button
                        variant={properties.fontStyle === 'italic' ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newStyle = properties.fontStyle === 'italic' ? 'normal' : 'italic';
                          updateObjectProperty('fontStyle', newStyle);
                        }}
                        className="h-8"
                      >
                        Italic
                      </Button>
                      <Button
                        variant={properties.underline ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const newUnderline = !properties.underline;
                          updateObjectProperty('underline', newUnderline);
                        }}
                        className="h-8"
                      >
                        Underline
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-medium">Text Align</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {['left', 'center', 'right', 'justify'].map((align) => (
                          <Button
                            key={align}
                            variant={properties.textAlign === align ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateObjectProperty('textAlign', align)}
                            className="h-8 px-0 text-xs"
                          >
                            {align.charAt(0).toUpperCase() + align.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PropertyGroup>
              )}

              {/* Shape-specific properties */}
              {(properties.type === 'rect' || properties.type === 'circle' || properties.type === 'triangle') && (
                <PropertyGroup title="Stroke">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-medium">Stroke Color</Label>
                      <ColorPicker
                        color={properties.stroke || '#000000'}
                        onChange={(color) => {
                          updateObjectProperty('stroke', color);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-xs text-muted-foreground font-medium">Stroke Width</Label>
                        <span className="text-xs text-muted-foreground">
                          {properties.strokeWidth || 0}px
                        </span>
                      </div>
                      <SmoothSlider
                        value={[properties.strokeWidth || 0]}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={(value: any) => updateObjectProperty('strokeWidth', value[0])}
                        className="my-1"
                      />
                    </div>
                  </div>
                </PropertyGroup>
              )}
            </TabsContent>

            <TabsContent value="position" className="p-5 space-y-6 focus:outline-none">
              <PropertyGroup title="Position & Size">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-medium">X Position</Label>
                    <div className="flex">
                      <input
                        type="number"
                        className="w-full p-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-ring focus:outline-none"
                        value={properties.left || 0}
                        onChange={(e) => updateObjectProperty('left', Number(e.target.value))}
                      />
                      <span className="ml-2 self-center text-xs text-muted-foreground">px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-medium">Y Position</Label>
                    <div className="flex">
                      <input
                        type="number"
                        className="w-full p-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-ring focus:outline-none"
                        value={properties.top || 0}
                        onChange={(e) => updateObjectProperty('top', Number(e.target.value))}
                      />
                      <span className="ml-2 self-center text-xs text-muted-foreground">px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-medium">Width</Label>
                    <div className="flex">
                      <input
                        type="number"
                        className="w-full p-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-ring focus:outline-none"
                        value={properties.width || 0}
                        onChange={(e) => updateObjectProperty('width', Number(e.target.value))}
                      />
                      <span className="ml-2 self-center text-xs text-muted-foreground">px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-medium">Height</Label>
                    <div className="flex">
                      <input
                        type="number"
                        className="w-full p-2 text-sm border border-input rounded-md bg-background focus:ring-1 focus:ring-ring focus:outline-none"
                        value={properties.height || 0}
                        onChange={(e) => updateObjectProperty('height', Number(e.target.value))}
                      />
                      <span className="ml-2 self-center text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                </div>
              </PropertyGroup>

              <PropertyGroup title="Rotation">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground font-medium">Angle</Label>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(properties.angle || 0)}°
                    </span>
                  </div>
                  <SmoothSlider
                    value={[properties.angle || 0]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(value: any) => updateObjectProperty('angle', value[0])}
                    className="my-1"
                  />
                  <div className="flex justify-between gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => updateObjectProperty('angle', 0)}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => updateObjectProperty('angle', ((properties.angle || 0) + 90) % 360)}
                    >
                      +90°
                    </Button>
                  </div>
                </div>
              </PropertyGroup>
            </TabsContent>

            <TabsContent value="arrange" className="p-5 space-y-6 focus:outline-none">
              <PropertyGroup title="Layer Position">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={bringForward}
                    className="h-9 text-xs"
                  >
                    <Layers className="h-3.5 w-3.5 mr-1" />
                    Bring Forward
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendBackward}
                    className="h-9 text-xs"
                  >
                    <Layers className="h-3.5 w-3.5 mr-1 transform rotate-180" />
                    Send Backward
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={bringToFront}
                    className="h-9 text-xs"
                  >
                    <Layers className="h-3.5 w-3.5 mr-1" />
                    Bring to Front
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendToBack}
                    className="h-9 text-xs"
                  >
                    <Layers className="h-3.5 w-3.5 mr-1 transform rotate-180" />
                    Send to Back
                  </Button>
                </div>
              </PropertyGroup>

              <div className="pt-6 border-t border-border">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full h-9"
                  onClick={removeActiveObject}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Element
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </div>
  );
};

export default PropertyPanel;
