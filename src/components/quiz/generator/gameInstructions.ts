
import { GameSettingsData } from '../types';

/**
 * Generates game-specific instructions based on the game type
 * @param gameTypeId The ID of the game type
 * @param topic The topic of the game
 * @returns string with game-specific instructions
 */
export const getGameSpecificInstructions = (gameTypeId: string | undefined, topic: string): string => {
  switch(gameTypeId) {
    case 'quiz':
      return `
      ## Hướng dẫn cho Trắc nghiệm
      - Tạo câu hỏi trắc nghiệm với 4 lựa chọn A, B, C, D rõ ràng
      - Mỗi câu hỏi chỉ có một đáp án đúng
      - QUAN TRỌNG: Đánh dấu đáp án đúng với data-correct="true"
      - Hiển thị phản hồi sau khi người chơi chọn đáp án
      - Đếm điểm và hiển thị kết quả cuối game
      `;
    
    case 'flashcards':
      return `
      ## Hướng dẫn cho Thẻ ghi nhớ
      - Tạo thẻ hai mặt: câu hỏi/từ và đáp án
      - Có nút lật thẻ, nút tiếp theo và quay lại
      - Thiết kế responsive cho mọi màn hình
      `;
    
    case 'matching':
      return `
      ## Hướng dẫn cho Nối từ
      - Tạo tối đa 8 cặp từ/khái niệm và định nghĩa
      - Hiển thị hai cột để nối các cặp từ/định nghĩa
      - Cập nhật điểm số và hiển thị kết quả
      `;
    
    case 'truefalse':
      return `
      ## Hướng dẫn cho Đúng hay sai
      - Tạo các phát biểu rõ ràng về chủ đề "${topic}"
      - Đánh dấu đáp án đúng bằng data-correct="true"
      - Hiển thị giải thích sau khi người dùng chọn
      `;
    
    default:
      return `
      ## Hướng dẫn chung
      - Tạo trò chơi đơn giản, dễ hiểu về chủ đề "${topic}"
      - Giao diện trực quan, tối ưu cho desktop và mobile
      - LUÔN đánh dấu đáp án đúng với data-correct="true"
      `;
  }
};

/**
 * Generates settings prompt based on game settings
 * @param settings The game settings
 * @returns string with settings prompt
 */
export const getSettingsPrompt = (settings?: GameSettingsData): string => {
  if (!settings) return '';
  
  return `
    ## Cài đặt
    - Độ khó: ${settings.difficulty}
    - Số câu hỏi/thử thách: ${settings.questionCount}
    - Thời gian mỗi câu: ${settings.timePerQuestion} giây
    - Danh mục: ${settings.category}
  `;
};
