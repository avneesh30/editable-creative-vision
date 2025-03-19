
import React, { useState, useEffect } from 'react';
import { PsdTemplate } from '../types';
import { useEditor } from '../context';
import { Button } from '../../../components/ui/button';
import { File, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { fetchTemplatesByCategory, loadTemplateJson } from '../services/templateService';
import IllustratorTemplateUploader from './IllustratorTemplateUploader';
import usePsdTemplates from '../hooks/usePsdTemplates';

const AiTemplateGallery: React.FC = () => {
  const [templates, setTemplates] = useState<PsdTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setCanvasSize, loadFromJSON, setCanvasBackgroundColor } = useEditor();
  const { getAiTemplates } = usePsdTemplates();

  // Load templates when component mounts
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching AI templates...');
        const fetchedTemplates = await getAiTemplates();
        console.log('Fetched templates:', fetchedTemplates);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error loading AI templates:', error);
        toast.error('Failed to load Illustrator templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [getAiTemplates]);

  const refreshTemplates = async () => {
    setIsLoading(true);
    try {
      console.log('Refreshing AI templates...');
      const fetchedTemplates = await getAiTemplates();
      console.log('Refreshed templates:', fetchedTemplates);
      setTemplates(fetchedTemplates);
      toast.success('Templates refreshed successfully');
    } catch (error) {
      console.error('Error refreshing templates:', error);
      toast.error('Failed to refresh templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = async (template: PsdTemplate) => {
    toast.info(`Loading Illustrator template: ${template.name}...`);

    try {
      console.log('Loading template:', template);

      // First set the canvas size to match the template
      setCanvasSize(template.size);

      // Set a neutral background color when loading the template
      setCanvasBackgroundColor('#ffffff');

      // If the template has a canvasJson property, use it directly
      if (template.canvasJson) {
        try {
          console.log('Using canvasJson property');
          // Parse the JSON string to an object
          const jsonData = typeof template.canvasJson === 'string'
            ? JSON.parse(template.canvasJson)
            : template.canvasJson;

          // Load the JSON data into the canvas
          setTimeout(() => {
            loadFromJSON(jsonData);
            toast.success(`Template "${template.name}" loaded successfully`);
          }, 100);
          return;
        } catch (jsonError) {
          console.error('Error parsing template JSON:', jsonError);
        }
      }

      // Fallback to loading from jsonPath if canvasJson isn't available or failed
      if (template.jsonPath) {
        console.log('Using jsonPath property:', template.jsonPath);
        const jsonData = await loadTemplateJson(template.jsonPath);
        if (jsonData) {
          // Set a small timeout to ensure canvas size is set before loading the JSON
          setTimeout(() => {
            loadFromJSON(jsonData);
            toast.success(`Template "${template.name}" loaded successfully`);
          }, 100);
        } else {
          toast.error(`Failed to load template: ${template.name}`);
        }
      } else {
        console.warn('No template data found');
        toast.error(`No template data found for: ${template.name}`);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error(`Error loading template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-4">
      <IllustratorTemplateUploader onSuccess={refreshTemplates} />

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-border/40 rounded-lg p-3 cursor-pointer hover:border-primary/70 hover:bg-accent transition-colors group"
              onClick={() => handleTemplateClick(template)}
            >
              <div className="aspect-video mb-2 rounded-sm overflow-hidden bg-muted flex items-center justify-center relative">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // If image fails to load, show AI icon instead
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`fallback-icon absolute inset-0 flex items-center justify-center ${template.thumbnailUrl ? 'hidden' : ''}`}>
                  <File className="h-10 w-10 text-sidebar-primary" />
                </div>
              </div>
              <div className="text-sm font-medium">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>{template.size.width} x {template.size.height}</span>
                <span className="capitalize">Illustrator</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-border rounded-md">
          <File className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No Illustrator templates found</p>
          <p className="text-xs text-muted-foreground mt-1">Upload Illustrator files to create templates</p>
        </div>
      )}
    </div>
  );
};

export default AiTemplateGallery;
