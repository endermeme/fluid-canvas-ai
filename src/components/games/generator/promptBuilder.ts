import { PromptOptions } from './types';
import { getGameSpecificInstructions, getSettingsPrompt } from './gameInstructions';
import { getGameTypeByTopic } from '../shared/gameTypes';

/**
 * Tạo prompt cho Gemini dựa trên các tùy chọn
 */
export const buildGeminiPrompt = (options: PromptOptions): string => {
  const { topic, useCanvas = true, language = 'vi', difficulty = 'medium', category = 'general' } = options;
  
  const gameType = getGameTypeByTopic(topic);
  const gameTypeId = gameType?.id;
  
  // Lấy hướng dẫn cụ thể cho loại game
  const gameInstructions = getGameSpecificInstructions(gameTypeId, topic);
  
  // Lấy hướng dẫn cài đặt
  const settingsPrompt = getSettingsPrompt({
    difficulty: difficulty as any,
    category: category as any,
    language: language as any,
    useCanvas
  });
  
  // Tạo prompt chính
  return `
# YÊU CẦU: Tạo trò chơi tương tác về chủ đề "${topic}"

${gameInstructions}

## Hướng dẫn kỹ thuật:
- Tạo MỘT file HTML hoàn chỉnh duy nhất, bao gồm tất cả CSS và JavaScript
- Sử dụng cấu trúc HTML chuẩn với DOCTYPE, html, head và body
- ${useCanvas ? 'Sử dụng HTML5 Canvas để tạo đồ họa tương tác tốt nhất có thể' : 'Tránh sử dụng Canvas, thay vào đó sử dụng HTML/CSS thuần'}
- Tối ưu hóa cho màn hình điện thoại và máy tính bảng (responsive design)
- Đảm bảo giao diện sạch sẽ, trực quan, thân thiện với người dùng
- Ngôn ngữ hiển thị: ${language === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}
- Đặt title trong thẻ title phản ánh chủ đề trò chơi
- Thêm hướng dẫn chơi game rõ ràng
- Đảm bảo code không có lỗi cú pháp
- Sử dụng văn phong rõ ràng, dễ hiểu cho người chơi

${settingsPrompt}

## YÊU CẦU ĐẶC BIỆT:
- Chỉ trả về code HTML hoàn chỉnh, không có markdown hoặc text giải thích khác
- Đảm bảo file HTML có thể chạy độc lập
- Mã JavaScript phải được đặt trong một thẻ script duy nhất ở cuối body
- KHÔNG bao gồm bất kỳ dấu backtick (\`\`\`) nào trong phản hồi
`;
};
