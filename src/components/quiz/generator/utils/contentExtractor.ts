
import { MiniGame } from '../types';

export const extractGameContent = (text: string, topic: string, useCanvas: boolean): MiniGame => {
  let title = topic;
  let content = text;
  
  // Extract title from HTML content
  const titleMatch = text.match(/<title>(.*?)<\/title>/i) || 
                    text.match(/<h1[^>]*>(.*?)<\/h1>/i);
  
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
  }
  
  // Extract complete HTML document
  if (!content.trim().startsWith('<!DOCTYPE') && !content.trim().startsWith('<html')) {
    const htmlMatch = text.match(/<!DOCTYPE[\s\S]*<\/html>/i) || 
                      text.match(/<html[\s\S]*<\/html>/i);
    
    if (htmlMatch && htmlMatch[0]) {
      content = htmlMatch[0];
    }
  }
  
  return {
    title,
    content,
    useCanvas
  };
};
