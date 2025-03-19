
import { useCallback } from 'react';
import { fabric } from 'fabric';
import PSD from 'psd.js';
import { useEditor } from '../context';
import { toast } from 'sonner';
import { processLayers } from '../utils/psdLayerProcessing';
import { loadCompositeImage, loadFlattenedImage } from '../utils/psdCompositeProcessing';

export const usePsdLoader = () => {
  const { canvas, setCanvasSize, saveToHistory } = useEditor();

  const loadPsdTemplate = useCallback(async (file: File) => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return false;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Processing PSD file...', {
        duration: 60000, // Extended duration for larger files
      });

      // Parse the PSD file
      const buffer = await file.arrayBuffer();
      
      // Validate buffer is not empty
      if (!buffer || buffer.byteLength === 0) {
        toast.dismiss(loadingToast);
        toast.error("Invalid PSD file: Empty file");
        return false;
      }
      
      console.log(`PSD file size: ${(buffer.byteLength / 1024 / 1024).toFixed(2)} MB`);
      
      // Use try-catch specifically for parsing to provide better error messages
      try {
        const psd = new PSD(new Uint8Array(buffer));
        await psd.parse();
        
        // Extract PSD dimensions for canvas sizing
        const width = psd.header.width;
        const height = psd.header.height;
        
        console.log(`PSD dimensions: ${width}x${height}`);
        
        // Validate dimensions
        if (!width || !height || width <= 0 || height <= 0) {
          toast.dismiss(loadingToast);
          toast.error("Invalid PSD dimensions");
          return false;
        }
        
        // Resize canvas to match PSD dimensions
        setCanvasSize({ width, height });
        
        // Clear current canvas
        canvas.clear();

        console.log('PSD loaded, processing layers...');
        
        let compositeImgLoaded = false;
        
        // Process tree structure to extract layers
        let tree;
        try {
          // Try to get the PSD tree
          tree = psd.tree();
          
          // Export the tree - this is needed to properly extract layers
          // This step is crucial for PSD.js to work correctly
          await tree.export();
          
          // Add debug logging to see the tree structure
          console.log('PSD tree structure:', tree);
          
          // Process individual layers
          const processLayersResult = await processLayers(psd, tree, canvas, width, height);
          
          if (processLayersResult.layersAdded > 0) {
            console.log(`Successfully added ${processLayersResult.layersAdded} layers to canvas`);
            compositeImgLoaded = true;
            
            // Arrange layers in correct order (bottom to top)
            canvas.renderAll();
          } else {
            console.log("No layers were added, falling back to composite image");
          }
        } catch (treeError) {
          console.error('Error processing layer tree:', treeError);
        }
        
        // If no layers were added, try to get the composite image as fallback
        if (!compositeImgLoaded) {
          try {
            const compositeResult = await loadCompositeImage(psd, canvas, width, height);
            compositeImgLoaded = compositeResult.success;
          } catch (compositeError) {
            console.error('Error getting composite image:', compositeError);
          }
        }
        
        // Last resort: try to render the whole PSD as a flattened image
        if (!compositeImgLoaded) {
          try {
            const flattenedResult = await loadFlattenedImage(psd, canvas, width, height);
            compositeImgLoaded = flattenedResult.success;
          } catch (flattenError) {
            console.error('Error creating flattened image:', flattenError);
          }
        }
        
        if (!compositeImgLoaded) {
          toast.dismiss(loadingToast);
          toast.error("Could not extract any content from the PSD file");
          return false;
        }
        
        canvas.renderAll();
        saveToHistory(canvas);
        toast.dismiss(loadingToast);
        toast.success("PSD template loaded successfully");
        return true;
      } catch (parseError: any) {
        console.error('Error parsing PSD file:', parseError);
        toast.dismiss(loadingToast);
        toast.error(`Failed to parse PSD: ${parseError.message || 'Unknown parsing error'}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error loading PSD file:', error);
      toast.error(`Failed to load PSD: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, [canvas, setCanvasSize, saveToHistory]);

  return { loadPsdTemplate };
};

export default usePsdLoader;
