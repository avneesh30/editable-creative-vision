
import React, { useState } from 'react';
import { useEditor } from '../context';
import { Button } from '../../../components/ui/button';
import { SmoothSlider } from '../../../components/ui/slider';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { Move, Palette, Maximize, RotateCcw, ZoomIn, ZoomOut, Undo } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { toast } from 'sonner';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

const CanvasSettings: React.FC = () => {
  const {
    canvasBackgroundColor,
    setCanvasBackgroundColor,
    enablePan,
    disablePan,
    isPanEnabled,
    mode,
    setMode,
    canvasSize,
    setCanvasSize,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom
  } = useEditor();

  const [activeTab, setActiveTab] = useState<string>('background');

  const handlePanToggle = (checked: boolean) => {
    if (checked) {
      enablePan();
      toast.info("Pan mode enabled. Click and drag to move around the canvas.");
    } else {
      disablePan();
      toast.info("Pan mode disabled. You can now select and edit objects again.");
    }
  };

  // Extended color palette with more options including neutrals and gradients
  const predefinedColors = [
    '#ffffff', // White
    '#f8f9fa', // Light gray
    '#e9ecef', // Lighter gray
    '#f2fcE2', // Soft green
    '#fef7cd', // Soft yellow
    '#fec6a1', // Soft orange
    '#e5deff', // Soft purple
    '#ffdee2', // Soft pink
    '#fde1d3', // Soft peach
    '#d3e4fd', // Soft blue
    '#f3f4f6', // Off white
    '#e5e7eb', // Light gray
    '#d1d5db', // Medium gray
    '#f0fff4', // Mint
    '#fffbeb', // Cream
    '#fff1f2', // Light pink
    '#f0f9ff', // Light blue
    '#faf5ff', // Lavender
    '#ecfdf5', // Teal tint
    '#fffbeb', // Warm yellow
  ];

  // Expanded predefined sizes with more common options
  const predefinedSizes = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'Pinterest Pin', width: 1000, height: 1500 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Business Card', width: 1050, height: 600 },
    { name: 'HD (720p)', width: 1280, height: 720 },
    { name: 'Full HD (1080p)', width: 1920, height: 1080 },
    { name: 'A4 Document', width: 2480, height: 3508 },
    { name: 'Letter Document', width: 2550, height: 3300 },
    { name: 'Email Header', width: 600, height: 200 },
    { name: 'Website Banner', width: 1200, height: 300 },
    { name: 'Medium.com Article', width: 800, height: 600 },
  ];

  const handleWidthChange = (value: number) => {
    setCanvasSize({ width: value, height: canvasSize.height });
  };

  const handleHeightChange = (value: number) => {
    setCanvasSize({ width: canvasSize.width, height: value });
  };

  const handlePredefinedSizeSelect = (width: number, height: number) => {
    setCanvasSize({ width, height });
    toast.success(`Canvas size updated to ${width}x${height}px`);
  };

  const resetToDefaultBackgroundColor = () => {
    setCanvasBackgroundColor('#ffffff');
    toast.success('Canvas background color reset to default (white)');
  };

  // Format zoom level as percentage
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Canvas Settings</CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="background" className="w-full">
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="background" className="text-xs">Background</TabsTrigger>
          <TabsTrigger value="size" className="text-xs">Size</TabsTrigger>
          <TabsTrigger value="navigation" className="text-xs">Navigation</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[360px]">
          <CardContent className="pt-0">
            <TabsContent value="background" className="mt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <Label htmlFor="background-color">Background Color</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      title="Reset to default (white)"
                      onClick={resetToDefaultBackgroundColor}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <ColorPicker
                      color={canvasBackgroundColor}
                      onChange={(color) => setCanvasBackgroundColor(color)}
                      disableAlpha={false}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 mt-2">
                  {predefinedColors.slice(0, 10).map((color, index) => (
                    <div
                      key={index}
                      className="w-full h-8 rounded cursor-pointer border border-input"
                      style={{ backgroundColor: color }}
                      onClick={() => setCanvasBackgroundColor(color)}
                      title={color}
                    />
                  ))}
                </div>

                <Separator className="my-2" />
                <Label className="text-xs text-muted-foreground">More Color Options</Label>

                <div className="grid grid-cols-5 gap-2 mt-2">
                  {predefinedColors.slice(10).map((color, index) => (
                    <div
                      key={index + 10}
                      className="w-full h-8 rounded cursor-pointer border border-input"
                      style={{ backgroundColor: color }}
                      onClick={() => setCanvasBackgroundColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="size" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Width</Label>
                    <span className="text-sm text-muted-foreground">{canvasSize.width}px</span>
                  </div>
                  <SmoothSlider
                    value={[canvasSize.width]}
                    min={50}
                    max={3000}
                    step={10}
                    onValueChange={(values) => handleWidthChange(values[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Height</Label>
                    <span className="text-sm text-muted-foreground">{canvasSize.height}px</span>
                  </div>
                  <SmoothSlider
                    value={[canvasSize.height]}
                    min={50}
                    max={3000}
                    step={10}
                    onValueChange={(values) => handleHeightChange(values[0])}
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label className="text-sm">Common Sizes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedSizes.slice(0, 8).map((size, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto py-2 justify-start flex-col items-start text-xs text-left"
                        onClick={() => handlePredefinedSizeSelect(size.width, size.height)}
                      >
                        <span className="font-medium">{size.name}</span>
                        <span className="text-muted-foreground text-[10px]">{size.width} × {size.height}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label className="text-sm">More Size Options</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedSizes.slice(8).map((size, index) => (
                      <Button
                        key={index + 8}
                        variant="outline"
                        size="sm"
                        className="h-auto py-2 justify-start flex-col items-start text-xs text-left"
                        onClick={() => handlePredefinedSizeSelect(size.width, size.height)}
                      >
                        <span className="font-medium">{size.name}</span>
                        <span className="text-muted-foreground text-[10px]">{size.width} × {size.height}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="navigation" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Move className="h-4 w-4" />
                      <Label htmlFor="enable-pan">Enable Pan Mode</Label>
                    </div>
                    <Switch
                      id="enable-pan"
                      checked={isPanEnabled}
                      onCheckedChange={handlePanToggle}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, you can click and drag to move around the canvas. Objects cannot be selected in this mode.
                  </p>
                </div>

                <Separator className="my-2" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Maximize className="h-4 w-4" />
                      <Label>Zoom Level</Label>
                    </div>
                    <span className="text-sm font-medium">{zoomPercentage}%</span>
                  </div>

                  <SmoothSlider
                    value={[zoom * 100]}
                    min={10}
                    max={200}
                    step={5}
                    onValueChange={(values) => {
                      // We'll use the existing zoom functions which handle the zoom properly
                      const currentZoom = zoom * 100;
                      const targetZoom = values[0];

                      if (targetZoom > currentZoom) {
                        // Need to zoom in
                        for (let i = currentZoom; i < targetZoom; i += 10) {
                          zoomIn();
                        }
                      } else if (targetZoom < currentZoom) {
                        // Need to zoom out
                        for (let i = currentZoom; i > targetZoom; i -= 10) {
                          zoomOut();
                        }
                      }
                    }}
                  />

                  <div className="flex justify-between gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={zoomOut}
                    >
                      <ZoomOut className="h-3.5 w-3.5 mr-1" />
                      Zoom Out
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={resetZoom}
                    >
                      <Undo className="h-3.5 w-3.5 mr-1" />
                      Reset (100%)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={zoomIn}
                    >
                      <ZoomIn className="h-3.5 w-3.5 mr-1" />
                      Zoom In
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
};

export default CanvasSettings;
