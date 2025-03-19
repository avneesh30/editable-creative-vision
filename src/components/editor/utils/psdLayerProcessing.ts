
import { fabric } from 'fabric';
import { toast } from 'sonner';

// Helper function to position a layer
export const positionLayer = (obj: fabric.Object, node: any, canvasWidth: number, canvasHeight: number) => {
  // Try to get bounds from the node
  const bounds = node.get ? node.get('bounds') : null;
  
  if (bounds && 
      typeof bounds === 'object' && 
      bounds.right !== undefined && 
      bounds.left !== undefined && 
      bounds.bottom !== undefined && 
      bounds.top !== undefined) {
    
    obj.set({
      left: bounds.left,
      top: bounds.top,
      selectable: true
    });
  } else {
    // Without bounds, try to use node coordinates
    const left = node.left || node.x || 0;
    const top = node.top || node.y || 0;
    
    // If no coordinates, center the layer
    if (left === 0 && top === 0 && canvasWidth && canvasHeight) {
      obj.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        selectable: true
      });
    } else {
      obj.set({
        left: left,
        top: top,
        selectable: true
      });
    }
  }
};

// Helper function to add a text layer
export const addTextLayer = async (node: any, canvas: fabric.Canvas) => {
  return new Promise<void>((resolve) => {
    try {
      // Extract text data - this is complex and may not work for all PSDs
      const textData = node.get('typeTool') || {};
      let text = "Text layer";
      
      if (node.text) {
        text = node.text;
      } else if (textData.textData && textData.textData.text) {
        text = textData.textData.text;
      }
      
      // Create a text object
      const textOptions: fabric.TextOptions = {
        left: node.left || 0,
        top: node.top || 0,
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#000000'
      };
      
      // If we can get style information
      if (textData.style) {
        if (textData.style.fontSize) {
          textOptions.fontSize = textData.style.fontSize;
        }
        if (textData.style.fontName) {
          textOptions.fontFamily = textData.style.fontName;
        }
        if (textData.style.color) {
          textOptions.fill = textData.style.color;
        }
      }
      
      const textObject = new fabric.Text(text, textOptions);
      
      // Position the text layer
      positionLayer(textObject, node, 0, 0);
      
      canvas.add(textObject);
      resolve();
    } catch (err) {
      console.error('Error processing text layer:', err);
      resolve();
    }
  });
};

// Helper function to add a layer from pixel data
export const addPixelDataLayer = async (node: any, canvas: fabric.Canvas, canvasWidth: number, canvasHeight: number) => {
  return new Promise<void>((resolve) => {
    try {
      console.log('Adding pixel data layer for node:', node.name || 'Unnamed Layer');
      
      // Create a new canvas element
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      
      if (ctx) {
        const layerWidth = node.width();
        const layerHeight = node.height();
        
        // Skip empty layers
        if (layerWidth <= 0 || layerHeight <= 0) {
          console.log(`Layer has zero or negative dimensions, skipping`);
          resolve();
          return;
        }
        
        tempCanvas.width = layerWidth;
        tempCanvas.height = layerHeight;
        
        // Create ImageData and put it on canvas
        try {
          // Make sure we have pixel data before trying to create an ImageData object
          if (node.image && node.image.pixelData && node.image.pixelData.length > 0) {
            const imageData = new ImageData(
              new Uint8ClampedArray(node.image.pixelData),
              layerWidth,
              layerHeight
            );
            ctx.putImageData(imageData, 0, 0);
            
            // Convert canvas to image
            const imgData = tempCanvas.toDataURL('image/png');
            
            fabric.Image.fromURL(imgData, (img) => {
              if (!img) {
                console.error("Failed to create fabric image from pixel data layer");
                resolve();
                return;
              }
              
              // Position the layer
              positionLayer(img, node, canvasWidth, canvasHeight);
              
              // Set layer name as object name if available
              if (node.name) {
                img.set('name', node.name);
              }
              
              canvas.add(img);
              resolve();
            }, { 
              crossOrigin: 'anonymous'
            });
          } else {
            console.log('No pixel data available for this layer, skipping');
            resolve();
          }
        } catch (imageDataError) {
          console.error('Error creating ImageData:', imageDataError);
          resolve();
        }
      } else {
        resolve();
      }
    } catch (err) {
      console.error('Error processing pixel data layer:', err);
      resolve();
    }
  });
};

