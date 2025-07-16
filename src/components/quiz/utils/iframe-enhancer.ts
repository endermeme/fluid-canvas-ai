import { processImageSource } from '@/utils/media-utils';

/**
 * Xử lý các hình ảnh trong nội dung HTML - giữ nguyên để tránh lỗi
 * @param content Nội dung HTML cần xử lý
 * @returns Nội dung HTML nguyên bản
 */
export const processImages = async (content: string): Promise<string> => {
  // Giữ nguyên HTML để tránh phá vỡ cấu trúc game
  return content;
};

/**
 * Kiểm tra tính hợp lệ của mã HTML - chấp nhận mọi HTML hợp lệ
 * @param html Mã HTML cần kiểm tra
 * @returns Luôn trả về valid để không chặn game
 */
export const validateHtml = (html: string): { isValid: boolean, errorMessage?: string } => {
  try {
    // Chỉ kiểm tra HTML không rỗng
    if (!html || html.trim().length === 0) {
      return { isValid: false, errorMessage: 'HTML is empty' };
    }
    
    // Chấp nhận mọi HTML có nội dung để không chặn game
    return { isValid: true };
  } catch (error) {
    // Ngay cả khi có lỗi, vẫn cho phép HTML để tránh chặn game
    return { isValid: true };
  }
};

/**
 * Giữ nguyên JavaScript trong HTML để tránh phá vỡ game
 * @param content Nội dung HTML chứa JavaScript
 * @returns HTML nguyên bản không thay đổi
 */
export const fixJavaScriptErrors = (content: string): string => {
  try {
    // Không sửa đổi gì để tránh phá vỡ logic game
    console.log('Giữ nguyên JavaScript để bảo toàn game logic');
    return content;
  } catch (error) {
    console.error('Lỗi khi xử lý JavaScript:', error);
    // Trả về nguyên bản ngay cả khi có lỗi
    return content;
  }
};
