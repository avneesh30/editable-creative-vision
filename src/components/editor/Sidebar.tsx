
import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Image,
  SquareStack,
  Type,
  Square
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useEditor } from './context';
import { SidebarProps } from './types';
import { useToast } from '../../hooks/use-toast';
import ImageGallery from './components/ImageGallery';
import ShapesGallery from './components/ShapesGallery';
import TemplateGallery from './components/TemplateGallery';

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const [activeTab, setActiveTab] = useState('templates');
  const {
    addImage,
    addText,
    addRect,
    addCircle,
    addTriangle,
    addShape
  } = useEditor();
  const { toast } = useToast();

  const handleImageAdd = (url: string) => {
    addImage(url);
  };

  // Text styles for the text tab
  const textStyles = [
    {
      label: 'Heading',
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left'
    },
    {
      label: 'Subheading',
      fontSize: 24,
      fontWeight: '600',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left'
    },
    {
      label: 'Body',
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left'
    },
    {
      label: 'Caption',
      fontSize: 12,
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left'
    },
    {
      label: 'Quote',
      fontSize: 20,
      fontWeight: 'normal',
      fontFamily: 'Georgia, serif',
      textAlign: 'left',
      fontStyle: "italic" as const,
    },
  ];

  return (
    <div
      className={cn(
        "editor-sidebar panel-transition backdrop-blur-sm bg-sidebar/95 border-r border-border/50 shadow-sm",
        collapsed ? "collapsed w-0" : "w-[290px]"
      )}
    >
      <div className="p-4 border-b border-border/30 bg-gradient-to-r from-sidebar-accent/80 to-sidebar/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h3 className="font-medium text-base bg-gradient-to-r from-sidebar-primary to-sidebar-primary/70 bg-clip-text text-transparent">Design Elements</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 ml-auto text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50 transition-all duration-300"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Tabs
        defaultValue="templates"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-4 p-2 bg-sidebar-accent/30 backdrop-blur-sm sticky top-[57px] z-10 border-b border-border/20">
          <TabsTrigger value="templates" className="text-xs data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground">
            <SquareStack className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="text-xs data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground">
            <Image className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
          <TabsTrigger value="shapes" className="text-xs data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground">
            <Square className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Shapes</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground">
            <Type className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <TabsContent value="templates" className="p-4 animate-fade-in">
            <TemplateGallery />
          </TabsContent>

          <TabsContent value="images" className="p-4 animate-fade-in">
            <ImageGallery
              onImageSelect={(imageUrl: any) => handleImageAdd(imageUrl)}
            />
          </TabsContent>

          <TabsContent value="shapes" className="p-4 animate-fade-in">
            <ShapesGallery
              addShape={(shapeType: any, options: any) => {
                switch (shapeType) {
                  case 'rect':
                    addRect();
                    break;
                  case 'circle':
                    addCircle();
                    break;
                  case 'triangle':
                    addTriangle();
                    break;
                  default:
                    if (typeof addShape === 'function') {
                      addShape(shapeType, options);
                    } else {
                      console.warn('addShape function not available in editor context');
                      if (shapeType === 'square' || shapeType === 'diamond') {
                        addRect();
                      } else if (shapeType === 'ellipse') {
                        addCircle();
                      } else {
                        addRect();
                      }
                    }
                }
              }}
            />
          </TabsContent>

          <TabsContent value="text" className="p-4 animate-fade-in">
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3 text-sidebar-foreground border-b border-border/20 pb-2">Text Styles</h3>
              <div className="grid grid-cols-1 gap-3">
                {textStyles.map((style, index) => (
                  <div
                    key={index}
                    className="border border-border/40 rounded-lg p-3 cursor-pointer hover:border-sidebar-primary/70 hover:bg-sidebar-accent/40 transition-all duration-300"
                    onClick={() => addText(style.label, {
                      fontSize: style.fontSize,
                      fontWeight: style.fontWeight,
                      fontStyle: style.fontStyle || 'normal',
                      fontFamily: style.fontFamily,
                      textAlign: style.textAlign || 'left'
                    })}
                  >
                    <div
                      className="overflow-hidden text-ellipsis"
                      style={{
                        fontSize: `${style.fontSize}px`,
                        fontWeight: style.fontWeight === 'bold' ? 700 :
                          style.fontWeight === 'semibold' ? 600 :
                            style.fontWeight === 'italic' ? 400 : 400,
                        fontStyle: style.fontStyle === 'italic' ? 'italic' : 'normal',
                        fontFamily: style.fontFamily || 'sans-serif'
                      }}
                    >
                      {style.label}
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full text-sm mt-2 bg-gradient-to-r from-sidebar-primary/10 to-sidebar-accent/30 hover:from-sidebar-primary/20 hover:to-sidebar-accent/40 border-border/40 transition-all duration-300"
                  onClick={() => addText("Custom Text")}
                >
                  Add Custom Text
                </Button>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default Sidebar;
