
import { GameSettingsData } from '../types';
import { getGameSpecificInstructions, getSettingsPrompt } from './gameInstructions';
import { getImageInstructions } from './imageInstructions';

/**
 * Builds a complete prompt for the Gemini API based on game parameters
 * @param topic The topic of the game
 * @param gameTypeId Optional game type ID
 * @param settings Optional game settings
 * @param requiresImages Whether the game requires images
 * @returns Complete prompt string for Gemini API
 */
export const buildGeminiPrompt = (
  topic: string, 
  gameTypeId: string | undefined, 
  settings?: GameSettingsData,
  requiresImages: boolean = false
): string => {
  const gameSpecificInstructions = getGameSpecificInstructions(gameTypeId, topic);
  const imageInstructions = requiresImages ? getImageInstructions() : '';
  const settingsPrompt = getSettingsPrompt(settings);

  return `
    # Trò chơi giáo dục tương tác đơn file

    ## Mục tiêu
    Tạo một trò chơi giáo dục tương tác chất lượng cao về chủ đề "${topic}". Trò chơi phải hoạt động hoàn toàn trong một file HTML duy nhất (với CSS và JavaScript được nhúng bên trong).

    ${gameSpecificInstructions}
    ${imageInstructions}

    ## Yêu cầu quan trọng
    - Tất cả HTML, CSS và JavaScript phải được chứa trong một file HTML duy nhất.
    - Không sử dụng thư viện bên ngoài - chỉ dùng Vanilla JavaScript.
    - Đảm bảo thiết kế responsive hoạt động tốt trên mọi thiết bị.
    - LUÔN đánh dấu đáp án đúng bằng thuộc tính 'data-correct="true"' trong HTML.
    - Đảm bảo thông tin học thuật và lịch sử chính xác.
    - Hiển thị đáp án đúng sau khi người chơi trả lời.
    - Theo dõi và hiển thị điểm số, đánh giá kết quả cuối cùng.

    ${settingsPrompt}

    ## Định dạng đầu ra
    Kết quả cuối cùng phải là một đối tượng JSON với cấu trúc:
    {
      "title": "Tiêu đề của trò chơi",
      "description": "Mô tả ngắn về trò chơi",
      "content": "Mã HTML đầy đủ của trò chơi"
    }

    GIAO KẾT QUẢ DƯỚI DẠNG MỘT ĐỐI TƯỢNG JSON HỢP LỆ DUY NHẤT KHÔNG CÓ MARKDOWN HOẶC DẤU BACKTICK.
  `;
};