// Process individual layers
export const processLayers = async (psd: any, tree: any, canvas: fabric.Canvas, width: number, height: number) => {
  let layersAdded = 0;
  let descendants = [];
  
  try {
    // Get all descendants (layers and groups)
    descendants = tree.descendants() || [];
    console.log(`Found ${descendants.length} descendants`);
    
    // Sort descendants to process from bottom to top (as in Photoshop)
    // This ensures that layers appear in the correct order
    descendants.reverse();
  } catch (e) {
    console.error('Error getting descendants:', e);
    return { layersAdded: 0 };
  }
  
  // Process each layer
  const layerProcessingPromises = descendants.map(async (node: any, index: number) => {
    if (!node) return;
    
    // Log each layer we're trying to process
    console.log(`Processing layer ${index}:`, node.name || 'Unnamed Layer');
    
    // Skip groups, process only actual layers
    if (typeof node.isGroup === 'function' && node.isGroup()) {
      console.log('This is a group, skipping direct processing');
      return;
    }
    
    // Skip invisible layers
    if (node.visible === false) {
      console.log('Layer is invisible, skipping');
      return;
    }
    
    try {
      // Check if this is a text layer
      const isTextLayer = node.get && (node.get('typeTool') || node.text);
      
      if (isTextLayer) {
        // Handle text layer
        console.log('Processing text layer');
        await addTextLayer(node, canvas);
        layersAdded++;
        return;
      }
      
      // Handle image layer using toPng() if available
      if (node.toPng) {
        try {
          console.log('Processing layer with toPng()');
          
          // toPng() can return either a Canvas element or an object with toDataURL
          const pngResult = node.toPng();
          
          if (pngResult) {
            let imgData = '';
            
            // Handle different types of return values from toPng()
            if (pngResult instanceof HTMLCanvasElement) {
              imgData = pngResult.toDataURL('image/png');
            } else if (typeof pngResult === 'object' && pngResult.toDataURL) {
              imgData = pngResult.toDataURL('image/png');
            } else {
              console.log('Unrecognized toPng() result, falling back to pixel data');
              await addPixelDataLayer(node, canvas, width, height);
              layersAdded++;
              return;
            }
            
            // Create fabric image from PNG data
            await new Promise<void>((resolve) => {
              fabric.Image.fromURL(imgData, (img) => {
                if (!img) {
                  console.error("Failed to create fabric image from layer");
                  resolve();
                  return;
                }
                
                // Position the layer
                positionLayer(img, node, width, height);
                
                // Set layer name as object name if available
                if (node.name) {
                  img.set('name', node.name);
                }
                
                // Add the layer
                canvas.add(img);
                layersAdded++;
                resolve();
              }, { 
                crossOrigin: 'anonymous'
              });
            });
          } else {
            // Fallback to pixel data if toPng() returns nothing
            console.log('toPng() returned nothing, falling back to pixel data');
            await addPixelDataLayer(node, canvas, width, height);
            layersAdded++;
          }
        } catch (pngError) {
          console.error("Error processing layer with toPng:", pngError);
          
          // Fallback to pixel data if toPng fails
          try {
            console.log('toPng() failed, falling back to pixel data');
            await addPixelDataLayer(node, canvas, width, height);
            layersAdded++;
          } catch (pixelError) {
            console.error("Fallback pixel data layer also failed:", pixelError);
          }
        }
      }
      // Alternative approach for image data using pixel data directly
      else if (node.image && node.image.pixelData) {
        console.log('Processing layer with pixel data');
        await addPixelDataLayer(node, canvas, width, height);
        layersAdded++;
      } else {
        console.log('Layer has no usable image data, skipping');
      }
    } catch (layerError) {
      console.error(`Error processing layer:`, layerError);
    }
  });
  
  // Wait for all layer processing to complete
  await Promise.all(layerProcessingPromises.filter(Boolean));
  
  console.log(`Added ${layersAdded} layers to canvas`);
  return { layersAdded };
};
