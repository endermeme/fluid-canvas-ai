
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from './types';

export interface MiniGame {
  title: string;
  description: string;
  content: string;
  instructionsHtml: string;
  gameHtml: string;
  gameScript: string;
  cssStyles: string;
}

export class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "" });
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      const settingsPrompt = settings ? `
        Hãy tạo với các cài đặt sau:
        - Độ khó: ${settings.difficulty}
        - Số lượng câu hỏi/thử thách: ${settings.questionCount}
        - Thời gian cho mỗi câu hỏi/thử thách: ${settings.timePerQuestion} giây
        - Thể loại: ${settings.category}
      ` : '';

      const prompt = `
        Tạo một minigame tương tác về chủ đề "${topic}" bằng HTML, CSS và JavaScript.
        ${settingsPrompt}
        
        Minigame cần phải có:
        1. Giao diện thân thiện với người dùng, đẹp mắt
        2. Hướng dẫn rõ ràng cho người chơi
        3. Tương tác tốt bằng chuột hoặc chạm
        4. Có thể chơi được trên điện thoại và máy tính
        5. Code HTML, CSS và JavaScript đơn giản, dễ hiểu
        6. Hiển thị điểm số hoặc kết quả cuối cùng
        7. Nút để chơi lại game
        
        Trả về định dạng JSON với các trường sau:
        {
          "title": "Tên minigame",
          "description": "Mô tả ngắn gọn về minigame",
          "instructionsHtml": "Hướng dẫn chơi game dưới dạng HTML",
          "gameHtml": "Mã HTML của game",
          "gameScript": "Mã JavaScript của game (không bao gồm thẻ script)",
          "cssStyles": "CSS cho game (không bao gồm thẻ style)"
        }
        
        Không trả lời bất kỳ điều gì khác ngoài đối tượng JSON.
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract the JSON object from the response
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const gameData = JSON.parse(jsonStr);
        
        return {
          title: gameData.title,
          description: gameData.description,
          content: text,
          instructionsHtml: gameData.instructionsHtml,
          gameHtml: gameData.gameHtml,
          gameScript: gameData.gameScript,
          cssStyles: gameData.cssStyles
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error generating mini game:", error);
      return null;
    }
  }
}
