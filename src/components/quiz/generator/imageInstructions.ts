
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
    - For each image, provide a clear search term that will yield good results on Wikipedia/Pixabay
    - Our system will handle converting your search terms to actual images using the Wikipedia API with fallback to Pixabay
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
 * Generate a Wikipedia image search URL
 * @param keyword Search keyword
 * @returns Wikipedia API search URL
 */
export const generateWikipediaSearchUrl = (keyword: string): string => {
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=images|imageinfo&generator=search&gsrlimit=5&gsrsearch=${encodedKeyword}&iiprop=url&origin=*`;
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
 * Generate an image URL from a search term using Wikipedia with Pixabay fallback
 * @param searchTerm Search term
 * @returns Image URL
 */
export const generatePixabayImage = async (searchTerm: string): Promise<string> => {
  try {
    // First try Wikipedia API
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
    
    // If Wikipedia fails, try Pixabay as fallback
    const pixabayResponse = await fetch(generatePixabaySearchUrl(searchTerm));
    const pixabayData = await pixabayResponse.json();
    
    if (pixabayData.hits && pixabayData.hits.length > 0) {
      // Get the image URL from the first result
      return pixabayData.hits[0].webformatURL;
    }
    
    // If both fail, return a placeholder
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
  return `https://source.unsplash.com/random/400x300/?${encodeURIComponent(text)}`;
};

/**
 * Handle image loading errors
 * @param event Error event
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  const img = event.currentTarget;
  const topic = img.alt || "image";
  // Use a default image from Unsplash
  img.src = `https://source.unsplash.com/random/400x300/?${encodeURIComponent(topic)}`;
  img.alt = `Failed to load image: ${topic}`;
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

/**
 * Process response from Gemini to ensure all images are properly fetched
 * @param content HTML content from Gemini
 * @returns Processed HTML content with fetched images
 */
export const processImagesToPixabay = async (content: any): Promise<any> => {
  // If the content has items with imageSearchTerm instead of imageUrl
  const typedContent = content as ContentWithItems;
  
  if (typedContent && typedContent.items && Array.isArray(typedContent.items)) {
    for (let i = 0; i < typedContent.items.length; i++) {
      const item = typedContent.items[i];
      
      // If we have a search term but no URL, fetch the image
      if (item.imageSearchTerm && !item.imageUrl) {
        console.log(`Converting search term to image: "${item.imageSearchTerm}"`);
        item.imageUrl = await generatePixabayImage(item.imageSearchTerm);
      }
      // If we have a non-valid URL, replace it
      else if (item.imageUrl && (!item.imageUrl.includes('wikipedia.org') && !item.imageUrl.includes('pixabay.com') && !item.imageUrl.includes('unsplash.com'))) {
        console.log(`Replacing non-valid URL with Wikipedia/Pixabay image`);
        const searchTerm = item.answer || 'image';
        item.imageUrl = await generatePixabayImage(searchTerm);
      }
    }
  }
  
  return content;
};
