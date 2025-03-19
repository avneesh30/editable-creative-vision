import React, { useState, useEffect } from 'react';
import {
  Image,
  Search,
  RefreshCw,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import FileUploader from './FileUploader';

// Image Gallery component for the Sidebar
const ImageGallery = ({ onImageSelect }: any) => {
  const [images, setImages] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<any>(null);

  // Your Unsplash API Access Key
  const UNSPLASH_ACCESS_KEY = '55vVhZ-tFehN51yXwGIoDveBQRovUM50ZZptfPhdtRU';

  // Load initial images when component mounts
  useEffect(() => {
    fetchImages(false);
  }, []);

  // Function to fetch images from Unsplash
  const fetchImages = async (isNewSearch = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const newPage = isNewSearch ? 1 : page + 1;
      const perPage = 6; // Number of images per page

      let url;
      if (searchQuery && isNewSearch) {
        // Search endpoint
        url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&page=${newPage}&per_page=${perPage}`;
      } else {
        // Random photos endpoint
        url = `https://api.unsplash.com/photos?page=${newPage}&per_page=${perPage}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();

      // Process the response
      const newImages = searchQuery && isNewSearch
        ? data.results.map((image: any) => ({
          id: image.id,
          url: image.urls.regular,
          thumb: image.urls.thumb,
          description: image.alt_description || image.description || 'Unsplash image',
          user: {
            name: image.user.name,
            username: image.user.username
          }
        }))
        : data.map((image: any) => ({
          id: image.id,
          url: image.urls.regular,
          thumb: image.urls.thumb,
          description: image.alt_description || image.description || 'Unsplash image',
          user: {
            name: image.user.name,
            username: image.user.username
          }
        }));

      if (isNewSearch) {
        setImages(newImages);
        setPage(1);
      } else {
        setImages((prev: any) => [...prev, ...newImages]);
        setPage(newPage);
      }

      // Check if there are more images to load
      const totalPages = searchQuery ? data.total_pages : 100; // Unsplash limits to 100 pages
      setHasMore(newPage < totalPages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError("Failed to fetch images from Unsplash.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search submit
  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchImages(true); // Start a new search
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    fetchImages(false); // Load next page
  };

  // Handle selecting an image
  const handleImageSelect = (image: any) => {
    onImageSelect(image.url);
  };

  return (
    <div className="space-y-4">
      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading && searchQuery ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-2">
        {images.map((image: any) => (
          <div
            key={image.id}
            className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
            onClick={() => handleImageSelect(image)}
          >
            <img
              src={image.thumb}
              alt={image.description}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
              <Plus className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-50 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
              Photo by {image.user.name}
            </div>
          </div>
        ))}
      </div>

      {/* Loading state - show when initial load is happening and grid is empty */}
      {isLoading && images.length === 0 && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No images found. Try a different search term.</p>
        </div>
      )}

      {/* Load more button */}
      {images.length > 0 && hasMore && (
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Load More
            </>
          )}
        </Button>
      )}

      {/* Attribution */}
      <div className="text-xs text-center text-muted-foreground pt-2 pb-4">
        Photos provided by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
      </div>

      {/* File uploader */}
      <div className="pt-4 border-t border-border">
        <FileUploader />
      </div>
    </div>
  );
};

export default ImageGallery;