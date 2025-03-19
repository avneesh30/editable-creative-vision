import { useCallback, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useEditor } from '../context';
import { PsdTemplate, UserTemplate } from '../types';
import { toast } from 'sonner';
import { 
  loadTemplateJson, 
  fetchTemplatesFromFolder, 
  // fetchPexelsTemplates 
} from '../services/templateService';

export const useTemplateManager = () => {
  const { canvas, setCanvasSize, saveToHistory } = useEditor();
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const [pexelsTemplates, setPexelsTemplates] = useState<PsdTemplate[]>([]);
  const [pexelsLoading, setPexelsLoading] = useState<boolean>(false);
  const [pexelsPage, setPexelsPage] = useState<number>(1);
  const [pexelsCategory, setPexelsCategory] = useState<string>('nature');

  useEffect(() => {
    const savedTemplates = localStorage.getItem('userTemplates');
    if (savedTemplates) {
      try {
        setUserTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error('Error loading user templates:', error);
        localStorage.removeItem('userTemplates');
      }
    }
  }, []);

  useEffect(() => {
    if (userTemplates.length > 0) {
      localStorage.setItem('userTemplates', JSON.stringify(userTemplates));
    }
  }, [userTemplates]);

  // const loadPexelsTemplates = useCallback(async (category: string = pexelsCategory, page: number = 1, append: boolean = false) => {
  //   try {
  //     setPexelsLoading(true);
  //     const templates = await fetchPexelsTemplates(category, page);
      
  //     if (append) {
  //       setPexelsTemplates(prev => [...prev, ...templates]);
  //     } else {
  //       setPexelsTemplates(templates);
  //     }
      
  //     setPexelsCategory(category);
  //     setPexelsPage(page);
  //     return templates;
  //   } catch (error) {
  //     console.error('Error loading Pexels templates:', error);
  //     toast.error(`Failed to load templates from Pexels: ${error instanceof Error ? error.message : 'Unknown error'}`);
  //     return [];
  //   } finally {
  //     setPexelsLoading(false);
  //   }
  // }, [pexelsCategory]);

    // const loadMorePexelsTemplates = useCallback(() => {
    //   return loadPexelsTemplates(pexelsCategory, pexelsPage + 1, true);
    // }, [loadPexelsTemplates, pexelsCategory, pexelsPage]);

  // const changePexelsCategory = useCallback((category: string) => {
  //   return loadPexelsTemplates(category, 1, false);
  // }, [loadPexelsTemplates]);

  const getPsdTemplates = useCallback((): PsdTemplate[] => {
    return [
      {
        id: 'psd-template-1',
        name: 'Business Card Template',
        thumbnailUrl: '/psd-templates/business-card-thumb.jpg',
        demoUrl: '/psd-templates/business-card-demo.jpg',
        size: { width: 1050, height: 600 },
        category: 'cards'
      },
      {
        id: 'psd-template-2',
        name: 'Social Media Post',
        thumbnailUrl: '/psd-templates/social-post-thumb.jpg',
        demoUrl: '/psd-templates/social-post-demo.jpg',
        size: { width: 1080, height: 1080 },
        category: 'social'
      },
      {
        id: 'psd-template-3',
        name: 'Website Banner',
        thumbnailUrl: '/psd-templates/banner-thumb.jpg',
        demoUrl: '/psd-templates/banner-demo.jpg',
        size: { width: 1200, height: 300 },
        category: 'banners'
      },
      {
        id: 'psd-template-4',
        name: 'Company Logo',
        thumbnailUrl: '/psd-templates/logo-thumb.jpg',
        demoUrl: '/psd-templates/logo-demo.jpg',
        size: { width: 500, height: 500 },
        category: 'logos'
      },
      {
        id: 'psd-template-5',
        name: 'Email Newsletter',
        thumbnailUrl: '/psd-templates/email-thumb.jpg',
        demoUrl: '/psd-templates/email-demo.jpg',
        size: { width: 600, height: 800 },
        category: 'emails'
      }
    ];
  }, []);

  const getUserTemplates = useCallback((): UserTemplate[] => {
    return userTemplates;
  }, [userTemplates]);

  // const getPexelsTemplates = useCallback((): {
  //   templates: PsdTemplate[],
  //   loading: boolean,
  //   loadMore: () => Promise<PsdTemplate[]>,
  //   changeCategory: (category: string) => Promise<PsdTemplate[]>,
  //   currentCategory: string
  // } => {
  //   return {
  //     templates: pexelsTemplates,
  //     loading: pexelsLoading,
  //     loadMore: loadMorePexelsTemplates,
  //     changeCategory: changePexelsCategory,
  //     currentCategory: pexelsCategory
  //   };
  // }, [pexelsTemplates, pexelsLoading, loadMorePexelsTemplates, changePexelsCategory, pexelsCategory]);

  const saveAsTemplate = useCallback((name: string, category: string, thumbnailUrl?: string) => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return false;
    }

    try {
      const generatedThumbnailUrl = thumbnailUrl || canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8,
        multiplier: 0.5,
      });

      const newTemplate: UserTemplate = {
        id: `user-template-${Date.now()}`,
        name,
        category,
        thumbnailUrl: generatedThumbnailUrl,
        size: {
          width: canvas.width || 0,
          height: canvas.height || 0
        },
        canvasJson: JSON.stringify(canvas.toJSON(['id', 'name'])),
        dateCreated: new Date().toISOString()
      };

      setUserTemplates(prev => [...prev, newTemplate]);
      
      toast.success(`Template "${name}" saved successfully`);
      return true;
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error(`Failed to save template: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }, [canvas]);

  const deleteUserTemplate = useCallback((templateId: string) => {
    setUserTemplates(prev => prev.filter(template => template.id !== templateId));
    toast.success("Template deleted successfully");
  }, []);

  const loadDemoTemplate = useCallback((template: PsdTemplate) => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return;
    }
    
    setCanvasSize(template.size);
    
    canvas.clear();
    
    try {
      fabric.Image.fromURL(template.demoUrl, (img) => {
        if (!img) {
          console.error(`Failed to load image from ${template.demoUrl}`);
          toast.error(`Failed to load template image. Please try another template.`);
          return;
        }
        
        const scale = Math.min(
          template.size.width / (img.width || 1),
          template.size.height / (img.height || 1)
        );
        
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (template.size.width - (img.width || 0) * scale) / 2,
          top: (template.size.height - (img.height || 0) * scale) / 2,
          selectable: true
        });
        
        canvas.add(img);
        canvas.renderAll();
        saveToHistory(canvas);
        toast.success(`Template "${template.name}" loaded successfully`);
      }, { 
        crossOrigin: 'anonymous'
      });
    } catch (error) {
      console.error("Error loading template image:", error);
      toast.error(`Failed to load template image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [canvas, setCanvasSize, saveToHistory]);

  const loadPexelsTemplate = useCallback((template: PsdTemplate) => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return;
    }
    
    setCanvasSize(template.size);
    
    canvas.clear();
    
    try {
      fabric.Image.fromURL(template.demoUrl, (img) => {
        if (!img) {
          console.error(`Failed to load image from ${template.demoUrl}`);
          toast.error(`Failed to load template image. Please try another template.`);
          return;
        }
        
        const scale = Math.min(
          template.size.width / (img.width || 1),
          template.size.height / (img.height || 1)
        );
        
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (template.size.width - (img.width || 0) * scale) / 2,
          top: (template.size.height - (img.height || 0) * scale) / 2,
          selectable: true,
          hasControls: true,
          hasBorders: true
        });
        
        canvas.add(img);
        canvas.renderAll();
        saveToHistory(canvas);
        
        if (template.photographer) {
          toast.success(
            `Photo by ${template.photographer} on Pexels`
          );
        } else {
          toast.success(`Template "${template.name}" loaded successfully`);
        }
      }, { 
        crossOrigin: 'anonymous'
      });
    } catch (error) {
      console.error("Error loading Pexels template:", error);
      toast.error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [canvas, setCanvasSize, saveToHistory]);

  const loadTemplateFromFolder = useCallback(async (template: PsdTemplate) => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return;
    }
    
    setCanvasSize(template.size);
    
    canvas.clear();
    
    try {
      if (template.jsonPath) {
        const templateJson = await loadTemplateJson(template.jsonPath);
        
        if (templateJson) {
          canvas.loadFromJSON(templateJson, () => {
            canvas.renderAll();
            saveToHistory(canvas);
            toast.success(`Template "${template.name}" loaded successfully`);
          });
          return;
        }
      }
      
      fabric.Image.fromURL(template.demoUrl || template.thumbnailUrl, (img) => {
        if (!img) {
          console.error(`Failed to load image from ${template.thumbnailUrl}`);
          toast.error(`Failed to load template image. Please try another template.`);
          return;
        }
        
        const scale = Math.min(
          template.size.width / (img.width || 1),
          template.size.height / (img.height || 1)
        );
        
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (template.size.width - (img.width || 0) * scale) / 2,
          top: (template.size.height - (img.height || 0) * scale) / 2,
          selectable: true
        });
        
        canvas.add(img);
        canvas.renderAll();
        saveToHistory(canvas);
        toast.success(`Template "${template.name}" loaded successfully`);
      }, { 
        crossOrigin: 'anonymous'
      });
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [canvas, setCanvasSize, saveToHistory]);

  const loadUserTemplate = useCallback((template: UserTemplate) => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return;
    }
    
    setCanvasSize(template.size);
    
    canvas.clear();
    
    try {
      if (template.canvasJson) {
        canvas.loadFromJSON(template.canvasJson, () => {
          canvas.renderAll();
          saveToHistory(canvas);
          toast.success(`Template "${template.name}" loaded successfully`);
        });
      } else {
        fabric.Image.fromURL(template.thumbnailUrl, (img) => {
          if (!img) {
            console.error(`Failed to load image from ${template.thumbnailUrl}`);
            toast.error(`Failed to load template image. Please try another template.`);
            return;
          }
          
          const scale = Math.min(
            template.size.width / (img.width || 1),
            template.size.height / (img.height || 1)
          );
          
          img.set({
            scaleX: scale,
            scaleY: scale,
            left: (template.size.width - (img.width || 0) * scale) / 2,
            top: (template.size.height - (img.height || 0) * scale) / 2,
            selectable: true
          });
          
          canvas.add(img);
          canvas.renderAll();
          saveToHistory(canvas);
          toast.success(`Template "${template.name}" loaded successfully`);
        }, { 
          crossOrigin: 'anonymous'
        });
      }
    } catch (error) {
      console.error("Error loading user template:", error);
      toast.error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [canvas, setCanvasSize, saveToHistory]);

  // useEffect(() => {
  //   loadPexelsTemplates('nature', 1, false);
  // }, [loadPexelsTemplates]);

  return {
    getPsdTemplates,
    getUserTemplates,
    // getPexelsTemplates,
    loadDemoTemplate,
    loadPexelsTemplate,
    loadUserTemplate,
    saveAsTemplate,
    deleteUserTemplate,
    loadTemplateFromFolder
  };
};

export default useTemplateManager;
