import { PsdTemplate, UserTemplate } from '../types';
import { toast } from 'sonner';
import { getTemplatesByCategory, allTemplates } from '../templates';

// Interface for raw template data from folder
interface TemplateData {
  id: string;
  name: string;
  thumbnailPath: string;
  jsonPath?: string;
  category: string;
  size: {
    width: number;
    height: number;
  };
}

// Interface for template save data
interface TemplateSaveData {
  name: string;
  thumbnailUrl: string;
  canvasJson: string;
  size: {
    width: number;
    height: number;
  };
  category: string;
}

// Interface for Pexels API responses
interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page: string;
}

// Function to fetch templates from the templates folder
export const fetchTemplatesFromFolder = async (): Promise<PsdTemplate[]> => {
  try {
    // Get templates from our organized templates structure
    return allTemplates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

// Function to fetch templates by category
export const fetchTemplatesByCategory = async (category: string): Promise<PsdTemplate[]> => {
  try {
    return getTemplatesByCategory(category);
  } catch (error) {
    console.error(`Error fetching templates for category ${category}:`, error);
    return [];
  }
};

// Function to fetch templates from Pexels API
export const fetchPexelsTemplates = async (category: string = 'nature', page: number = 1): Promise<PsdTemplate[]> => {
  try {
    // The Pexels API key should ideally be in a secure location or environment variable
    // For this demo we'll use it directly - but in production you would want this secured
    const PEXELS_API_KEY = '3Ns2jn0eiGtJQUdK0rCLgNQvt7eGZxgY2RHqFJEsXXDHrCYPUWxS8fDZ'; // Replace with your actual API key
    
    // Construct the API URL with the category as the search query
    const response = await fetch(`https://api.pexels.com/v1/search?query=${category}&per_page=15&page=${page}`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API request failed with status ${response.status}`);
    }

    const data: PexelsSearchResponse = await response.json();
    
    // Transform Pexels photos into our template format
    const templates: PsdTemplate[] = data.photos.map(photo => ({
      id: `pexels-${photo.id}`,
      name: photo.alt || `${category.charAt(0).toUpperCase() + category.slice(1)} Template`,
      thumbnailUrl: photo.src.medium,
      demoUrl: photo.src.large,
      size: { 
        width: photo.width > 1200 ? 1200 : photo.width, 
        height: photo.height > 1200 ? 1200 : photo.height 
      },
      category: 'pexels',
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      pexelsUrl: photo.url
    }));

    console.log('Fetched Pexels templates:', templates);
    return templates;
  } catch (error) {
    console.error('Error fetching Pexels templates:', error);
    toast.error(`Failed to load templates from Pexels: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
};

// Function to save a template to the "folder" (localStorage in this implementation)
export const saveTemplateToFolder = async (templateData: TemplateSaveData): Promise<boolean> => {
  try {
    // Generate a unique ID for the template
    const templateId = `user-template-${Date.now()}`;
    
    // In a real app, this would upload files to the server
    // For now, we'll save to localStorage

    // Save the thumbnail image (in a real app, this would be uploaded to a server)
    // Here we just reference the data URL directly
    const thumbnailPath = templateData.thumbnailUrl;
    
    // Save the JSON (in a real app, this would be saved to a file on the server)
    // For this implementation, we'll store it in localStorage
    localStorage.setItem(`template-json-${templateId}`, templateData.canvasJson);
    
    // Create the template metadata
    const template: TemplateData = {
      id: templateId,
      name: templateData.name,
      thumbnailPath: thumbnailPath,
      jsonPath: `template-json-${templateId}`, // Special marker to indicate this is in localStorage
      category: templateData.category,
      size: templateData.size
    };
    
    // Add to the user uploaded templates list
    const userTemplates = getUserUploadedTemplates();
    userTemplates.push(template);
    saveUserUploadedTemplates(userTemplates);
    
    return true;
  } catch (error) {
    console.error('Error saving template to folder:', error);
    return false;
  }
};

// Function to load a template's JSON data
export const loadTemplateJson = async (jsonPath?: string): Promise<string | null> => {
  if (!jsonPath) return null;
  
  try {
    // Check if this is a localStorage template
    if (jsonPath.startsWith('template-json-')) {
      const storedJson = localStorage.getItem(jsonPath);
      if (!storedJson) {
        throw new Error(`Template JSON not found in localStorage: ${jsonPath}`);
      }
      return storedJson;
    }
    
    // Fix for absolute file paths - ensure we're using a proper URL
    if (jsonPath.startsWith('/') || jsonPath.includes('://')) {
      // Use the path as is if it starts with a slash (relative to domain root)
      // or if it's already a full URL (includes ://)
    } else if (jsonPath.includes(':')) {
      // This looks like a file path with line number - not a valid URL
      // Remove line numbers if present (e.g., "file.json:123")
      jsonPath = jsonPath.split(':')[0];
      // Convert to a relative URL
      jsonPath = `/assets/templates/${jsonPath}`;
    }
    
    console.log(`Loading template from path: ${jsonPath}`);
    
    // Otherwise, load from server
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Failed to load template JSON: ${response.statusText}`);
    }
    
    try {
      // Get raw text first to validate it's actually JSON
      const text = await response.text();
      
      // Attempt to parse the text as JSON
      const jsonData = JSON.parse(text);
      return JSON.stringify(jsonData);
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      throw new Error(`Invalid JSON data in template file`);
    }
  } catch (error) {
    console.error('Error loading template JSON:', error);
    toast.error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
};

// Helper functions for user uploaded templates
const getUserUploadedTemplates = (): TemplateData[] => {
  const storedTemplates = localStorage.getItem('userUploadedTemplates');
  if (!storedTemplates) return [];
  
  try {
    return JSON.parse(storedTemplates);
  } catch (error) {
    console.error('Error parsing user uploaded templates:', error);
    return [];
  }
};

const saveUserUploadedTemplates = (templates: TemplateData[]): void => {
  localStorage.setItem('userUploadedTemplates', JSON.stringify(templates));
};
