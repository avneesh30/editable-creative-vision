import React from 'react';
interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    disableAlpha?: boolean;
    showInputs?: boolean;
}
declare const ColorPicker: React.FC<ColorPickerProps>;
export default ColorPicker;
