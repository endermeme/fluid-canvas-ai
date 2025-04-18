
import { createFormattedHtml } from './html-formatter';
import { parseJsonContent, parseMarkdownContent } from './content-parser';

/**
 * Enhanced iframe utilities for custom games
 */
export const enhanceIframeContent = (content: string, title?: string): string => {
  if (!content) return '';

  try {
    // Try parsing as JSON first
    const jsonStructure = parseJsonContent(content);
    if (jsonStructure) {
      return createFormattedHtml(
        jsonStructure.html,
        jsonStructure.css,
        jsonStructure.javascript,
        jsonStructure.meta?.title || title,
        jsonStructure.meta?.viewport
      );
    }

    // Try parsing as markdown-style blocks
    const markdownStructure = parseMarkdownContent(content);
    if (markdownStructure) {
      return createFormattedHtml(
        markdownStructure.html,
        markdownStructure.css,
        markdownStructure.javascript,
        title
      );
    }

    // If no parsing succeeded, wrap the content in basic HTML
    return wrapContentInHtml(content, title);
  } catch (error) {
    console.error('Error enhancing iframe content:', error);
    return content;
  }
};

/**
 * Wrap content in iframe-safe HTML if it's not already HTML
 */
export const wrapContentInHtml = (content: string, title?: string): string => {
  if (content.includes('<html') || content.includes('<!DOCTYPE html>')) {
    return content;
  }
  
  return createFormattedHtml(content, '', '', title);
};
