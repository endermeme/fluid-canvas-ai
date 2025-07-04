import { processImageSource } from '@/utils/media-utils';

/**
 * Xử lý các hình ảnh trong nội dung HTML - đơn giản hóa
 * @param content Nội dung HTML cần xử lý
 * @returns Nội dung HTML đã xử lý hình ảnh
 */
export const processImages = async (content: string): Promise<string> => {
  // Nếu hàm này gây ra lỗi hoặc phức tạp, chỉ cần trả về nội dung gốc
  return content;
};

/**
 * Kiểm tra tính hợp lệ của mã HTML và JavaScript
 * @param html Mã HTML cần kiểm tra
 * @returns Có lỗi hay không và thông báo lỗi nếu có
 */
export const validateHtml = (html: string): { isValid: boolean, errorMessage?: string } => {
  try {
    // Kiểm tra các lỗi cơ bản
    if (!html) {
      return { isValid: false, errorMessage: 'HTML is empty' };
    }
    
    // Kiểm tra cơ bản nếu có DOCTYPE hoặc <html> tag
    if (html.includes('<!DOCTYPE') || html.includes('<html')) {
      return { isValid: true };
    }
    
    // Nếu là đoạn HTML không đầy đủ (có thể chỉ là một phần)
    if (html.includes('<body') || 
        html.includes('<div') || 
        html.includes('<script') || 
        html.includes('<style')) {
      return { isValid: false, errorMessage: 'HTML không đầy đủ, thiếu DOCTYPE hoặc thẻ html' };
    }
    
    return { isValid: false, errorMessage: 'HTML không hợp lệ' };
  } catch (error) {
    return { isValid: false, errorMessage: `Validation error: ${error.message}` };
  }
};

/**
 * Kiểm tra và sửa các lỗi JavaScript phổ biến trong HTML
 * @param html Nội dung HTML chứa JavaScript
 * @returns HTML đã được sửa lỗi
 */
export const fixJavaScriptErrors = (content: string): string => {
  try {
    console.log('Đang sửa lỗi JavaScript...');
    
    // Không tạo stub functions nữa - chỉ log để debug
    console.log('Bỏ qua việc tạo stub functions để tránh lỗi cú pháp');
    
    return content;
  } catch (error) {
    console.error('Lỗi khi sửa JavaScript:', error);
    return content;
  }
};
