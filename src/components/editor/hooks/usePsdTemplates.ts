import { useCallback } from 'react';
import { usePsdLoader } from './usePsdLoader';
import { useAiFileProcessor } from './useAiFileProcessor';
import { useTemplateManager } from './useTemplateManager';
import { PsdTemplate, UserTemplate } from '../types';
import { fetchTemplatesFromFolder, saveTemplateToFolder } from '../services/templateService';
import { toast } from 'sonner';
import { useEditor } from '../context';

export const usePsdTemplates = () => {
  const { loadPsdTemplate } = usePsdLoader();
  const { processAiTemplate } = useAiFileProcessor();
  const { 
    getUserTemplates,
    loadDemoTemplate, 
    loadUserTemplate,
    saveAsTemplate,
    deleteUserTemplate,
    loadTemplateFromFolder
  } = useTemplateManager();
  const { canvas } = useEditor();

  // Get PSD templates from both demo templates and folder templates
  const getPsdTemplates = useCallback(async (): Promise<PsdTemplate[]> => {
    // Get templates from folder
    const folderTemplates = await fetchTemplatesFromFolder();
    
    // Filter for PSD-specific uploads
    return folderTemplates.filter(template => template.category === 'psd-uploads');
  }, []);

  // Get AI Templates
  const getAiTemplates = useCallback(async () => {
    try {
      console.log('Getting AI templates from API...');
      // Fetch Illustrator templates from your API or local storage
      const templates = await fetch('/api/ai-templates');
      
      // If the fetch fails, use mock data for development
      if (!templates.ok) {
        console.log('Using mock AI templates instead');
        // Return mock data for development
        return [
          {
            id: 'ai-template-1',
            name: 'Business Card Template',
            thumbnailUrl: '/lovable-uploads/54506c70-0578-4d43-a881-f50297a71f1d.png',
            demoUrl: '/lovable-uploads/54506c70-0578-4d43-a881-f50297a71f1d.png',
            size: {
              width: 300,
              height: 150
            },
            category: 'business',
            canvasJson: JSON.stringify({
              version: '5.3.0',
              objects: [
                {
                  type: 'rect',
                  width: 300,
                  height: 150,
                  fill: '#ffffff',
                  stroke: '#000000',
                  strokeWidth: 1
                },
                {
                  type: 'textbox',
                  text: 'Company Name',
                  left: 150,
                  top: 50,
                  fontFamily: 'Arial',
                  fontSize: 20,
                  fill: '#000000',
                  originX: 'center',
                  originY: 'center',
                  textAlign: 'center'
                },
                {
                  type: 'textbox',
                  text: 'Your Name',
                  left: 150,
                  top: 80,
                  fontFamily: 'Arial',
                  fontSize: 14,
                  fill: '#000000',
                  originX: 'center',
                  originY: 'center',
                  textAlign: 'center'
                }
              ]
            })
          },
          {
            id: 'ai-template-2',
            name: 'Poster Template',
            thumbnailUrl: '/lovable-uploads/89a8c18a-9b42-45ad-9750-d77f3180944c.png',
            demoUrl: '/lovable-uploads/89a8c18a-9b42-45ad-9750-d77f3180944c.png',
            size: {
              width: 500,
              height: 700
            },
            category: 'marketing',
            canvasJson: JSON.stringify({
              version: '5.3.0',
              objects: [
                {
                  type: 'rect',
                  width: 500,
                  height: 700,
                  fill: '#f0f0f0',
                  stroke: '#000000',
                  strokeWidth: 0
                },
                {
                  type: 'textbox',
                  text: 'EVENT TITLE',
                  left: 250,
                  top: 200,
                  fontFamily: 'Arial',
                  fontSize: 36,
                  fontWeight: 'bold',
                  fill: '#000000',
                  originX: 'center',
                  originY: 'center',
                  textAlign: 'center'
                }
              ]
            })
          }
        ];
      }
      
      const data = await templates.json();
      console.log('Received AI templates:', data);
      return data;
    } catch (error) {
      console.error('Error fetching AI templates:', error);
      // Return empty array on error
      return [];
    }
  }, []);

  // Upload and convert PSD file to template
  const uploadPsdAsTemplate = useCallback(async (file: File): Promise<boolean> => {
    try {
      // First load the PSD into the canvas
      const loadResult = await loadPsdTemplate(file);
      if (!loadResult || !canvas) {
        toast.error("Failed to load PSD file for template creation");
        return false;
      }

      // Generate thumbnail from the canvas
      const thumbnailUrl = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.7,
        multiplier: 0.5,
      });

      // Generate JSON from the canvas including all object properties
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
        category: 'psd-uploads'
      };

      console.log('Saving PSD template:', templateData);

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
      console.error("Error uploading PSD as template:", error);
      toast.error(`Error creating template: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }, [loadPsdTemplate, canvas]);

  return {
    loadPsdTemplate,
    processAiTemplate,
    getPsdTemplates,
    getAiTemplates,
    getUserTemplates,
    loadDemoTemplate,
    loadUserTemplate,
    saveAsTemplate,
    deleteUserTemplate,
    loadTemplateFromFolder,
    uploadPsdAsTemplate
  };
};

export default usePsdTemplates;
