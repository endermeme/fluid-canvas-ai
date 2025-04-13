
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
    - For each image, provide a clear search term that will yield good results
    - Our system will handle converting your search terms to actual images using Wikipedia
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
 * Generate a Wikipedia search URL
 * @param keyword Search keyword
 * @returns Wikipedia API search URL for images
 */
export const generateWikipediaSearchUrl = (keyword: string): string => {
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedKeyword}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
};

/**
 * Generate a Pixabay search URL (fallback)
 * @param keyword Search keyword
 * @param safeSearch Use safe search
 * @returns Pixabay API search URL
 */
export const generatePixabaySearchUrl = (keyword: string, safeSearch: boolean = true): string => {
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://pixabay.com/api/?key=49691613-4d92ecd39a474575561ea2695&q=${encodedKeyword}&image_type=photo&safesearch=${safeSearch}`;
};

/**
 * Generate an image URL from a search term
 * @param searchTerm Search term
 * @returns Image URL
 */
export const generatePixabayImage = async (searchTerm: string): Promise<string> => {
  try {
    // First try Wikipedia API
    const wikipediaResponse = await fetch(generateWikipediaSearchUrl(searchTerm));
    const wikipediaData = await wikipediaResponse.json();
    
    // Extract image from Wikipedia response
    const pages = wikipediaData.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pages[pageId]?.thumbnail?.source) {
        console.log("Found image on Wikipedia:", pages[pageId].thumbnail.source);
        return pages[pageId].thumbnail.source;
      }
    }
    
    // Fallback to Pixabay if Wikipedia doesn't have an image
    console.log("No Wikipedia image found, falling back to Pixabay");
    const pixabayResponse = await fetch(generatePixabaySearchUrl(searchTerm));
    const pixabayData = await pixabayResponse.json();
    
    if (pixabayData.hits && pixabayData.hits.length > 0) {
      // Get the image URL from the first result
      return pixabayData.hits[0].webformatURL;
    }
    
    // If no image is found, return a placeholder
    return generatePlaceholderImage(400, 300, searchTerm);
  } catch (error) {
    console.error("Failed to fetch image:", error);
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
  // Use a default image as placeholder
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};

/**
 * Handle image loading errors
 * @param event Error event
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  const img = event.currentTarget;
  const topic = img.alt || "image";
  // Use a placeholder image
  img.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(topic)}`;
  img.alt = `Failed to load image: ${topic}`;
};

/**
 * Process response from Gemini to ensure all images are fetched properly
 * @param content HTML content from Gemini
 * @returns Processed HTML content with proper images
 */
export const processImagesToPixabay = async (content: any): Promise<any> => {
  // If the content has items with imageSearchTerm instead of imageUrl
  if (content && content.items && Array.isArray(content.items)) {
    for (let i = 0; i < content.items.length; i++) {
      const item = content.items[i];
      
      // If we have a search term but no URL, fetch the image
      if (item.imageSearchTerm && !item.imageUrl) {
        console.log(`Converting search term to image: "${item.imageSearchTerm}"`);
        item.imageUrl = await generatePixabayImage(item.imageSearchTerm);
      }
      // If we have a non-standard URL, replace it
      else if (item.imageUrl && !item.imageUrl.includes('wikipedia.org') && !item.imageUrl.includes('pixabay.com')) {
        console.log(`Replacing non-standard URL with a proper image`);
        const searchTerm = item.answer || 'image';
        item.imageUrl = await generatePixabayImage(searchTerm);
      }
    }
  }
  
  return content;
};
