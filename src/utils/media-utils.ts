
/**
 * Check if a string is a valid base64 image
 */
export const isBase64Image = (str: string): boolean => {
  try {
    return str.startsWith('data:image/') || /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(str);
  } catch {
    return false;
  }
};

/**
 * Check if a string is a valid image URL
 */
export const isImageUrl = (str: string): boolean => {
  try {
    return str.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null || 
           str.startsWith('http') || 
           str.startsWith('https') ||
           str.startsWith('data:image/') ||
           str.includes('pixabay.com') ||
           str.includes('pexels.com') ||
           str.includes('freepik.com') ||
           str.includes('shutterstock.com');
  } catch {
    return false;
  }
};

/**
 * Process image source to ensure it's in the correct format
 * Now supports any image source without conversion restrictions
 */
export const processImageSource = async (src: string): Promise<string> => {
  if (!src) return '/placeholder.svg';
  
  if (isBase64Image(src)) {
    return src;  // Already in base64 format
  }
  
  if (isImageUrl(src)) {
    return src; // Return URL directly - let browser handle loading
  }
  
  return '/placeholder.svg'; // Fallback to placeholder
};

/**
 * Generate fallback placeholder for failed images
 */
export const generateImageFallback = (alt: string = 'Image'): string => {
  return `/placeholder.svg`;
};

/**
 * Check if image URL is accessible (simplified check)
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    if (!isImageUrl(url)) return false;
    
    // Simple validation - if it looks like an image URL, assume it's valid
    // Browser will handle actual loading and fallback
    return true;
  } catch {
    return false;
  }
};
