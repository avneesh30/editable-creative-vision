
import React, { useState, useEffect } from 'react';
import { PsdTemplate } from '../types';
import { useEditor } from '../context';
import { Button } from '../../../components/ui/button';
import { Star, Flag, CreditCard, Mail, Image as ImageIcon, Globe, Layers, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { fetchTemplatesByCategory, loadTemplateJson } from '../services/templateService';
import TemplateCategorySelector from './TemplateCategorySelector';

const TemplateGallery: React.FC = () => {
  const [templates, setTemplates] = useState<PsdTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { setCanvasSize, loadFromJSON, setCanvasBackgroundColor } = useEditor();

  // Load templates when component mounts or category changes
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await fetchTemplatesByCategory(activeCategory);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [activeCategory]);

  const handleTemplateClick = async (template: PsdTemplate) => {
    toast.info(`Loading template: ${template.name}...`);

    try {
      // First set the canvas size to match the template
      setCanvasSize(template.size);

      // Set a neutral background color when loading the template
      setCanvasBackgroundColor('#ffffff');

      // If this template has a JSON path, load it
      if (template.jsonPath) {
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
        toast.error(`No template data found for: ${template.name}`);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error(`Error loading template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'logos':
        return <Star className="h-10 w-10 text-sidebar-primary" />;
      case 'banners':
        return <Flag className="h-10 w-10 text-sidebar-primary" />;
      case 'cards':
        return <CreditCard className="h-10 w-10 text-sidebar-primary" />;
      case 'emails':
        return <Mail className="h-10 w-10 text-sidebar-primary" />;
      case 'social':
        return <ImageIcon className="h-10 w-10 text-sidebar-primary" />;
      case 'websites':
        return <Globe className="h-10 w-10 text-sidebar-primary" />;
      case 'backgrounds':
        return <Layers className="h-10 w-10 text-sidebar-primary" />;
      default:
        return <ImageIcon className="h-10 w-10 text-sidebar-primary" />;
    }
  };

  return (
    <div className="space-y-4">
      <TemplateCategorySelector
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                      // If image fails to load, show category icon instead
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`fallback-icon absolute inset-0 flex items-center justify-center ${template.thumbnailUrl ? 'hidden' : ''}`}>
                  {getCategoryIcon(template.category)}
                </div>
              </div>
              <div className="text-sm font-medium">{template.name}</div>
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>{template.size.width} x {template.size.height}</span>
                <span className="capitalize">{template.category}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-border rounded-md">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No templates found in this category</p>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
