
import React, { useState } from 'react';
import { Upload, FileType, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import usePsdTemplates from '../hooks/usePsdTemplates';
import useAiFileProcessor from '../hooks/useAiFileProcessor';
import { fabric } from 'fabric';
import { useEditor } from '../context';
import { saveTemplateToFolder } from '../services/templateService';

interface FileUploaderProps {
  acceptedTypes?: string;
  maxSizeMB?: number;
  onSuccess?: () => void;
  saveAsTemplate?: boolean;
  uploadType?: 'psd' | 'illustrator' | 'image' | 'any';
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  acceptedTypes = ".psd,.ai,.png,.jpg,.jpeg,.svg,.fig",
  maxSizeMB = 100, // 100MB limit
  onSuccess,
  saveAsTemplate = false,
  uploadType = 'any'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { loadPsdTemplate, uploadPsdAsTemplate } = usePsdTemplates();
  const { processAiTemplate, uploadAiAsTemplate } = useAiFileProcessor();
  const { canvas, setCanvasSize, saveToHistory, exportToImage } = useEditor();

  const getFileExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  };

  const getFileIcon = (extension: string): React.ReactNode => {
    return <FileType className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    setIsLoading(true);

    try {
      const extension = getFileExtension(file.name);
      console.log(`Processing ${extension} file:`, file.name, 'size:', fileSizeMB.toFixed(2), 'MB');

      // Handle different file types
      if (extension === 'psd' && (uploadType === 'any' || uploadType === 'psd')) {
        if (saveAsTemplate) {
          // If saveAsTemplate is true, save PSD as template
          await uploadPsdAsTemplate(file);
        } else {
          // Regular PSD loading
          await loadPsdTemplate(file);
        }
      } else if (extension === 'ai' && (uploadType === 'any' || uploadType === 'illustrator')) {
        if (saveAsTemplate) {
          // If saveAsTemplate is true, save AI as template
          await uploadAiAsTemplate(file);
        } else {
          // Regular AI loading
          await processAiTemplate(file);
        }
      } else if (['png', 'jpg', 'jpeg', 'svg'].includes(extension) && (uploadType === 'any' || uploadType === 'image')) {
        // Handle regular image files
        if (!canvas) {
          toast.error("Canvas not initialized");
          return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          const imgData = event.target?.result as string;
          fabric.Image.fromURL(imgData, async (img) => {
            if (!img) {
              console.error(`Failed to load image`);
              toast.error(`Failed to load image file. Please try another file.`);
              return;
            }

            // Resize canvas to image dimensions if larger than current canvas
            const canvasWidth = canvas.width || 800;
            const canvasHeight = canvas.height || 600;
            const imgWidth = img.width || 0;
            const imgHeight = img.height || 0;

            if (imgWidth > canvasWidth || imgHeight > canvasHeight) {
              setCanvasSize({ width: Math.max(canvasWidth, imgWidth), height: Math.max(canvasHeight, imgHeight) });
            }

            // Scale image to fit within canvas
            const scale = Math.min(
              canvasWidth / (imgWidth || 1),
              canvasHeight / (imgHeight || 1)
            );

            if (scale < 1) {
              img.scale(scale);
            }

            img.set({
              left: (canvasWidth - (imgWidth * (scale < 1 ? scale : 1))) / 2,
              top: (canvasHeight - (imgHeight * (scale < 1 ? scale : 1))) / 2,
              selectable: true
            });

            // Clear canvas first if saving as template
            if (saveAsTemplate) {
              canvas.clear();
            }

            canvas.add(img);
            canvas.renderAll();
            saveToHistory(canvas);

            // If saveAsTemplate is true, save image as template
            if (saveAsTemplate) {
              // Create template from the image
              const fileName = file.name.replace(/\.[^/.]+$/, "");

              // Generate thumbnail from the canvas
              const thumbnailUrl = canvas.toDataURL({
                format: 'jpeg',
                quality: 0.7,
                multiplier: 0.5,
              });

              // Generate JSON from the canvas
              const canvasJson = JSON.stringify(canvas.toJSON(['id', 'name']));

              // Create template data
              const templateData = {
                name: fileName,
                thumbnailUrl,
                canvasJson,
                size: {
                  width: canvas.width || 800,
                  height: canvas.height || 600
                },
                category: 'image-uploads'
              };

              // Save to folder structure
              const saved = await saveTemplateToFolder(templateData);

              if (saved) {
                toast.success(`Image "${fileName}" saved successfully as template`);
              } else {
                toast.error("Failed to save image as template");
              }
            } else {
              toast.success(`Image loaded successfully`);
            }
          });
        };
        reader.readAsDataURL(file);
      } else if (extension === 'fig') {
        // Figma files aren't directly importable, so we'll show a message
        toast.info("Figma files cannot be directly imported. Please export your Figma design as PNG or JPG first.");
      } else {
        toast.error(`Unsupported file type: ${extension}`);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to process file: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);

      // Reset the input
      e.target.value = '';
    }
  };

  // Determine what file types to show in the label text
  const getFileTypesText = () => {
    switch (uploadType) {
      case 'psd':
        return 'PSD files';
      case 'illustrator':
        return 'Adobe Illustrator files';
      case 'image':
        return 'images';
      default:
        return 'PSD, Illustrator, images, or exported Figma designs';
    }
  };

  return (
    <div>
      <label htmlFor="file-upload">
        <div className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:border-primary transition-colors">
          {isLoading ? (
            <Loader2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground animate-spin" />
          ) : (
            <>
              {saveAsTemplate ? (
                <div className="flex items-center justify-center mb-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <Save className="h-6 w-6 text-muted-foreground ml-1" />
                </div>
              ) : (
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              )}
            </>
          )}
          <p className="text-sm font-medium">
            {saveAsTemplate ? 'Upload as Template' : 'Upload File'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {saveAsTemplate
              ? `Add ${getFileTypesText()} directly to your templates library`
              : `Import ${getFileTypesText()} (up to ${maxSizeMB}MB)`}
          </p>
          {isLoading && (
            <div className="mt-2">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse rounded-full"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Processing file... This may take a moment</p>
            </div>
          )}
        </div>
        <input
          id="file-upload"
          type="file"
          accept={acceptedTypes}
          className="hidden"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default FileUploader;
