
import { processImageSource } from '@/utils/media-utils';
import { touchStyles } from './iframe-styles';
import { 
  errorHandlingScript, 
  deviceDetectionScript, 
  iframeHelperScript,
  debugToolsScript,
  loadingScript 
} from './iframe-scripts';

/**
 * Xử lý các hình ảnh trong nội dung HTML
 * @param content Nội dung HTML cần xử lý
 * @returns Nội dung HTML đã xử lý hình ảnh
 */
export const processImages = async (content: string): Promise<string> => {
  let processedContent = content;
  
  // Xử lý thẻ img
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  const imgMatches = Array.from(content.matchAll(imgRegex));
  
  for (const match of imgMatches) {
    const originalSrc = match[1];
    const processedSrc = await processImageSource(originalSrc);
    processedContent = processedContent.replace(originalSrc, processedSrc);
  }
  
  // Xử lý background-image trong CSS
  const bgRegex = /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/g;
  const bgMatches = Array.from(content.matchAll(bgRegex));
  
  for (const match of bgMatches) {
    const originalUrl = match[1];
    const processedUrl = await processImageSource(originalUrl);
    processedContent = processedContent.replace(originalUrl, processedUrl);
  }

  return processedContent;
};

/**
 * Chuẩn hóa cấu trúc HTML nếu cần
 * @param html Nội dung HTML cần chuẩn hóa
 * @param title Tiêu đề cho trang web
 * @returns Nội dung HTML đã chuẩn hóa
 */
export const normalizeHtmlStructure = (html: string, title?: string): { 
  normalizedHtml: string, 
  head: string, 
  body: string 
} => {
  // Kiểm tra và chuẩn hóa cấu trúc HTML
  if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${title || 'Interactive Game'}</title>
</head>
<body>
  ${html}
</body>
</html>`;
  }

  // Extract head và body
  let head = '';
  let body = '';
  
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  if (headMatch && headMatch[1]) {
    head = headMatch[1];
  }

  const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    body = bodyMatch[1];
  }

  return { normalizedHtml: html, head, body };
};

/**
 * Thêm các meta tags cần thiết vào head
 * @param head Phần head của HTML
 * @param title Tiêu đề cho trang web
 * @returns Phần head đã được nâng cấp
 */
export const enhanceHead = (head: string, title?: string): string => {
  let enhancedHead = head;
  
  // Thêm viewport meta nếu chưa có
  const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
  if (!enhancedHead.includes('viewport')) {
    enhancedHead = viewportMeta + enhancedHead;
  }

  // Thêm title nếu được cung cấp và chưa có
  if (title && !enhancedHead.includes('<title>')) {
    enhancedHead += `<title>${title}</title>`;
  }
  
  // Thêm styles
  enhancedHead = touchStyles + enhancedHead;
  
  return enhancedHead;
};

/**
 * Thêm các scripts và loading indicator vào body
 * @param body Phần body của HTML
 * @returns Phần body đã được nâng cấp
 */
export const enhanceBody = (body: string): string => {
  // Thêm loading indicator vào đầu body
  const enhancedBody = loadingScript + body;
  
  // Thêm các scripts vào cuối body
  return enhancedBody + errorHandlingScript + deviceDetectionScript + iframeHelperScript + debugToolsScript;
};
