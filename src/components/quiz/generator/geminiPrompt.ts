
/**
 * Prompt template siêu đơn giản cho game full màn hình
 */

import { PromptOptions } from './types';

export const createGameGenerationPrompt = (options: PromptOptions): string => {
  const { topic, language = 'vi' } = options;
  
  // Siêu đơn giản, tập trung vào trải nghiệm đẹp và tràn màn hình
  const prompt = `Tạo một game HTML5 tràn màn hình về chủ đề "${topic}".

NGUYÊN TẮC THIẾT KẾ:
- Tạo HTML5 hoàn chỉnh với game PHẢI tràn TOÀN BỘ màn hình
- Thêm reset CSS đầy đủ: margin/padding 0, box-sizing: border-box
- Cài đặt body/html với width/height 100%, overflow hidden
- Game PHẢI đẹp với UI hiện đại, màu sắc tương phản rõ ràng
- Toàn bộ text trong game bằng tiếng Việt
- PHẢI có nút "BẮT ĐẦU" cỡ lớn (>50px) và hướng dẫn ngắn gọn
- Tối thiểu hóa chữ, dùng hình ảnh và biểu tượng trực quan
- Tất cả UI phần tử ít nhất 44px, font chữ lớn (>18px)
- Game phải responsive và đẹp ở mọi kích thước màn hình
- KHÔNG PHÂN CHIA màn hình thành các phần nhỏ, chiếm toàn bộ không gian

QUAN TRỌNG: Trả về HTML đầy đủ, không giải thích, không markdown. Game PHẢI tràn đầy màn hình trên mọi thiết bị.
`;

  return prompt;
};

export default createGameGenerationPrompt;
