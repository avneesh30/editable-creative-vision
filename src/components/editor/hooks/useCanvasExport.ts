
import { fabric } from 'fabric';
import { saveAs } from 'file-saver';

export const useCanvasExport = (canvas: fabric.Canvas | null) => {
  const saveToJSON = () => {
    if (!canvas) return '';
    return JSON.stringify(canvas.toJSON(['id', 'name']));
  };

  const loadFromJSON = (json: string) => {
    if (!canvas) return;
    
    try {
      canvas.loadFromJSON(JSON.parse(json), () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error('Error loading from JSON:', error);
    }
  };

  const exportToImage = async (format: 'png' | 'jpeg' | 'svg', quality: 'normal' | 'high' = 'normal'): Promise<string> => {
    if (!canvas) return '';
    
    if (format === 'svg') {
      const svg = canvas.toSVG();
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    } else {
      // Use higher multiplier for high quality
      const multiplier = quality === 'high' ? 2 : 1;
      const qualityValue = format === 'jpeg' ? 0.92 : 1;
      
      return canvas.toDataURL({
        format: format === 'jpeg' ? 'jpeg' : 'png',
        quality: qualityValue,
        multiplier: multiplier
      });
    }
  };

  const exportToHTML = (): string => {
    if (!canvas) return '';
    
    const svg = canvas.toSVG();
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Design</title>
  <style>
    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .canvas-container { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
  </style>
</head>
<body>
  <div class="canvas-container">
    ${svg}
  </div>
</body>
</html>`;
    
    return html;
  };

  const downloadImage = (format: 'png' | 'jpeg' | 'svg', quality: 'normal' | 'high' = 'normal') => {
    if (!canvas) return;
    
    if (format === 'svg') {
      const svg = canvas.toSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      saveAs(blob, 'design.svg');
      return;
    }
    
    // Use higher multiplier for high quality
    const multiplier = quality === 'high' ? 2 : 1;
    const qualityValue = format === 'jpeg' ? 0.92 : 1;
    
    const dataURL = canvas.toDataURL({
      format: format === 'jpeg' ? 'jpeg' : 'png',
      quality: qualityValue,
      multiplier: multiplier
    });
    
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `design.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to create a template from canvas
  const createTemplateFromImage = (imageUrl: string, name: string): { thumbnailUrl: string; canvasJson: string; size: { width: number; height: number } } => {
    if (!canvas) return { thumbnailUrl: '', canvasJson: '', size: { width: 0, height: 0 } };
    
    // Generate thumbnail from the canvas
    const thumbnailUrl = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.7,
      multiplier: 0.5,
    });
    
    // Generate JSON from the canvas including all object properties
    const canvasJson = JSON.stringify(canvas.toJSON(['id', 'name']));
    
    // Return template data
    return {
      thumbnailUrl,
      canvasJson,
      size: {
        width: canvas.width || 800,
        height: canvas.height || 600
      }
    };
  };

  return {
    saveToJSON,
    loadFromJSON,
    exportToImage,
    exportToHTML,
    downloadImage,
    createTemplateFromImage
  };
};
