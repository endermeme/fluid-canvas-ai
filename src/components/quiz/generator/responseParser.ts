
import { GameApiResponse, MiniGame } from './types';

export function parseGeminiResponse(response: string): MiniGame | null {
  try {
    // Check if the response is already HTML
    if (response.trim().toLowerCase().startsWith('<!doctype html')) {
      return {
        title: "Custom Game",
        content: response,
        isSeparatedFiles: false
      };
    }

    // Handle markdown code blocks
    const htmlRegex = /```html\s*([\s\S]*?)\s*```/;
    const htmlMatch = response.match(htmlRegex);
    
    if (htmlMatch && htmlMatch[1]) {
      const htmlContent = htmlMatch[1].trim();
      
      // Extract title from h1 or title tag if available
      let title = "Custom Game";
      const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i) || 
                         htmlContent.match(/<h1>(.*?)<\/h1>/i);
      
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }
      
      return {
        title: title,
        content: htmlContent,
        isSeparatedFiles: false
      };
    }
    
    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(response) as GameApiResponse;
      
      if (jsonResponse.content) {
        return {
          title: jsonResponse.title || "Custom Game",
          content: jsonResponse.content,
          description: jsonResponse.description,
          isSeparatedFiles: false
        };
      }
    } catch (jsonError) {
      // Not valid JSON, continue with other parsing methods
    }
    
    // If we get here, try to extract any HTML-like content
    const htmlContentMatch = response.match(/<html[\s\S]*?<\/html>/i);
    if (htmlContentMatch) {
      return {
        title: "Custom Game",
        content: htmlContentMatch[0],
        isSeparatedFiles: false
      };
    }
    
    // Last resort: treat the entire response as HTML content
    if (response.includes('<') && response.includes('>')) {
      return {
        title: "Custom Game",
        content: response,
        isSeparatedFiles: false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing response:', error);
    return null;
  }
}
