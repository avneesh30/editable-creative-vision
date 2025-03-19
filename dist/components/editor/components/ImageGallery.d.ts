import React from 'react';
interface ImageGalleryProps {
    onImageSelect: (url: string) => void;
}
declare const ImageGallery: React.FC<ImageGalleryProps>;
export default ImageGallery;
