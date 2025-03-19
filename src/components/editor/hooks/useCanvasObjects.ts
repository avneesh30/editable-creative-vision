
import { fabric } from 'fabric';
import { ElementOptions } from '../types';


const createRegularPolygonPoints = (numSides: any, radius: any) => {
  const points = [];
  const angleStep = (2 * Math.PI) / numSides;

  for (let i = 0; i < numSides; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    });
  }

  return points;
};

const createStarPoints = (numPoints: any, outerRadius: any, innerRadius: any) => {
  const points = [];
  const angleStep = Math.PI / numPoints;

  for (let i = 0; i < numPoints * 2; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    });
  }

  return points;
};

// Helper function to ensure text objects have valid font properties
const ensureValidTextProperties = (textObject: fabric.IText | any) => {
  if (!textObject) return textObject;

  try {
    // Ensure fontFamily is never undefined or null - most critical property
    if (!textObject.fontFamily) {
      textObject.set('fontFamily', 'Arial');
      console.log('Fixed missing fontFamily in helper');
    }

    // Ensure fontSize is valid - another critical property
    if (!textObject.fontSize || isNaN(textObject.fontSize)) {
      textObject.set('fontSize', 20);
      console.log('Fixed missing or invalid fontSize in helper');
    }

    // Ensure fontStyle is one of the valid values
    if (!textObject.fontStyle || !['', 'normal', 'italic', 'oblique'].includes(textObject.fontStyle)) {
      textObject.set('fontStyle', 'normal');
      console.log('Fixed invalid fontStyle in helper');
    }

    // Ensure fontWeight is defined and valid
    if (textObject.fontWeight === undefined || textObject.fontWeight === null) {
      textObject.set('fontWeight', 'normal');
      console.log('Fixed missing fontWeight in helper');
    }

    // Ensure textAlign is defined and valid
    if (textObject.textAlign === undefined || textObject.textAlign === null) {
      textObject.set('textAlign', 'left');
      console.log('Fixed missing textAlign in helper');
    }

    // Ensure fill has a default
    if (textObject.fill === undefined || textObject.fill === null) {
      textObject.set('fill', '#000000');
    }

    // Force cache clearing to ensure rendering updates
    textObject._forceClearCache = true;
  } catch (err) {
    console.error('Error in ensureValidTextProperties:', err);
  }

  return textObject;
};

