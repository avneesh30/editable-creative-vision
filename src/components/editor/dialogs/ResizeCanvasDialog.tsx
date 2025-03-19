
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { SmoothSlider } from '../../../components/ui/slider';
import { ResizeCanvasDialogProps, CanvasSize } from '../types';
import { Lock, Unlock } from 'lucide-react';

const ResizeCanvasDialog: React.FC<ResizeCanvasDialogProps> = ({
  isOpen,
  onClose,
  currentSize,
  onResize
}) => {
  const [width, setWidth] = useState<number>(currentSize.width);
  const [height, setHeight] = useState<number>(currentSize.height);
  const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(false);
  const [originalRatio, setOriginalRatio] = useState<number>(currentSize.width / currentSize.height);
  const [widthPercent, setWidthPercent] = useState<number>(100);
  const [heightPercent, setHeightPercent] = useState<number>(100);

  // Update dimensions when current size changes
  useEffect(() => {
    if (isOpen) {
      setWidth(currentSize.width);
      setHeight(currentSize.height);
      setOriginalRatio(currentSize.width / currentSize.height);
      setWidthPercent(100);
      setHeightPercent(100);
    }
  }, [isOpen, currentSize]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 1;
    setWidth(newWidth);
    setWidthPercent(Math.round((newWidth / currentSize.width) * 100));

    if (aspectRatioLocked) {
      const newHeight = Math.round(newWidth / originalRatio);
      setHeight(newHeight);
      setHeightPercent(Math.round((newHeight / currentSize.height) * 100));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 1;
    setHeight(newHeight);
    setHeightPercent(Math.round((newHeight / currentSize.height) * 100));

    if (aspectRatioLocked) {
      const newWidth = Math.round(newHeight * originalRatio);
      setWidth(newWidth);
      setWidthPercent(Math.round((newWidth / currentSize.width) * 100));
    }
  };

  const handleWidthPercentChange = (value: number[]) => {
    const percent = value[0];
    setWidthPercent(percent);
    const newWidth = Math.round((currentSize.width * percent) / 100);
    setWidth(newWidth);

    if (aspectRatioLocked) {
      const newHeight = Math.round(newWidth / originalRatio);
      setHeight(newHeight);
      setHeightPercent(Math.round((newHeight / currentSize.height) * 100));
    }
  };

  const handleHeightPercentChange = (value: number[]) => {
    const percent = value[0];
    setHeightPercent(percent);
    const newHeight = Math.round((currentSize.height * percent) / 100);
    setHeight(newHeight);

    if (aspectRatioLocked) {
      const newWidth = Math.round(newHeight * originalRatio);
      setWidth(newWidth);
      setWidthPercent(Math.round((newWidth / currentSize.width) * 100));
    }
  };

  const handleResizeClick = () => {
    onResize({ width, height });
    onClose();
  };

  const presetSizes = [
    { name: "Business Card", width: 850, height: 500 },
    { name: "Instagram Post", width: 1080, height: 1080 },
    { name: "A4 Document", width: 1000, height: 1414 },
    { name: "Twitter Post", width: 1000, height: 500 },
    { name: "Facebook Cover", width: 1080, height: 608 },
    { name: "YouTube Thumbnail", width: 1280, height: 720 },
    { name: "LinkedIn Banner", width: 1128, height: 191 },
    { name: "Pinterest Pin", width: 1000, height: 1500 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resize Canvas</DialogTitle>
          <DialogDescription>
            Adjust the dimensions of your canvas. Current size: {currentSize.width} × {currentSize.height}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="width">Width (px)</Label>
                <span className="text-xs text-muted-foreground">{widthPercent}%</span>
              </div>
              <Input
                id="width"
                type="number"
                min="1"
                value={width}
                onChange={handleWidthChange}
              />
              <SmoothSlider
                defaultValue={[100]}
                value={[widthPercent]}
                onValueChange={handleWidthPercentChange}
                max={200}
                min={10}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="height">Height (px)</Label>
                <span className="text-xs text-muted-foreground">{heightPercent}%</span>
              </div>
              <Input
                id="height"
                type="number"
                min="1"
                value={height}
                onChange={handleHeightChange}
              />
              <SmoothSlider
                defaultValue={[100]}
                value={[heightPercent]}
                onValueChange={handleHeightPercentChange}
                max={200}
                min={10}
                step={1}
              />
            </div>
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
          >
            {aspectRatioLocked ? (
              <>
                <Lock className="h-4 w-4" />
                <span>Unlock aspect ratio</span>
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                <span>Lock aspect ratio</span>
              </>
            )}
          </Button>

          <div className="mt-2">
            <Label className="mb-2 block">Preset Sizes</Label>
            <div className="grid grid-cols-2 gap-2">
              {presetSizes.map((size, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setWidth(size.width);
                    setHeight(size.height);
                    setOriginalRatio(size.width / size.height);
                    setWidthPercent(Math.round((size.width / currentSize.width) * 100));
                    setHeightPercent(Math.round((size.height / currentSize.height) * 100));
                  }}
                >
                  <span className="truncate">{size.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{size.width}×{size.height}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleResizeClick}>Resize</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResizeCanvasDialog;
