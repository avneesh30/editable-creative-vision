import React, { useState, useEffect } from 'react';
import { useEditor } from './context';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Minus,
  Plus,
  Strikethrough
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import ColorPicker from './components/ColorPicker';

// Expanded list of font options
const fontOptions = [
  // Basic Fonts
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },

  // Google Fonts - Sans Serif
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Source Sans 3', label: 'Source Sans' },
  { value: 'Roboto Condensed', label: 'Roboto Condensed' },
  { value: 'PT Sans', label: 'PT Sans' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Work Sans', label: 'Work Sans' },
  { value: 'Fira Sans', label: 'Fira Sans' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Mulish', label: 'Mulish' },
  { value: 'Ubuntu', label: 'Ubuntu' },
  { value: 'Comfortaa', label: 'Comfortaa' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
  { value: 'Arimo', label: 'Arimo' },
  { value: 'Cabin', label: 'Cabin' },
  { value: 'Exo 2', label: 'Exo 2' },
  { value: 'PT Sans Narrow', label: 'PT Sans Narrow' },
  { value: 'Overpass', label: 'Overpass' },
  { value: 'Nanum Gothic', label: 'Nanum Gothic' },
  { value: 'Libre Franklin', label: 'Libre Franklin' },
  { value: 'Encode Sans', label: 'Encode Sans' },
  { value: 'Dosis', label: 'Dosis' },
  { value: 'Alegreya Sans', label: 'Alegreya Sans' },

  // Google Fonts - Serif
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Lora', label: 'Lora' },
  { value: 'PT Serif', label: 'PT Serif' },
  { value: 'Roboto Slab', label: 'Roboto Slab' },
  { value: 'Crimson Text', label: 'Crimson Text' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville' },
  { value: 'Source Serif Pro', label: 'Source Serif Pro' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Bitter', label: 'Bitter' },
  { value: 'Arvo', label: 'Arvo' },
  { value: 'Spectral', label: 'Spectral' },
  { value: 'Alegreya', label: 'Alegreya' },
  { value: 'Josefin Slab', label: 'Josefin Slab' },

  // Google Fonts - Display/Script
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Abril Fatface', label: 'Abril Fatface' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Lobster', label: 'Lobster' },
  { value: 'Amatic SC', label: 'Amatic SC' },
  { value: 'Sacramento', label: 'Sacramento' },

  // Google Fonts - Monospace
  { value: 'Roboto Mono', label: 'Roboto Mono' },
  { value: 'Source Code Pro', label: 'Source Code Pro' },
  { value: 'Inconsolata', label: 'Inconsolata' },
  { value: 'Ubuntu Mono', label: 'Ubuntu Mono' },
  { value: 'Space Mono', label: 'Space Mono' }
];

// Helper function to ensure text properties are valid
const ensureValidTextProperties = (textObj: any) => {
  // Check and fix fontFamily
  if (!textObj.fontFamily) {
    textObj.fontFamily = 'Arial';
    console.log('Fixed missing fontFamily in toolbar');
  }

  // Check and fix fontSize
  if (!textObj.fontSize) {
    textObj.fontSize = 20;
    console.log('Fixed missing fontSize in toolbar');
  }

  // Check and fix fontStyle
  if (!textObj.fontStyle || !['', 'normal', 'italic', 'oblique'].includes(textObj.fontStyle)) {
    textObj.fontStyle = 'normal';
    console.log('Fixed invalid fontStyle in toolbar');
  }

  // Check and fix fontWeight
  if (textObj.fontWeight === undefined || textObj.fontWeight === null) {
    textObj.fontWeight = 'normal';
    console.log('Fixed missing fontWeight in toolbar');
  }

  // Check and fix textAlign
  if (textObj.textAlign === undefined || textObj.textAlign === null) {
    textObj.textAlign = 'left';
    console.log('Fixed missing textAlign in toolbar');
  }

  return textObj;
};

const TextEditorToolbar = () => {
  const { activeObject, canvas } = useEditor();
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [textAlign, setTextAlign] = useState<string>('left');
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>('#000000');

  // Check if the active object is a text object
  const isTextObject = activeObject &&
    (activeObject.type === 'text' || activeObject.type === 'textbox' || activeObject.type === 'i-text');

  // Update the toolbar state based on the selected text object
  useEffect(() => {
    if (!activeObject || !isTextObject) return;

    // Type assertion to access text properties
    const textObj = activeObject as any;

    // Ensure text object has valid properties before attempting to read them
    ensureValidTextProperties(textObj);

    // Now it's safe to read and set these properties
    setFontSize(textObj.fontSize || 20);
    setFontFamily(textObj.fontFamily || 'Arial');
    setTextAlign(textObj.textAlign || 'left');
    setIsBold(textObj.fontWeight === 'bold');
    setIsItalic(textObj.fontStyle === 'italic');
    setIsUnderline(!!textObj.underline);
    setTextColor(textObj.fill || '#000000');

  }, [activeObject, isTextObject]);

  const updateTextProperty = (property: string, value: any) => {
    if (!canvas || !activeObject || !isTextObject) return;

    // Ensure fontFamily is never undefined
    if (property === 'fontFamily' && !value) {
      value = 'Arial';
    }

    // Ensure fontStyle is one of the valid values
    if (property === 'fontStyle' && !['', 'normal', 'italic', 'oblique'].includes(value)) {
      value = 'normal';
    }

    // Special handling for textAlign to ensure it works correctly
    if (property === 'textAlign') {
      // Log before update to debug
      console.log(`Setting textAlign from ${(activeObject as any).textAlign} to ${value}`);
    }

    // Update the object property
    (activeObject as any)[property] = value;

    // Log to verify property was set
    console.log(`Updated ${property} to:`, (activeObject as any)[property]);

    // Important: Force a full canvas update to ensure changes are applied
    canvas.renderAll();

    // Force an object:modified event to update all interfaces and history
    canvas.fire('object:modified', { target: activeObject });
  };

  // Font size controls
  const decreaseFontSize = () => {
    if (!isTextObject) return;
    const newSize = Math.max(8, fontSize - 1);
    setFontSize(newSize);
    updateTextProperty('fontSize', newSize);
  };

  const increaseFontSize = () => {
    if (!isTextObject) return;
    const newSize = Math.min(72, fontSize + 1);
    setFontSize(newSize);
    updateTextProperty('fontSize', newSize);
  };

  // Font family control
  const handleFontChange = (value: string) => {
    if (!isTextObject) return;
    const safeValue = value || 'Arial'; // Ensure we have a default
    setFontFamily(safeValue);
    updateTextProperty('fontFamily', safeValue);
  };

  // Text alignment controls - Fixed to ensure immediate update
  const handleTextAlign = (value: string) => {
    if (!isTextObject) return;

    // Update our local state
    setTextAlign(value);

    // Apply the change to the object
    updateTextProperty('textAlign', value);

    // Force text to redraw with new alignment
    if (canvas) {
      canvas.requestRenderAll();
    }
  };

  // Toggle text style
  const toggleBold = () => {
    if (!isTextObject) return;
    const newValue = isBold ? 'normal' : 'bold';
    setIsBold(!isBold);
    updateTextProperty('fontWeight', newValue);
  };

  const toggleItalic = () => {
    if (!isTextObject) return;
    const newValue = isItalic ? 'normal' : 'italic';
    setIsItalic(!isItalic);
    updateTextProperty('fontStyle', newValue);
  };

  const toggleUnderline = () => {
    if (!isTextObject) return;
    setIsUnderline(!isUnderline);
    updateTextProperty('underline', !isUnderline);
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    if (!isTextObject) return;
    setTextColor(color);
    updateTextProperty('fill', color);
  };

  if (!isTextObject) return null;

  return (
    <div className="text-editor-toolbar bg-white border-b border-gray-200 flex items-center gap-2 z-10 p-2 overflow-x-auto">
      {/* Font Family Selector - with updated font preview */}
      <div className="text-editor-section flex-shrink-0">
        <Select
          value={fontFamily}
          onValueChange={handleFontChange}
        >
          <SelectTrigger className="w-[150px] h-10">
            <SelectValue placeholder="Select Font" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {fontOptions.map((font) => (
              <SelectItem
                key={font.value}
                value={font.value}
                style={{ fontFamily: font.value }}
                className="text-base py-2"
              >
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Font Size Controls */}
      <div className="text-editor-section flex-shrink-0 flex items-center border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 rounded-r-none border-r"
          onClick={decreaseFontSize}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="px-3 flex items-center justify-center">
          <span className="text-sm font-medium">{fontSize}</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 rounded-l-none border-l"
          onClick={increaseFontSize}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Text Color */}
      <div className="text-editor-section flex-shrink-0">
        <ColorPicker
          color={textColor}
          onChange={handleColorChange}
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Text Style Controls */}
      <div className="text-editor-section flex-shrink-0 flex items-center">
        <Button
          variant={isBold ? "default" : "outline"}
          size="sm"
          onClick={toggleBold}
          className="h-10 font-bold px-4"
        >
          <Bold className="h-4 w-4 mr-1" />
          Bold
        </Button>

        <Button
          variant={isItalic ? "default" : "outline"}
          size="sm"
          onClick={toggleItalic}
          className="h-10 italic px-4 ml-1"
        >
          <Italic className="h-4 w-4 mr-1" />
          Italic
        </Button>

        <Button
          variant={isUnderline ? "default" : "outline"}
          size="sm"
          onClick={toggleUnderline}
          className="h-10 px-4 ml-1"
        >
          <Underline className="h-4 w-4 mr-1" />
          Underline
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Text Alignment Controls */}
      <div className="text-editor-section flex-shrink-0 flex items-center">
        <Button
          variant={textAlign === 'left' ? "default" : "outline"}
          size="sm"
          onClick={() => handleTextAlign('left')}
          className="h-10 px-3 rounded-r-none"
        >
          <AlignLeft className="h-4 w-4 mr-1" />
          Left
        </Button>

        <Button
          variant={textAlign === 'center' ? "default" : "outline"}
          size="sm"
          onClick={() => handleTextAlign('center')}
          className="h-10 px-3 rounded-none border-l-0 border-r-0"
        >
          <AlignCenter className="h-4 w-4 mr-1" />
          Center
        </Button>

        <Button
          variant={textAlign === 'right' ? "default" : "outline"}
          size="sm"
          onClick={() => handleTextAlign('right')}
          className="h-10 px-3 rounded-l-none"
        >
          <AlignRight className="h-4 w-4 mr-1" />
          Right
        </Button>
      </div>

      <Button
        variant={textAlign === 'justify' ? "default" : "outline"}
        size="sm"
        onClick={() => handleTextAlign('justify')}
        className="h-10 px-4 ml-1 flex-shrink-0"
      >
        <AlignJustify className="h-4 w-4 mr-1" />
        Justify
      </Button>
    </div>
  );
};

export default TextEditorToolbar;