export const useCanvasObjects = (
  canvas: fabric.Canvas | null,
  setActiveObject: (obj: fabric.Object | null) => void,
  onObjectAdded: () => void
) => {
  const addText = (text: string, options: ElementOptions = {}) => {
    if (!canvas) return;

    try {
      // Create a deep copy of options to avoid mutations
      const processedOptions = { ...options };

      // Ensure fundamental properties are always defined with valid values
      const safeOptions = {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'normal',
        fontStyle: 'normal' as "" | "normal" | "italic" | "oblique", // Type assertion to match Fabric's requirements
        textAlign: 'left',
        fill: '#000000',
        ...processedOptions
      };

      // Extra safety - ensure these properties are never undefined
      if (!safeOptions.fontFamily) safeOptions.fontFamily = 'Arial';
      if (!safeOptions.fontSize || isNaN(safeOptions.fontSize as number)) safeOptions.fontSize = 20;
      if (!safeOptions.fill) safeOptions.fill = '#000000';

      // Ensure fontStyle is one of the allowed values
      if (!safeOptions.fontStyle || !['', 'normal', 'italic', 'oblique'].includes(safeOptions.fontStyle as string)) {
        safeOptions.fontStyle = 'normal' as "" | "normal" | "italic" | "oblique";
      }

      // Create text object with guaranteed safe options
      const textObject = new fabric.IText(text || 'Text', safeOptions); // Ensure text is never empty

      // Double-check that the object has all required text properties 
      ensureValidTextProperties(textObject);

      // Log the object to verify properties
      console.log('Text object created with properties:', {
        fontFamily: textObject.fontFamily,
        fontSize: textObject.fontSize,
        fontWeight: textObject.fontWeight,
        fontStyle: textObject.fontStyle,
        textAlign: textObject.textAlign,
        fill: textObject.fill
      });

      // Add the object to canvas
      canvas.add(textObject);

      // Set it as the active object
      canvas.setActiveObject(textObject);
      setActiveObject(textObject);

      // Force text to render with proper initial alignment
      if (textObject.textAlign) {
        // Apply the text alignment
        textObject.set('textAlign', textObject.textAlign);
        canvas.requestRenderAll();
      }

      // Render and save
      canvas.renderAll();
      onObjectAdded();
    } catch (err) {
      console.error('Error creating text object:', err);
    }
  };

  const addRect = (options: ElementOptions = {}) => {
    if (!canvas) return;

    try {
      // Ensure required properties with defaults
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        width: options.width || 100,
        height: options.height || 100,
        fill: options.fill || '#1e88e5',
        stroke: options.stroke || undefined,
        strokeWidth: options.strokeWidth || 0,
        rx: options.rx || 0,
        ry: options.ry || 0,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        ...options
      });

      console.log('Created rectangle with properties:', {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        fill: rect.fill,
        selectable: rect.selectable
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
      setActiveObject(rect);
      canvas.renderAll();
      onObjectAdded();
    } catch (err) {
      console.error('Error creating rectangle:', err);
    }
  };

  const addCircle = (options: ElementOptions = {}) => {
    if (!canvas) return;

    try {
      // Ensure required properties with defaults
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        radius: options.radius || 50,
        fill: options.fill || '#4caf50',
        stroke: options.stroke || undefined,
        strokeWidth: options.strokeWidth || 0,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        ...options
      });

      console.log('Created circle with properties:', {
        left: circle.left,
        top: circle.top,
        radius: circle.radius,
        fill: circle.fill,
        selectable: circle.selectable
      });

      canvas.add(circle);
      canvas.setActiveObject(circle);
      setActiveObject(circle);
      canvas.renderAll();
      onObjectAdded();
    } catch (err) {
      console.error('Error creating circle:', err);
    }
  };

  const addTriangle = (options: ElementOptions = {}) => {
    if (!canvas) return;

    try {
      // Ensure required properties with defaults
      const triangle = new fabric.Triangle({
        left: 100,
        top: 100,
        width: options.width || 100,
        height: options.height || 100,
        fill: options.fill || '#ff9800',
        stroke: options.stroke || undefined,
        strokeWidth: options.strokeWidth || 0,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        ...options
      });

      console.log('Created triangle with properties:', {
        left: triangle.left,
        top: triangle.top,
        width: triangle.width,
        height: triangle.height,
        fill: triangle.fill,
        selectable: triangle.selectable
      });

      canvas.add(triangle);
      canvas.setActiveObject(triangle);
      setActiveObject(triangle);
      canvas.renderAll();
      onObjectAdded();
    } catch (err) {
      console.error('Error creating triangle:', err);
    }
  };

  const addImage = (url: string, options: ElementOptions = {}) => {
    if (!canvas) return;

    fabric.Image.fromURL(url, (img) => {
      try {
        // Scale image if it's too large
        const maxWidth = 300;
        const maxHeight = 300;

        if (img.width && img.height) {
          if (img.width > maxWidth || img.height > maxHeight) {
            const scaleX = maxWidth / img.width;
            const scaleY = maxHeight / img.height;
            const scale = Math.min(scaleX, scaleY);

            img.scale(scale);
          }
        }

        // Apply options with defaults
        img.set({
          left: 100,
          top: 100,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          ...options
        });

        console.log('Created image with properties:', {
          left: img.left,
          top: img.top,
          width: img.width,
          height: img.height,
          selectable: img.selectable
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        setActiveObject(img);
        canvas.renderAll();
        onObjectAdded();
      } catch (err) {
        console.error('Error processing image:', err);
      }
    }, { crossOrigin: 'anonymous' }); // Add crossOrigin option to help with image loading
  };

  const createBusinessCardTemplate = () => {
    if (!canvas) return;

    try {
      // Clear the canvas first
      canvas.clear();

      // Set canvas background to white
      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));

      // Create business card with a placeholder image instead of using a specific path that might fail
      const createBusinessCard = () => {
        try {
          // Add the name in stylized script font with fallback (extra safe)
          const nameText = new fabric.IText('Juliana Silva', {
            left: 500,
            top: 190,
            fontFamily: 'Arial', // Default to Arial in case "Dancing Script" isn't available
            fontSize: 60,
            fill: '#333333',
            originX: 'center',
            fontWeight: 'normal',
            fontStyle: 'normal' as "" | "normal" | "italic" | "oblique", // Type assertion to match Fabric's requirements
            textAlign: 'center',
            selectable: true,
            hasControls: true,
            hasBorders: true
          });

          // Apply our helper to ensure valid font properties
          ensureValidTextProperties(nameText);

          canvas.add(nameText);

          // Add contact information with icons - with extra safety

          // Phone - with extra safety
          const phoneText = new fabric.IText('123-456-7890', {
            left: 550,
            top: 320,
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#333333',
            fontWeight: 'normal',
            fontStyle: 'normal' as "" | "normal" | "italic" | "oblique", // Type assertion to match Fabric's requirements
            textAlign: 'left',
            selectable: true,
            hasControls: true,
            hasBorders: true
          });
          ensureValidTextProperties(phoneText);

          const phoneIcon = new fabric.Text('', {
            left: 510,
            top: 323,
            fontFamily: 'Arial', // Using a safe default
            fontSize: 24,
            fill: '#333333',
            text: "\uf095", // Phone icon unicode
            fontWeight: 'normal',
            fontStyle: 'normal' as "" | "normal" | "italic" | "oblique", // Type assertion to match Fabric's requirements
            textAlign: 'left',
            selectable: true,
            hasControls: true,
            hasBorders: true
          });
          ensureValidTextProperties(phoneIcon);

          // Add all text elements to canvas safely
          canvas.add(phoneText);
          canvas.add(phoneIcon);

          // Create a placeholder circle for the profile image
          const circle = new fabric.Circle({
            radius: 80,
            fill: '#e0e0e0',
            left: 100,
            top: 100,
            originX: 'center',
            originY: 'center',
            selectable: true,
            hasControls: true,
            hasBorders: true
          });

          // Add placeholder text in circle - with extra safety
          const placeholderText = new fabric.IText('Photo', {
            left: 100,
            top: 100,
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#666666',
            originX: 'center',
            originY: 'center',
            fontWeight: 'normal',
            fontStyle: 'normal' as "" | "normal" | "italic" | "oblique", // Type assertion to match Fabric's requirements
            textAlign: 'center',
            selectable: true,
            hasControls: true,
            hasBorders: true
          });
          ensureValidTextProperties(placeholderText);

          canvas.add(circle, placeholderText);

          // Render the canvas
          canvas.renderAll();
          onObjectAdded();
        } catch (err) {
          console.error('Error creating business card elements:', err);
        }
      };

      // Execute the business card creation
      createBusinessCard();
    } catch (err) {
      console.error('Error in createBusinessCardTemplate:', err);
    }
  };

  const addShape = (shapeType: any, options: any = {}) => {
    if (!canvas) return;

    let shape;
    const defaultFill = '#4CAF50';
    const defaultStroke = '#000000';

    switch (shapeType) {
      case 'rect':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'circle':
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'triangle':
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'diamond':
        // Diamond is a rotated square
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1,
          angle: 45
        });
        break;

      case 'ellipse':
        shape = new fabric.Ellipse({
          left: 100,
          top: 100,
          rx: 60,
          ry: 40,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'square':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'pentagon':
        // Create pentagon using polygon
        const pentagonPoints = createRegularPolygonPoints(5, 50);
        shape = new fabric.Polygon(pentagonPoints, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'hexagon':
        // Create hexagon using polygon
        const hexagonPoints = createRegularPolygonPoints(6, 50);
        shape = new fabric.Polygon(hexagonPoints, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'octagon':
        // Create octagon using polygon
        const octagonPoints = createRegularPolygonPoints(8, 50);
        shape = new fabric.Polygon(octagonPoints, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'star':
        // Create a 5-point star
        const starPoints = createStarPoints(5, 50, 25);
        shape = new fabric.Polygon(starPoints, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'heart':
        // Create a heart shape using path
        const heartPath = 'M 25,45 A 14,14 0,0,1 0,30 A 14,14 0,0,1 25,15 A 14,14 0,0,1 50,30 A 14,14 0,0,1 25,45 z';
        shape = new fabric.Path(heartPath, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1,
          scaleX: 2,
          scaleY: 2
        });
        break;

      case 'arrow':
        // Create an arrow shape based on direction
        const direction = options.direction || 'right';
        let arrowPath;

        switch (direction) {
          case 'right':
            arrowPath = 'M 0,20 L 80,20 L 80,10 L 100,25 L 80,40 L 80,30 L 0,30 z';
            break;
          case 'left':
            arrowPath = 'M 100,20 L 20,20 L 20,10 L 0,25 L 20,40 L 20,30 L 100,30 z';
            break;
          case 'up':
            arrowPath = 'M 25,100 L 25,20 L 10,20 L 25,0 L 40,20 L 30,20 L 30,100 z';
            break;
          case 'down':
            arrowPath = 'M 25,0 L 25,80 L 10,80 L 25,100 L 40,80 L 30,80 L 30,0 z';
            break;
          default:
            arrowPath = 'M 0,20 L 80,20 L 80,10 L 100,25 L 80,40 L 80,30 L 0,30 z';
        }

        shape = new fabric.Path(arrowPath, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'callout':
        // Create a callout shape (speech bubble)
        const calloutType = options.type || 'square';
        let calloutPath;

        if (calloutType === 'circle') {
          calloutPath = 'M 50,0 A 50,50 0 1,0 50,100 A 50,50 0 1,0 50,0 M 30,100 L 25,120 L 60,95';
        } else {
          calloutPath = 'M 0,0 L 100,0 L 100,80 L 70,80 L 50,100 L 50,80 L 0,80 z';
        }

        shape = new fabric.Path(calloutPath, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'plus':
        // Create a plus shape
        const plusPath = 'M 40,0 L 60,0 L 60,40 L 100,40 L 100,60 L 60,60 L 60,100 L 40,100 L 40,60 L 0,60 L 0,40 L 40,40 z';
        shape = new fabric.Path(plusPath, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'badge':
        // Create a badge/award shape
        const badgePath = 'M 50,0 L 61,35 L 98,35 L 68,57 L 79,91 L 50,70 L 21,91 L 32,57 L 2,35 L 39,35 z';
        shape = new fabric.Path(badgePath, {
          left: 100,
          top: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
        break;

      case 'grid':
        // Create a grid shape with multiple lines
        const gridSize = 100;
        const cellSize = 20;
        const lines = [];

        // Create horizontal lines
        for (let i = 0; i <= gridSize; i += cellSize) {
          lines.push(new fabric.Line([0, i, gridSize, i], {
            stroke: defaultStroke,
            strokeWidth: 1
          }));
        }

        // Create vertical lines
        for (let i = 0; i <= gridSize; i += cellSize) {
          lines.push(new fabric.Line([i, 0, i, gridSize], {
            stroke: defaultStroke,
            strokeWidth: 1
          }));
        }

        // Group the lines together
        shape = new fabric.Group(lines, {
          left: 100,
          top: 100
        });
        break;

      default:
        // Default to rectangle if shape not found
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: defaultFill,
          stroke: defaultStroke,
          strokeWidth: 1
        });
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.requestRenderAll();

    // Fire event for history/undo
    canvas.fire('object:added', { target: shape });

    return shape;
  };


  return {
    addText,
    addRect,
    addCircle,
    addTriangle,
    addImage,
    addShape,
    createBusinessCardTemplate
  };
};
