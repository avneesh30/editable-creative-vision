
import React, { useState, useEffect } from 'react';
import { PsdTemplate, UserTemplate } from '../types';
import usePsdTemplates from '../hooks/usePsdTemplates';
import { Button } from '../../../components/ui/button';
import {
  Upload,
  FolderOpen,
  List,
  Grid,
  Star,
  Flag,
  CreditCard,
  Mail,
  Image as ImageIcon,
  Save,
  Plus,
  Trash2,
  Layers,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import FileUploader from './FileUploader';
import SaveTemplateDialog from './SaveTemplateDialog';
import { useEditor } from '../context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

const PsdTemplateGallery: React.FC = () => {
  const { getPsdTemplates, getUserTemplates, loadDemoTemplate, loadUserTemplate, deleteUserTemplate, loadTemplateFromFolder } = usePsdTemplates();
  const [templates, setTemplates] = useState<PsdTemplate[]>([]);
  const userTemplates = getUserTemplates();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [templateCategory, setTemplateCategory] = useState<string>('all');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { canvas } = useEditor();

  // Load templates when component mounts
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await getPsdTemplates();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast.error('Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [getPsdTemplates]);

  // Categorize templates
  const templateCategories = {
    all: templates,
    logos: templates.filter(t => t.category === 'logos'),
    banners: templates.filter(t => t.category === 'banners'),
    cards: templates.filter(t => t.category === 'cards'),
    emails: templates.filter(t => t.category === 'emails'),
    social: templates.filter(t => t.category === 'social'),
    websites: templates.filter(t => t.category === 'websites'),
    backgrounds: templates.filter(t => t.category === 'backgrounds')
  };

  // Categorize user templates
  const userTemplateCategories = {
    all: userTemplates,
    logos: userTemplates.filter(t => t.category === 'logos'),
    banners: userTemplates.filter(t => t.category === 'banners'),
    cards: userTemplates.filter(t => t.category === 'cards'),
    emails: userTemplates.filter(t => t.category === 'emails'),
    social: userTemplates.filter(t => t.category === 'social'),
    custom: userTemplates.filter(t => t.category === 'custom')
  };

  const handleTemplateClick = async (template: PsdTemplate) => {
    toast.info(`Loading template: ${template.name}...`);

    // Use the new loadTemplateFromFolder function for templates with jsonPath
    if (template.jsonPath) {
      await loadTemplateFromFolder(template);
    } else {
      // Use the original loadDemoTemplate for older templates
      loadDemoTemplate(template);
    }
  };

  const handleUserTemplateClick = (template: UserTemplate) => {
    toast.info(`Loading template: ${template.name}...`);
    loadUserTemplate(template);
  };

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTemplateId(templateId);
  };

  const confirmDelete = () => {
    if (deleteTemplateId) {
      deleteUserTemplate(deleteTemplateId);
      setDeleteTemplateId(null);
    }
  };

  const filteredTemplates = templateCategories[templateCategory as keyof typeof templateCategories] || templateCategories.all;
  const filteredUserTemplates = userTemplateCategories[templateCategory as keyof typeof userTemplateCategories] || userTemplateCategories.all;

  return (
    <div className="space-y-4">
      <FileUploader
        acceptedTypes=".psd,.png,.jpg,.jpeg,.svg,.fig"
        maxSizeMB={10}
      />

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Templates</h3>
        <div className="flex space-x-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="demo">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo">Templates</TabsTrigger>
          <TabsTrigger value="user">My Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="demo">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              size="sm"
              variant={templateCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setTemplateCategory('all')}
              className="text-xs flex gap-1 items-center"
            >
              <Grid className="h-3 w-3" />
              All
            </Button>
            <Button
              size="sm"
              variant={templateCategory === 'logos' ? 'default' : 'outline'}
              onClick={() => setTemplateCategory('logos')}
              className="text-xs flex gap-1 items-center"
            >
              <Star className="h-3 w-3" />
              Logos
            </Button>
            <Button
              size="sm"
              variant={templateCategory === 'banners' ? 'default' : 'outline'}
              onClick={() => setTemplateCategory('banners')}
              className="text-xs flex gap-1 items-center"
            >
              <Flag className="h-3 w-3" />
              Banners
            </Button>
            <Button
              size="sm"
              variant={templateCategory === 'cards' ? 'default' : 'outline'}
              onClick={() => setTemplateCategory('cards')}
              className="text-xs flex gap-1 items-center"
            >
              <CreditCard className="h-3 w-3" />
              Cards
            </Button>
            <Button
              size="sm"
              variant={templateCategory === 'backgrounds' ? 'default' : 'outline'}
              onClick={() => setTemplateCategory('backgrounds')}
              className="text-xs flex gap-1 items-center"
            >
              <Layers className="h-3 w-3" />
              Backgrounds
            </Button>
            <Button
              size="sm"
              variant={templateCategory === 'websites' ? 'default' : 'outline'}
              onClick={() => setTemplateCategory('websites')}
              className="text-xs flex gap-1 items-center"
            >
              <Globe className="h-3 w-3" />
              Websites
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-border rounded-md p-3 cursor-pointer hover:border-primary hover:bg-accent transition-colors"
                  onClick={() => handleTemplateClick(template)}
                >
                  <div className="aspect-video mb-2 rounded-sm overflow-hidden bg-muted flex items-center justify-center">
                    {template.thumbnailUrl ? (
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, show category icon instead
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`fallback-icon text-primary ${template.thumbnailUrl ? 'hidden' : ''}`}>
                      {template.category === 'logos' && <Star className="h-10 w-10" />}
                      {template.category === 'banners' && <Flag className="h-10 w-10" />}
                      {template.category === 'cards' && <CreditCard className="h-10 w-10" />}
                      {template.category === 'emails' && <Mail className="h-10 w-10" />}
                      {template.category === 'social' && <ImageIcon className="h-10 w-10" />}
                      {template.category === 'websites' && <Globe className="h-10 w-10" />}
                      {template.category === 'backgrounds' && <Layers className="h-10 w-10" />}
                      {!template.category && <ImageIcon className="h-10 w-10" />}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {template.size.width} x {template.size.height}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2">Thumbnail</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Size</th>
                    <th className="text-left p-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.map((template) => (
                    <tr
                      key={template.id}
                      className="border-t cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleTemplateClick(template)}
                    >
                      <td className="p-2">
                        <div className="w-16 h-12 rounded-sm overflow-hidden bg-muted flex items-center justify-center">
                          {template.thumbnailUrl ? (
                            <img
                              src={template.thumbnailUrl}
                              alt={template.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`fallback-icon text-primary ${template.thumbnailUrl ? 'hidden' : ''}`}>
                            {template.category === 'logos' && <Star className="h-6 w-6" />}
                            {template.category === 'banners' && <Flag className="h-6 w-6" />}
                            {template.category === 'cards' && <CreditCard className="h-6 w-6" />}
                            {template.category === 'emails' && <Mail className="h-6 w-6" />}
                            {template.category === 'social' && <ImageIcon className="h-6 w-6" />}
                            {!template.category && <ImageIcon className="h-6 w-6" />}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 font-medium">{template.name}</td>
                      <td className="p-2 text-muted-foreground">
                        {template.size.width} x {template.size.height}
                      </td>
                      <td className="p-2 text-muted-foreground capitalize">
                        {template.category || 'Other'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="user">
          {userTemplates.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  size="sm"
                  variant={templateCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setTemplateCategory('all')}
                  className="text-xs flex gap-1 items-center"
                >
                  <Grid className="h-3 w-3" />
                  All
                </Button>
                <Button
                  size="sm"
                  variant={templateCategory === 'custom' ? 'default' : 'outline'}
                  onClick={() => setTemplateCategory('custom')}
                  className="text-xs flex gap-1 items-center"
                >
                  <ImageIcon className="h-3 w-3" />
                  Custom
                </Button>
                <Button
                  size="sm"
                  variant={templateCategory === 'logos' ? 'default' : 'outline'}
                  onClick={() => setTemplateCategory('logos')}
                  className="text-xs flex gap-1 items-center"
                >
                  <Star className="h-3 w-3" />
                  Logos
                </Button>
                <Button
                  size="sm"
                  variant={templateCategory === 'banners' ? 'default' : 'outline'}
                  onClick={() => setTemplateCategory('banners')}
                  className="text-xs flex gap-1 items-center"
                >
                  <Flag className="h-3 w-3" />
                  Banners
                </Button>
                <Button
                  size="sm"
                  variant={templateCategory === 'cards' ? 'default' : 'outline'}
                  onClick={() => setTemplateCategory('cards')}
                  className="text-xs flex gap-1 items-center"
                >
                  <CreditCard className="h-3 w-3" />
                  Cards
                </Button>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredUserTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-border rounded-md p-3 cursor-pointer hover:border-primary hover:bg-accent transition-colors relative"
                      onClick={() => handleUserTemplateClick(template)}
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6 opacity-70 hover:opacity-100"
                          onClick={(e) => handleDeleteTemplate(template.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="aspect-video mb-2 rounded-sm overflow-hidden bg-muted flex items-center justify-center">
                        {template.thumbnailUrl ? (
                          <img
                            src={template.thumbnailUrl}
                            alt={template.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`fallback-icon text-primary ${template.thumbnailUrl ? 'hidden' : ''}`}>
                          {template.category === 'logos' && <Star className="h-10 w-10" />}
                          {template.category === 'banners' && <Flag className="h-10 w-10" />}
                          {template.category === 'cards' && <CreditCard className="h-10 w-10" />}
                          {template.category === 'emails' && <Mail className="h-10 w-10" />}
                          {template.category === 'social' && <ImageIcon className="h-10 w-10" />}
                          {template.category === 'custom' && <ImageIcon className="h-10 w-10" />}
                          {!template.category && <ImageIcon className="h-10 w-10" />}
                        </div>
                      </div>
                      <div className="text-sm font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {template.size.width} x {template.size.height}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-2">Thumbnail</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Size</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUserTemplates.map((template) => (
                        <tr
                          key={template.id}
                          className="border-t cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleUserTemplateClick(template)}
                        >
                          <td className="p-2">
                            <div className="w-16 h-12 rounded-sm overflow-hidden bg-muted flex items-center justify-center">
                              {template.thumbnailUrl ? (
                                <img
                                  src={template.thumbnailUrl}
                                  alt={template.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`fallback-icon text-primary ${template.thumbnailUrl ? 'hidden' : ''}`}>
                                {template.category === 'logos' && <Star className="h-6 w-6" />}
                                {template.category === 'banners' && <Flag className="h-6 w-6" />}
                                {template.category === 'cards' && <CreditCard className="h-6 w-6" />}
                                {template.category === 'emails' && <Mail className="h-6 w-6" />}
                                {template.category === 'social' && <ImageIcon className="h-6 w-6" />}
                                {template.category === 'custom' && <ImageIcon className="h-6 w-6" />}
                                {!template.category && <ImageIcon className="h-6 w-6" />}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 font-medium">{template.name}</td>
                          <td className="p-2 text-muted-foreground">
                            {template.size.width} x {template.size.height}
                          </td>
                          <td className="p-2 text-muted-foreground capitalize">
                            {template.category || 'Custom'}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-7 w-7"
                              onClick={(e) => handleDeleteTemplate(template.id, e)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs flex gap-1 items-center w-full"
                  onClick={() => setSaveDialogOpen(true)}
                  disabled={!canvas}
                >
                  <Save className="h-3 w-3" />
                  Save Current Design as Template
                </Button>
              </div>
            </>
          ) : (
            <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
              <FolderOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">No Templates Found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Save your designs as templates to access them here
              </p>
              <div className="flex gap-2 mt-4 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs flex gap-1 items-center"
                  onClick={() => setSaveDialogOpen(true)}
                  disabled={!canvas}
                >
                  <Save className="h-3 w-3" />
                  Save Current Design
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <SaveTemplateDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
      />

      <AlertDialog open={!!deleteTemplateId} onOpenChange={() => setDeleteTemplateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this template.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PsdTemplateGallery;
