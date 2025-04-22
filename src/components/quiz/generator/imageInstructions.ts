
/**
 * Instructions for image handling in games
 * @returns string with detailed image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Image Guidelines
    - ONLY provide detailed search terms for Wikipedia images
    - Search terms should be specific and descriptive
    - Use English search terms for better results
    - For each image, provide a clear search term
    - Our system will handle converting your search terms to actual images using the Wikipedia API
    - Format example for an image question:
      "imageSearchTerm": "red apple fruit"
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
 * Generate a placeholder image with text
 * @param width Width of the placeholder image
 * @param height Height of the placeholder image
 * @param text Text to display on the placeholder
 * @returns A data URL for the placeholder image
 */
export const generatePlaceholderImage = (width: number = 400, height: number = 300, text: string = 'Image not available'): string => {
  return `/placeholder.svg`;
};

/**
 * Handle image loading errors
 * @param event Image error event
 * @param fallbackText Text to display on placeholder
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText: string = 'Image not available'): void => {
  const img = event.currentTarget;
  img.src = generatePlaceholderImage(400, 300, fallbackText);
  img.alt = `Cannot load image: ${fallbackText}`;
};

/**
 * Generate a Wikipedia image search URL
 * @param keyword Search keyword
 * @returns Wikipedia API search URL
 */
export const generateWikipediaSearchUrl = (keyword: string): string => {
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=images|imageinfo&generator=search&gsrlimit=5&gsrsearch=${encodedKeyword}&iiprop=url&origin=*`;
};

// Define interfaces for the Wikipedia API response
interface WikipediaImageInfo {
  url: string;
}

interface WikipediaImage {
  title: string;
}

interface WikipediaPage {
  images?: WikipediaImage[];
  imageinfo?: WikipediaImageInfo[];
}

interface WikipediaQueryResponse {
  query?: {
    pages?: Record<string, WikipediaPage>;
  };
}

/**
 * Generate an image URL from a search term using Wikipedia
 * @param searchTerm Search term
 * @returns Image URL
 */
export const generateImage = async (searchTerm: string): Promise<string> => {
  try {
    const wikiResponse = await fetch(generateWikipediaSearchUrl(searchTerm));
    const wikiData = await wikiResponse.json() as WikipediaQueryResponse;
    
    if (wikiData.query && wikiData.query.pages) {
      const pages = Object.values(wikiData.query.pages);
      for (const page of pages) {
        if (page.images && page.images.length > 0) {
          const imageName = page.images[0].title;
          const imageInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imageName)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
          
          const imageInfoResponse = await fetch(imageInfoUrl);
          const imageInfoData = await imageInfoResponse.json() as WikipediaQueryResponse;
          
          if (imageInfoData.query && imageInfoData.query.pages) {
            const imagePages = Object.values(imageInfoData.query.pages);
            if (imagePages[0].imageinfo && imagePages[0].imageinfo.length > 0) {
              return imagePages[0].imageinfo[0].url;
            }
          }
        }
      }
    }
    
    // If no image found, return placeholder
    return `/placeholder.svg`;
  } catch (error) {
    console.error("Failed to fetch image:", error);
    return `/placeholder.svg`;
  }
};

/**
 * Process response from Gemini to ensure all images are properly fetched
 * @param content HTML content from Gemini
 * @returns Processed HTML content with fetched images
 */
export const processImages = async (content: any): Promise<any> => {
  const typedContent = content as ContentWithItems;
  
  if (typedContent && typedContent.items && Array.isArray(typedContent.items)) {
    for (let i = 0; i < typedContent.items.length; i++) {
      const item = typedContent.items[i];
      
      if (item.imageSearchTerm && !item.imageUrl) {
        console.log(`Converting search term to image: "${item.imageSearchTerm}"`);
        item.imageUrl = await generateImage(item.imageSearchTerm);
      }
    }
  }
  
  return content;
};

// Interface for content items with image search terms
interface ContentItem {
  imageSearchTerm?: string;
  imageUrl?: string;
  answer?: string;
}

interface ContentWithItems {
  items?: ContentItem[];
}
