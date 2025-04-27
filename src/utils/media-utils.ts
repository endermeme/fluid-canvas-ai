
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
           str.startsWith('https');
  } catch {
    return false;
  }
};

/**
 * Process image source to ensure it's in the correct format
 */
export const processImageSource = async (src: string): Promise<string> => {
  if (!src) return '';
  
  if (isBase64Image(src)) {
    return src;  // Already in base64 format
  }
  
  if (isImageUrl(src)) {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image URL to base64:', error);
      return src; // Return original URL if conversion fails
    }
  }
  
  return src; // Return original if not recognized as image
};
