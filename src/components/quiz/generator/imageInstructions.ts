
/**
 * Instructions for image handling in games
 * @returns string with detailed image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Image Guidelines
    - ONLY provide detailed search terms for images - NEVER actual URLs
    - Search terms should be specific and descriptive (e.g., "fresh red strawberry fruit" instead of just "strawberry")
    - Use English search terms for better results, even for non-English games
    - For each image, provide a clear search term that will yield good results on Pixabay
    - Our system will handle converting your search terms to actual images using the Pixabay API
    - Format example for an image question:
      "imageSearchTerm": "ripe yellow banana fruit close up"
  `;
};

/**
 * Convert a topic into an image description
 * @param topic The topic to describe
 * @returns The image description
 */
export const topicToImageDescription = (topic: string): string => {
  return `${topic} detailed illustration`;
};

/**
 * Generate a Pixabay search URL
 * @param keyword Search keyword
 * @param safeSearch Use safe search
 * @returns Pixabay API search URL
 */
export const generatePixabaySearchUrl = (keyword: string, safeSearch: boolean = true): string => {
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://pixabay.com/api/?key=49691613-4d92ecd39a474575561ea2695&q=${encodedKeyword}&image_type=photo&safesearch=${safeSearch}`;
};

/**
 * Generate a Pixabay image URL from a search term
 * @param searchTerm Search term
 * @returns Image URL
 */
export const generatePixabayImage = async (searchTerm: string): Promise<string> => {
  try {
    const response = await fetch(generatePixabaySearchUrl(searchTerm));
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Get the image URL from the first result
      return data.hits[0].webformatURL;
    }
    
    // If no image is found, return a placeholder
    return generatePlaceholderImage(400, 300, searchTerm);
  } catch (error) {
    console.error("Failed to fetch image from Pixabay:", error);
    return generatePlaceholderImage(400, 300, searchTerm);
  }
};

/**
 * Generate a placeholder image
 * @param width Image width
 * @param height Image height
 * @param text Text to display on the image
 * @returns Placeholder image URL
 */
export const generatePlaceholderImage = (width: number = 400, height: number = 300, text: string = "Image"): string => {
  // Use a default image from Pixabay as placeholder
  return `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png`;
};

/**
 * Handle image loading errors
 * @param event Error event
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  const img = event.currentTarget;
  const topic = img.alt || "image";
  // Use a default image from Pixabay
  img.src = `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png`;
  img.alt = `Failed to load image: ${topic}`;
};

/**
 * Process response from Gemini to ensure all images are from Pixabay
 * @param content HTML content from Gemini
 * @returns Processed HTML content with Pixabay images
 */
export const processImagesToPixabay = async (content: any): Promise<any> => {
  // If the content has items with imageSearchTerm instead of imageUrl
  if (content && content.items && Array.isArray(content.items)) {
    for (let i = 0; i < content.items.length; i++) {
      const item = content.items[i];
      
      // If we have a search term but no URL, fetch the image
      if (item.imageSearchTerm && !item.imageUrl) {
        console.log(`Converting search term to Pixabay image: "${item.imageSearchTerm}"`);
        item.imageUrl = await generatePixabayImage(item.imageSearchTerm);
      }
      // If we have a non-Pixabay URL, replace it
      else if (item.imageUrl && !item.imageUrl.includes('pixabay.com')) {
        console.log(`Replacing non-Pixabay URL with Pixabay image`);
        const searchTerm = item.answer || 'image';
        item.imageUrl = await generatePixabayImage(searchTerm);
      }
    }
  }
  
  return content;
};
