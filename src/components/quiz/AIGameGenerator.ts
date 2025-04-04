
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from './types';

export interface MiniGame {
  title: string;
  description: string;
  content: string;
}

export class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private openAIKey: string | null = null;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    this.openAIKey = localStorage.getItem('openai_api_key');
  }

  setOpenAIKey(key: string) {
    if (key && key.trim() !== '') {
      this.openAIKey = key;
      localStorage.setItem('openai_api_key', key);
      return true;
    }
    return false;
  }

  hasOpenAIKey(): boolean {
    return this.openAIKey !== null && this.openAIKey !== '';
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`Starting game generation for topic: "${topic}" with settings:`, settings);
      
      // Generate with Gemini
      const geminiResult = await this.generateWithGemini(topic, settings);
      
      if (!geminiResult) {
        console.error("Gemini failed to generate a valid result");
        return null;
      }
      
      console.log("Gemini successfully generated game");
      
      // For template games, we're only using Gemini
      return geminiResult;
    } catch (error) {
      console.error("Fatal error in generateMiniGame:", error);
      return null;
    }
  }
  
  private async generateWithGemini(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    const settingsPrompt = settings ? `
      Hãy tạo với các cài đặt sau:
      - Độ khó: ${settings.difficulty}
      - Số lượng câu hỏi/thử thách: ${settings.questionCount}
      - Thời gian cho mỗi câu hỏi/thử thách: ${settings.timePerQuestion} giây
      - Thể loại: ${settings.category}
    ` : '';

    const prompt = `
      Tạo một minigame tương tác hoàn chỉnh về chủ đề "${topic}".
      ${settingsPrompt}
      
      HƯỚNG DẪN CHI TIẾT:
      1. TẠO MỘT FILE HTML ĐẦY ĐỦ:
         - Bao gồm đầy đủ HTML, CSS và JavaScript trong một file HTML duy nhất
         - Sử dụng thẻ <style> cho CSS và thẻ <script> cho JavaScript
         - Không tách riêng code thành nhiều file
      
      2. YÊU CẦU KỸ THUẬT:
         - Code phải sạch sẽ, có indentation đúng và có comments giải thích
         - Tất cả các chức năng phải hoạt động trong một file HTML duy nhất
         - Game phải responsive, hoạt động tốt trên cả điện thoại và máy tính
         - Có đầy đủ xử lý lỗi và phản hồi người dùng
         - KHÔNG sử dụng thư viện bên ngoài hay CDN
         - TUYỆT ĐỐI KHÔNG TẠO BẤT KỲ HEADER NÀO TRONG GAME
         - Game phải chiếm toàn bộ màn hình, không có header, footer hay menu
      
      3. TÍNH NĂNG GAME:
         - Giao diện hấp dẫn với màu sắc và animation
         - Tính năng tương tác như đếm điểm, hiển thị thời gian
         - Có màn hình kết thúc game và nút chơi lại
         - Thêm âm thanh nếu cần thiết (sử dụng Web Audio API)
      
      4. YÊU CẦU PHỨC TẠP HƠN:
         - Có thể tạo các loại game phức tạp như xếp hình, platformer, puzzle...
         - Có thể lưu trữ điểm số cao nhất vào localStorage
         - Thêm các hiệu ứng đặc biệt nếu phù hợp
         - Thêm nhiều cấp độ nếu có thể
      
      5. YÊU CẦU GIAO DIỆN:
         - KHÔNG tạo header hoặc footer
         - Game phải chiếm toàn bộ không gian màn hình
         - Giao diện phải RESPONSIVE cho cả máy tính và điện thoại
         - Sử dụng media queries để đảm bảo trải nghiệm tốt trên mọi thiết bị
         - Các nút và phần tử tương tác phải đủ lớn để dễ dàng sử dụng trên điện thoại
      
      Trả về một đối tượng JSON với định dạng sau:
      {
        "title": "Tên minigame",
        "description": "Mô tả ngắn gọn về minigame",
        "content": "<đây là toàn bộ mã HTML đầy đủ, bao gồm cả CSS và JavaScript>"
      }
      
      QUAN TRỌNG: Trả về JSON hoàn chỉnh. Mã HTML phải là một trang web hoàn chỉnh và có thể chạy độc lập.
    `;

    try {
      console.log("Sending request to Gemini API...");
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log("Received Gemini response, extracting JSON...");
      
      // Clean and extract the JSON object
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        try {
          // Remove problematic escape sequences
          const cleanedJson = jsonMatch[0]
            .replace(/\\(?!["\\/bfnrt])/g, "")
            .replace(/\\\\/g, "\\")
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"');
          
          console.log("Parsing JSON from Gemini response...");
          const gameData = JSON.parse(cleanedJson);
          
          return {
            title: gameData.title,
            description: gameData.description,
            content: gameData.content
          };
        } catch (jsonError) {
          console.error("Error parsing Gemini JSON:", jsonError);
          console.log("JSON extraction failed, attempting manual extraction");
          
          // Manual extraction as fallback
          const titleMatch = text.match(/"title"\s*:\s*"([^"]*)"/);
          const descriptionMatch = text.match(/"description"\s*:\s*"([^"]*)"/);
          const contentStartMatch = text.match(/"content"\s*:\s*"(<!DOCTYPE html>|<html>|<body>)/);
          
          if (titleMatch && descriptionMatch && contentStartMatch) {
            // Find start index of content
            const contentStartIdx = text.indexOf('"content"');
            if (contentStartIdx > 0) {
              // Extract from content start to end, handling escaping
              let contentStr = "";
              let inContent = false;
              let quoteCount = 0;
              
              for (let i = contentStartIdx + 10; i < text.length; i++) {
                if (text[i] === '"' && (i === 0 || text[i-1] !== '\\')) {
                  quoteCount++;
                  if (quoteCount === 1) {
                    inContent = true;
                    continue;
                  } else if (inContent && quoteCount > 1 && text.substr(i-1, 2) !== '\\"') {
                    break;
                  }
                }
                if (inContent) contentStr += text[i];
              }
              
              return {
                title: titleMatch[1],
                description: descriptionMatch[1],
                content: contentStr.replace(/\\"/g, '"').replace(/\\n/g, '\n')
              };
            }
          }
        }
      }
      
      console.error("Failed to extract game content from Gemini response");
      return null;
    } catch (error) {
      console.error("Error generating with Gemini:", error);
      return null;
    }
  }
}
