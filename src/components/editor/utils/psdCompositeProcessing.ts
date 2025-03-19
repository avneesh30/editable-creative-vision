
import { fabric } from 'fabric';

// Helper function to load the composite image
export const loadCompositeImage = async (psd: any, canvas: fabric.Canvas, width: number, height: number) => {
  return new Promise<{ success: boolean }>((resolve) => {
    try {
      // psd.image.toPng() may return a canvas, not an object with toDataURL
      const compositeImg = psd.image.toPng();
      
      if (compositeImg) {
        // Handle both canvas and object with toDataURL
        let imgData;
        
        if (compositeImg instanceof HTMLCanvasElement) {
          imgData = compositeImg.toDataURL('image/png');
        } else if (typeof compositeImg === 'object' && compositeImg.toDataURL) {
          imgData = compositeImg.toDataURL('image/png');
        } else {
          // Create a new canvas from pixel data as fallback
          const flatCanvas = document.createElement('canvas');
          flatCanvas.width = width;
          flatCanvas.height = height;
          const flatCtx = flatCanvas.getContext('2d');
          
          if (flatCtx && psd.image.pixelData) {
            const flatImageData = new ImageData(
              new Uint8ClampedArray(psd.image.pixelData),
              width,
              height
            );
            flatCtx.putImageData(flatImageData, 0, 0);
            imgData = flatCanvas.toDataURL('image/png');
          } else {
            resolve({ success: false });
            return;
          }
        }
        
        fabric.Image.fromURL(imgData, (img) => {
          if (!img) {
            resolve({ success: false });
            return;
          }
          
          img.scaleToWidth(width);
          canvas.add(img);
          canvas.renderAll();
          console.log("Loaded composite image successfully");
          resolve({ success: true });
        }, { 
          crossOrigin: 'anonymous'
        });
      } else {
        resolve({ success: false });
      }
    } catch (error) {
      console.error("Error loading composite image:", error);
      resolve({ success: false });
    }
  });
};

// Helper function to load a flattened image as last resort
export const loadFlattenedImage = async (psd: any, canvas: fabric.Canvas, width: number, height: number) => {
  return new Promise<{ success: boolean }>((resolve) => {
    try {
      const psdRaw = psd.image.pixelData;
      if (psdRaw && width && height) {
        const flatCanvas = document.createElement('canvas');
        flatCanvas.width = width;
        flatCanvas.height = height;
        const flatCtx = flatCanvas.getContext('2d');
        
        if (flatCtx) {
          // Create ImageData for the whole image
          const flatImageData = new ImageData(
            new Uint8ClampedArray(psdRaw),
            width,
            height
          );
          flatCtx.putImageData(flatImageData, 0, 0);
          
          // Convert canvas to image
          const flatImgData = flatCanvas.toDataURL('image/png');
          
          fabric.Image.fromURL(flatImgData, (img) => {
            if (!img) {
              resolve({ success: false });
              return;
            }
            
            img.scaleToWidth(width);
            canvas.add(img);
            canvas.renderAll();
            console.log("Loaded flattened image successfully");
            resolve({ success: true });
          }, { 
            crossOrigin: 'anonymous'
          });
        } else {
          resolve({ success: false });
        }
      } else {
        resolve({ success: false });
      }
    } catch (error) {
      console.error("Error loading flattened image:", error);
      resolve({ success: false });
    }
  });
};
