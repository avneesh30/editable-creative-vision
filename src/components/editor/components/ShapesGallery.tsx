import React, { useState } from 'react';
import {
  Square,
  CircleIcon,
  Triangle,
  Grid3X3,
  Star as StarIcon,
  Heart,
  Hexagon,
  Pentagon,
  Octagon,
  PlusSquare,
  Diamond,
  MessageSquare,
  MessageCircle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Award,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ScrollArea } from '../../../components/ui/scroll-area';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';

const ShapesGallery = ({ addShape }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('basic');

  // Shape categories
  const shapeCategories = [
    { id: 'basic', name: 'Basic' },
    { id: 'geometric', name: 'Geometric' },
    { id: 'arrows', name: 'Arrows' },
    { id: 'callouts', name: 'Callouts' },
    { id: 'special', name: 'Special' }
  ];

  // Define shape collections
  const shapes: any = {
    basic: [
      { id: 'rectangle', name: 'Rectangle', icon: <Square className="h-10 w-10" />, addFn: () => addShape('rect') },
      { id: 'circle', name: 'Circle', icon: <CircleIcon className="h-10 w-10" />, addFn: () => addShape('circle') },
      { id: 'triangle', name: 'Triangle', icon: <Triangle className="h-10 w-10" />, addFn: () => addShape('triangle') },
      { id: 'diamond', name: 'Diamond', icon: <div className="h-10 w-10 border-2 border-foreground rotate-45"></div>, addFn: () => addShape('diamond') },
      { id: 'ellipse', name: 'Ellipse', icon: <div className="h-8 w-10 border-2 border-foreground rounded-full"></div>, addFn: () => addShape('ellipse') },
      { id: 'square', name: 'Square', icon: <div className="h-9 w-9 border-2 border-foreground"></div>, addFn: () => addShape('square') }
    ],
    geometric: [
      { id: 'pentagon', name: 'Pentagon', icon: <Pentagon className="h-10 w-10" />, addFn: () => addShape('pentagon') },
      { id: 'hexagon', name: 'Hexagon', icon: <Hexagon className="h-10 w-10" />, addFn: () => addShape('hexagon') },
      { id: 'octagon', name: 'Octagon', icon: <Octagon className="h-10 w-10" />, addFn: () => addShape('octagon') },
      { id: 'star', name: 'Star', icon: <StarIcon className="h-10 w-10" />, addFn: () => addShape('star') },
      { id: 'heart', name: 'Heart', icon: <Heart className="h-10 w-10" />, addFn: () => addShape('heart') },
      { id: 'grid', name: 'Grid', icon: <Grid3X3 className="h-10 w-10" />, addFn: () => addShape('grid') }
    ],
    arrows: [
      { id: 'arrow-right', name: 'Right Arrow', icon: <ArrowRight className="h-10 w-10" />, addFn: () => addShape('arrow', { direction: 'right' }) },
      { id: 'arrow-left', name: 'Left Arrow', icon: <ArrowLeft className="h-10 w-10" />, addFn: () => addShape('arrow', { direction: 'left' }) },
      { id: 'arrow-up', name: 'Up Arrow', icon: <ArrowUp className="h-10 w-10" />, addFn: () => addShape('arrow', { direction: 'up' }) },
      { id: 'arrow-down', name: 'Down Arrow', icon: <ArrowDown className="h-10 w-10" />, addFn: () => addShape('arrow', { direction: 'down' }) },
      { id: 'double-arrow', name: 'Double Arrow', icon: <MoreHorizontal className="h-10 w-10" />, addFn: () => addShape('arrow', { type: 'double' }) }
    ],
    callouts: [
      { id: 'message-square', name: 'Square Callout', icon: <MessageSquare className="h-10 w-10" />, addFn: () => addShape('callout', { type: 'square' }) },
      { id: 'message-circle', name: 'Round Callout', icon: <MessageCircle className="h-10 w-10" />, addFn: () => addShape('callout', { type: 'circle' }) }
    ],
    special: [
      { id: 'plus', name: 'Plus', icon: <PlusSquare className="h-10 w-10" />, addFn: () => addShape('plus') },
      { id: 'award', name: 'Badge', icon: <Award className="h-10 w-10" />, addFn: () => addShape('badge') }
    ]
  };

  // Filter shapes based on search query
  const getFilteredShapes = () => {
    if (!searchQuery.trim()) {
      return shapes[activeCategory] || [];
    }

    // Search across all categories
    const query = searchQuery.toLowerCase();
    const results: any = [];

    Object.values(shapes).forEach((categoryShapes: any) => {
      categoryShapes.forEach((shape: any) => {
        if (shape.name.toLowerCase().includes(query)) {
          results.push(shape);
        }
      });
    });

    return results;
  };

  const filteredShapes = getFilteredShapes();

  return (
    <div className="space-y-4">
      {/* Search shapes */}
      <Input
        type="text"
        placeholder="Search shapes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      {!searchQuery && (
        <div className="flex flex-wrap gap-2 mb-4">
          {shapeCategories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={activeCategory === category.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.id)}
              className="text-xs"
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      {/* Shapes grid */}
      <div className="grid grid-cols-3 gap-3">
        {filteredShapes.map((shape: any) => (
          <div
            key={shape.id}
            className="aspect-square border border-border rounded-md p-2 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-accent transition-colors"
            onClick={shape.addFn}
          >
            {shape.icon}
            <span className="text-xs mt-2 text-muted-foreground">{shape.name}</span>
          </div>
        ))}

        {filteredShapes.length === 0 && (
          <div className="col-span-3 py-8 text-center text-muted-foreground">
            <p>No shapes found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapesGallery;