
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Star, Flag, CreditCard, Mail, Image as ImageIcon, Grid, Layers, Globe } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface TemplateCategorySelectorProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const TemplateCategorySelector: React.FC<TemplateCategorySelectorProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        size="sm"
        variant={activeCategory === 'all' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('all')}
        className={cn(
          "text-xs flex gap-1 items-center transition-all duration-300",
          activeCategory === 'all' ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
        )}
      >
        <Grid className="h-3 w-3" />
        All
      </Button>
      <Button
        size="sm"
        variant={activeCategory === 'logos' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('logos')}
        className={cn(
          "text-xs flex gap-1 items-center transition-all duration-300",
          activeCategory === 'logos' ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
        )}
      >
        <Star className="h-3 w-3" />
        Logos
      </Button>
      <Button
        size="sm"
        variant={activeCategory === 'banners' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('banners')}
        className={cn(
          "text-xs flex gap-1 items-center transition-all duration-300",
          activeCategory === 'banners' ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
        )}
      >
        <Flag className="h-3 w-3" />
        Banners
      </Button>
      <Button
        size="sm"
        variant={activeCategory === 'cards' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('cards')}
        className={cn(
          "text-xs flex gap-1 items-center transition-all duration-300",
          activeCategory === 'cards' ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
        )}
      >
        <CreditCard className="h-3 w-3" />
        Cards
      </Button>
      <Button
        size="sm"
        variant={activeCategory === 'backgrounds' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('backgrounds')}
        className={cn(
          "text-xs flex gap-1 items-center transition-all duration-300",
          activeCategory === 'backgrounds' ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
        )}
      >
        <Layers className="h-3 w-3" />
        Backgrounds
      </Button>
      <Button
        size="sm"
        variant={activeCategory === 'websites' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('websites')}
        className={cn(
          "text-xs flex gap-1 items-center transition-all duration-300",
          activeCategory === 'websites' ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
        )}
      >
        <Globe className="h-3 w-3" />
        Websites
      </Button>
      <Button
        size="sm"
        variant={activeCategory === 'emails' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('emails')}
        className={cn(
          "text-xs flex gap-1 items-center transition-all duration-300",
          activeCategory === 'emails' ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
        )}
      >
        <Mail className="h-3 w-3" />
        Emails
      </Button>
      <Button
        size="sm"
        variant={activeCategory === 'social' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('social')}
        className={cn(
          "text-xs flex gap-1 items-center transition-all duration-300",
          activeCategory === 'social' ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
        )}
      >
        <ImageIcon className="h-3 w-3" />
        Social
      </Button>
    </div>
  );
};

export default TemplateCategorySelector;
