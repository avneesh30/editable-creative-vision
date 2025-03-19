import React from 'react';
type ShapeType = 'rect' | 'circle' | 'triangle' | 'diamond' | 'ellipse' | 'square' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'heart' | 'grid' | 'arrow' | 'callout' | 'plus' | 'badge';
interface ShapeOptions {
    direction?: 'right' | 'left' | 'up' | 'down';
    type?: 'square' | 'circle' | 'double';
}
interface ShapesGalleryProps {
    addShape: (type: ShapeType, options?: ShapeOptions) => void;
}
declare const ShapesGallery: React.FC<ShapesGalleryProps>;
export default ShapesGallery;
