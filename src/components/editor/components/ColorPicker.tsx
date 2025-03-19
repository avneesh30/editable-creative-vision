
import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disableAlpha?: boolean;
  showInputs?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color = '#000000',
  onChange,
  disableAlpha = false,
  showInputs = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);

  // Sync currentColor when color prop changes
  useEffect(() => {
    setCurrentColor(color || '#000000');
  }, [color]);

  // Handle real-time color changes - send updates immediately
  const handleColorChange = (colorObj: any) => {
    const newColor = colorObj.hex;

    // Update internal state immediately
    setCurrentColor(newColor);

    // Call onChange immediately for real-time updates
    onChange(newColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-10 h-10 rounded border border-input overflow-hidden"
          style={{ background: currentColor }}
          aria-label="Pick a color"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-lg" align="start">
        <ChromePicker
          color={currentColor}
          onChange={handleColorChange}
          disableAlpha={disableAlpha}
          styles={{
            default: {
              picker: {
                boxShadow: 'none',
                borderRadius: '0',
                width: '225px'
              }
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
