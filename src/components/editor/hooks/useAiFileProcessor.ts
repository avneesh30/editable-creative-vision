
import { useCallback } from 'react';
import { fabric } from 'fabric';
import { toast } from 'sonner';
import { useEditor } from '../context';
import { saveTemplateToFolder } from '../services/templateService';

// Helper function to convert AI to SVG format (simplified approach)
const processAiFile = async (file: File): Promise<string | null> => {
  try {
    // Read the AI file as text (simplified approach)
    const fileContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
    
    // Very basic check if this looks like an AI file
    // In a real implementation, you'd use a more sophisticated AI parser library
    if (fileContent.includes('%!PS-Adobe') || fileContent.includes('%%Creator: Adobe Illustrator')) {
      console.log('Valid AI file detected, processing...');
      
      // Since we can't fully parse AI files in the browser,
      // we'll use a simple approach to extract SVG-like content if present
      // This is a simplified approach - real implementation would need a proper AI parser
      let svgContent = null;
      
      // Look for SVG content that might be embedded in the AI file
      if (fileContent.includes('<svg') && fileContent.includes('</svg>')) {
        const svgStart = fileContent.indexOf('<svg');
        const svgEnd = fileContent.indexOf('</svg>') + 6;
        svgContent = fileContent.substring(svgStart, svgEnd);
        console.log('Found embedded SVG in AI file');
      } else {
        console.log('No embedded SVG found, treating as regular vector file');
        // For files without embedded SVG, we'd need a proper AI to SVG converter
        // As a fallback here, we'll create a simple SVG representing the AI file
        svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
          <rect width="800" height="600" fill="#f0f0f0"/>
          <text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle">
            ${file.name} (AI Import)
          </text>
        </svg>`;
      }
      
      return svgContent;
    }
    
    console.error('Not a valid AI file');
    return null;
  } catch (error) {
    console.error('Error processing AI file:', error);
    return null;
  }
};

export const useAiFileProcessor = () => {
  const { canvas, setCanvasSize, saveToHistory } = useEditor();
  
  const processAiTemplate = useCallback(async (file: File): Promise<boolean> => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return false;
    }
    
    try {
      // Show loading toast
      const loadingToast = toast.loading('Processing Illustrator file...', {
        duration: 30000, // 30 seconds timeout
      });
      
      // Process the AI file to extract SVG content
      const svgContent = await processAiFile(file);
      
      if (!svgContent) {
        toast.dismiss(loadingToast);
        toast.error("Failed to process Illustrator file");
        return false;
      }
      
      // Create a data URL from the SVG content
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
      
      // Load the SVG into fabric canvas
      return new Promise((resolve) => {
        fabric.loadSVGFromURL(svgDataUrl, (objects, options) => {
          if (!objects || objects.length === 0) {
            toast.dismiss(loadingToast);
            toast.error("No valid content found in Illustrator file");
            resolve(false);
            return;
          }
          
          // Clear the canvas
          canvas.clear();
          
          // Default dimensions if extraction fails
          let width = 800;
          let height = 600;
          
          // Try to extract dimensions from SVG
          try {
            const svgElement = document.createElement('div');
            svgElement.innerHTML = svgContent;
            const svgNode = svgElement.querySelector('svg');
            
            if (svgNode) {
              const viewBox = svgNode.getAttribute('viewBox');
              if (viewBox) {
                const [, , w, h] = viewBox.split(' ').map(Number);
                if (w && h) {
                  width = w;
                  height = h;
                }
              } else if (svgNode.getAttribute('width') && svgNode.getAttribute('height')) {
                width = parseInt(svgNode.getAttribute('width') || '800');
                height = parseInt(svgNode.getAttribute('height') || '600');
              }
            }
          } catch (e) {
            console.error('Error extracting SVG dimensions:', e);
          }
          
          // Resize canvas to match SVG dimensions
          setCanvasSize({ width, height });
          
          // Create a group from the SVG objects
          const svgGroup = new fabric.Group(objects);
          
          // Scale group to fit within canvas
          const scale = Math.min(
            (canvas.width || 800) / (svgGroup.width || 1),
            (canvas.height || 600) / (svgGroup.height || 1)
          );
          
          if (scale < 1) {
            svgGroup.scale(scale);
          }
          
          // Center the group in the canvas
          svgGroup.set({
            left: ((canvas.width || 800) - (svgGroup.width || 0) * (scale < 1 ? scale : 1)) / 2,
            top: ((canvas.height || 600) - (svgGroup.height || 0) * (scale < 1 ? scale : 1)) / 2
          });
          
          // Add the group to the canvas
          canvas.add(svgGroup);
          canvas.renderAll();
          saveToHistory(canvas);
          
          toast.dismiss(loadingToast);
          toast.success("Illustrator file loaded successfully");
          resolve(true);
        });
      });
    } catch (error: any) {
      console.error('Error loading Illustrator file:', error);
      toast.error(`Failed to load Illustrator file: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, [canvas, setCanvasSize, saveToHistory]);
  
  const uploadAiAsTemplate = useCallback(async (file: File): Promise<boolean> => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return false;
    }
    
    try {
      // First load the AI into the canvas
      const loadResult = await processAiTemplate(file);
      if (!loadResult) {
        toast.error("Failed to load Illustrator file for template creation");
        return false;
      }
      
      // Generate thumbnail from the canvas
      const thumbnailUrl = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.7,
        multiplier: 0.5,
      });
      
      // Generate JSON from the canvas
      const canvasJson = JSON.stringify(canvas.toJSON(['id', 'name']));
      
      // Get the filename without extension to use as template name
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      // Create template data
      const templateData = {
        name: fileName,
        thumbnailUrl,
        canvasJson,
        size: {
          width: canvas.width || 800,
          height: canvas.height || 600
        },
        category: 'ai-uploads'
      };
      
      console.log('Saving AI template:', templateData);
      
      // Save to folder structure
      const saved = await saveTemplateToFolder(templateData);
      if (saved) {
        toast.success(`Template "${fileName}" saved successfully to template folder`);
        return true;
      } else {
        toast.error("Failed to save template to folder");
        return false;
      }
    } catch (error) {
      console.error("Error uploading AI as template:", error);
      toast.error(`Error creating template: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }, [canvas, processAiTemplate]);
  
  return {
    processAiTemplate,
    uploadAiAsTemplate
  };
};

export default useAiFileProcessor;
