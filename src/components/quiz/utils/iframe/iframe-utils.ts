
import { createIframeDocument, validateIframeContent } from './iframe-core';
import { injectStyles } from './iframe-styles';

export const enhanceIframeContent = (content: string, title?: string): string => {
  if (!validateIframeContent(content)) {
    console.warn('Invalid iframe content provided');
    return '';
  }

  const doc = createIframeDocument(content, title);
  
  // Ensure meta tags are present
  const meta = doc.createElement('meta');
  meta.setAttribute('name', 'viewport');
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
  doc.head.appendChild(meta);
  
  // Add charset if not present
  if (!doc.querySelector('meta[charset]')) {
    const charset = doc.createElement('meta');
    charset.setAttribute('charset', 'UTF-8');
    doc.head.insertBefore(charset, doc.head.firstChild);
  }
  
  // Inject styles
  injectStyles(doc);
  
  return `
    <!DOCTYPE html>
    ${doc.documentElement.outerHTML}
  `;
};

// Re-export core functions for direct access if needed
export * from './iframe-core';
export * from './iframe-styles';
