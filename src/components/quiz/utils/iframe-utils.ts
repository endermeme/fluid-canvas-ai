
import { 
  processImages,
  normalizeHtmlStructure,
  enhanceHead,
  enhanceBody
} from './iframe-enhancer';

/**
 * Nâng cấp nội dung iframe để cải thiện hiệu suất và trải nghiệm người dùng
 * @param content Nội dung HTML gốc
 * @param title Tiêu đề cho trò chơi
 * @returns Nội dung HTML đã được nâng cấp
 */
export const enhanceIframeContent = async (content: string, title?: string): Promise<string> => {
  try {
    // Xử lý các hình ảnh trong HTML
    const processedContent = await processImages(content);
    
    // Chuẩn hóa cấu trúc HTML
    const { normalizedHtml, head, body } = normalizeHtmlStructure(processedContent, title);
    
    // Nếu không tách được head hoặc body, trả về nội dung đã xử lý hình ảnh
    if (!head || !body) {
      console.warn('Không thể tách head và body, trả về HTML nguyên bản đã xử lý hình ảnh');
      return processedContent;
    }
    
    // Nâng cấp head và body
    const enhancedHead = enhanceHead(head, title);
    const enhancedBody = enhanceBody(body);
    
    // Tái tạo HTML đầy đủ
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${enhancedHead}
</head>
<body>
  ${enhancedBody}
</body>
</html>`;
  } catch (error) {
    console.error('Lỗi khi nâng cấp nội dung iframe:', error);
    throw error;
  }
};
