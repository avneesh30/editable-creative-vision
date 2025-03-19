
import { PsdTemplate } from '../types';

// We don't need to import JSON files directly since we're loading them dynamically
// through the file system using the jsonPath property which points to the public directory

// Export templates by category
export const logoTemplates: PsdTemplate[] = [
  {
    id: 'logo-daniel-gallego',
    name: 'Daniel Gallego',
    thumbnailUrl: '/lovable-uploads/200a07ca-a28a-4399-8425-25d75f9905bb.png',
    demoUrl: '/lovable-uploads/200a07ca-a28a-4399-8425-25d75f9905bb.png',
    size: { width: 500, height: 500 },
    category: 'logos',
    jsonPath: '/assets/templates/logos/daniel-gallego.json'
  },
  {
    id: 'logo-the-circle',
    name: 'The Circle',
    thumbnailUrl: '/lovable-uploads/3cf5d00c-fdfd-49aa-aca6-9cbe4d066067.png',
    demoUrl: '/lovable-uploads/3cf5d00c-fdfd-49aa-aca6-9cbe4d066067.png',
    size: { width: 500, height: 500 },
    category: 'logos',
    jsonPath: '/assets/templates/logos/the-circle.json'
  },
  {
    id: 'logo-ar-studio',
    name: 'AR Studio',
    thumbnailUrl: '/lovable-uploads/e70dedfe-834d-4131-870e-f0d33045ba2a.png',
    demoUrl: '/lovable-uploads/e70dedfe-834d-4131-870e-f0d33045ba2a.png',
    size: { width: 500, height: 500 },
    category: 'logos',
    jsonPath: '/assets/templates/logos/ar-studio.json'
  }
];

export const bannerTemplates: PsdTemplate[] = [
  {
    id: 'banner-business',
    name: 'Business Banner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
    demoUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
    size: { width: 1200, height: 300 },
    category: 'banners',
    jsonPath: '/assets/templates/banners/business-banner.json'
  },
  {
    id: 'banner-promo',
    name: 'Promotional Banner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    demoUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    size: { width: 1200, height: 300 },
    category: 'banners',
    jsonPath: '/assets/templates/banners/promo-banner.json'
  }
];

export const cardTemplates: PsdTemplate[] = [
  {
    id: 'card-business',
    name: 'Business Card',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b',
    demoUrl: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b',
    size: { width: 1050, height: 600 },
    category: 'cards',
    jsonPath: '/assets/templates/cards/business-card.json'
  },
  {
    id: 'card-greeting',
    name: 'Greeting Card',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634',
    demoUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634',
    size: { width: 1050, height: 750 },
    category: 'cards',
    jsonPath: '/assets/templates/cards/greeting-card.json'
  }
];

export const socialTemplates: PsdTemplate[] = [
  {
    id: 'social-instagram',
    name: 'Instagram Post',
    thumbnailUrl: 'https://images.unsplash.com/photo-1615751072497-5f5169febe17',
    demoUrl: 'https://images.unsplash.com/photo-1615751072497-5f5169febe17',
    size: { width: 1080, height: 1080 },
    category: 'social',
    jsonPath: '/assets/templates/social/instagram-post.json'
  },
  {
    id: 'social-facebook',
    name: 'Facebook Post',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0',
    demoUrl: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0',
    size: { width: 1200, height: 630 },
    category: 'social',
    jsonPath: '/assets/templates/social/facebook-post.json'
  }
];

export const emailTemplates: PsdTemplate[] = [
  {
    id: 'email-newsletter',
    name: 'Newsletter',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
    demoUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85',
    size: { width: 600, height: 800 },
    category: 'emails',
    jsonPath: '/assets/templates/emails/newsletter.json'
  },
  {
    id: 'email-promo',
    name: 'Promotional Email',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    demoUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    size: { width: 600, height: 800 },
    category: 'emails',
    jsonPath: '/assets/templates/emails/promo-email.json'
  },
  {
    id: 'email-sify-datacenter',
    name: 'Sify DataCenter Promo',
    thumbnailUrl: '/lovable-uploads/89a8c18a-9b42-45ad-9750-d77f3180944c.png',
    demoUrl: '/lovable-uploads/89a8c18a-9b42-45ad-9750-d77f3180944c.png',
    size: { width: 300, height: 250 },
    category: 'emails',
    jsonPath: '/assets/templates/emails/sify-datacenter.json'
  },
  {
    id: 'email-fitness-newsletter',
    name: 'Fitness Newsletter',
    thumbnailUrl: '/lovable-uploads/54506c70-0578-4d43-a881-f50297a71f1d.png',
    demoUrl: '/lovable-uploads/54506c70-0578-4d43-a881-f50297a71f1d.png',
    size: { width: 600, height: 800 },
    category: 'emails',
    jsonPath: '/assets/templates/emails/fitness-newsletter.json'
  }
];

// Combine all templates
export const allTemplates: PsdTemplate[] = [
  ...logoTemplates,
  ...bannerTemplates,
  ...cardTemplates,
  ...socialTemplates,
  ...emailTemplates
];

// Function to get templates by category
export const getTemplatesByCategory = (category: string): PsdTemplate[] => {
  if (category === 'all') return allTemplates;
  return allTemplates.filter(template => template.category === category);
};
