
/**
 * Xử lý phần CSS của game trong iframe
 */

import { generateBaseStyles } from './styles/base-styles';
import { generateWheelStyles } from './styles/wheel-styles';
import { generateTextStyles } from './styles/text-styles';
import { generateCardStyles } from './styles/card-styles';

export const optimizeStyles = (cssContent: string): string => {
  // Combine all modular styles
  const baseStyles = generateBaseStyles();
  const wheelStyles = generateWheelStyles();
  const textStyles = generateTextStyles();
  const cardStyles = generateCardStyles();
  
  // Combine all styles with the custom CSS content
  return `
    ${baseStyles}
    ${wheelStyles}
    ${textStyles}
    ${cardStyles}
    ${cssContent}
  `;
};

export const extractCssContent = (apiResponse: string): string => {
  try {
    // Find content between <CSS>...</CSS> tags
    const cssRegex = /<CSS>([\s\S]*?)<\/CSS>/i;
    const cssMatch = apiResponse.match(cssRegex);
    
    if (cssMatch && cssMatch[1]) {
      return cssMatch[1].trim();
    }
    
    // Try alternative format if standard tags not found
    const alternativeRegex = /```css([\s\S]*?)```/i;
    const alternativeMatch = apiResponse.match(alternativeRegex);
    
    if (alternativeMatch && alternativeMatch[1]) {
      return alternativeMatch[1].trim();
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting CSS content:', error);
    return '';
  }
};
