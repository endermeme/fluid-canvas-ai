
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameOptions } from '@/components/quiz/GameOptionsSelector';

export interface MiniGame {
  title: string;
  description: string;
  htmlContent: string;
}

export class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateMiniGame(userMessage: string, options?: GameOptions): Promise<MiniGame | null> {
    try {
      console.log("Đang tạo minigame cho chủ đề:", userMessage);
      console.log("Tùy chọn:", options);
      
      const difficultyMap: Record<string, string> = {
        'easy': 'dễ, phù hợp cho người mới bắt đầu',
        'medium': 'trung bình, có thách thức nhưng vẫn phù hợp cho hầu hết người chơi',
        'hard': 'khó, có nhiều thách thức và yêu cầu kỹ năng nhất định',
        'advanced': 'nâng cao, rất khó và thử thách, dành cho người chơi có kinh nghiệm'
      };
      
      const contentTypeMap: Record<string, string> = {
        'educational': 'giáo dục, học tập và kiến thức',
        'entertainment': 'giải trí và vui chơi',
        'puzzle': 'giải đố và thử thách tư duy',
        'brain': 'rèn luyện trí não và phát triển tư duy',
        'art': 'nghệ thuật và sáng tạo',
        'custom': 'tùy chỉnh theo nội dung người dùng cung cấp'
      };
      
      const ageGroupMap: Record<string, string> = {
        'kids': 'trẻ em (3-7 tuổi)',
        'children': 'thiếu nhi (8-12 tuổi)',
        'teen': 'thiếu niên (13-17 tuổi)',
        'adult': 'người lớn (18+ tuổi)',
        'all': 'phù hợp mọi lứa tuổi'
      };
      
      const difficulty = options?.difficulty ? difficultyMap[options.difficulty] || 'trung bình' : 'trung bình';
      const contentType = options?.contentType ? contentTypeMap[options.contentType] || 'giải trí' : 'giải trí';
      const ageGroup = options?.ageGroup ? ageGroupMap[options.ageGroup] || 'mọi lứa tuổi' : 'mọi lứa tuổi';
      const questionCount = options?.questionCount || 5;
      const timePerQuestion = options?.timePerQuestion || 30;

      // Handle custom content if provided
      let customContentInfo = '';
      if (options?.customContent && options.contentType === 'custom') {
        customContentInfo = `dựa trên nội dung tùy chỉnh sau: ${options.customContent}`;
      }

      // Handle file upload if provided
      let customFileInfo = '';
      if (options?.customFile) {
        customFileInfo = `với thông tin từ tệp "${options.customFile.name}"`;
      }

      // Create prompt for Gemini
      const prompt = `
      Tạo cho tôi một HTML minigame hoàn chỉnh cho chủ đề "${userMessage}" với các đặc điểm:
      - Độ khó: ${difficulty}
      - Loại nội dung: ${contentType}
      - Phù hợp cho: ${ageGroup}
      - Số câu hỏi: ${questionCount}
      - Thời gian mỗi câu: ${timePerQuestion} giây
      ${customContentInfo ? `- Sử dụng nội dung: ${customContentInfo}` : ''}
      ${customFileInfo ? `- Kết hợp thông tin từ tệp: ${customFileInfo}` : ''}
      
      Yêu cầu:
      1. Tạo một file HTML hoàn chỉnh, có thể chạy độc lập.
      2. Bao gồm tất cả CSS và JavaScript trong file HTML, không có tài nguyên bên ngoài.
      3. Tạo giao diện đẹp và thân thiện với người dùng, có thể chơi được trên cả điện thoại lẫn máy tính.
      4. Có hiển thị điểm số và thời gian.
      5. Có logic hoàn chỉnh để chơi, bao gồm bắt đầu, kết thúc, và tính điểm.
      6. Có thể là bất kỳ loại trò chơi nào phù hợp với chủ đề.
      7. Bản thân game là một trang web HTML đầy đủ có thể chạy độc lập.

      Chỉ trả về mã HTML hoàn chỉnh, không cần giải thích gì thêm.
      `;
      
      // Log the prompt for debugging
      console.log("Prompt gửi tới Gemini:", prompt);

      // Generate content using Gemini
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const textResponse = response.text();
      console.log("Nhận phản hồi từ Gemini, chiều dài:", textResponse.length);

      // Create the MiniGame object with Gemini's response
      const gameTitle = `${userMessage} - Mini Game`;
      return {
        title: gameTitle,
        description: `Trò chơi về chủ đề ${userMessage}${options?.customContent ? ' với nội dung tùy chỉnh' : ''}`,
        htmlContent: textResponse
      };
    } catch (error) {
      console.error('Lỗi tạo Minigame:', error);
      return null;
    }
  }

  parseMiniGameResponse(rawText: string, topic: string): MiniGame | null {
    try {
      console.log("Đang phân tích kết quả minigame:", rawText);
      
      // Tìm nội dung HTML
      let htmlContent = '';
      const htmlMatch = rawText.match(/```html([\s\S]*?)```/);
      
      if (htmlMatch && htmlMatch[1]) {
        htmlContent = htmlMatch[1].trim();
      } else if (!rawText.includes('```')) {
        // Nếu không có định dạng markdown, xử lý text thô
        htmlContent = rawText.trim();
      }
      
      if (!htmlContent) {
        console.error('Không tìm thấy nội dung HTML hợp lệ');
        return null;
      }

      // Tạo đối tượng MiniGame
      return {
        title: `Minigame: ${topic}`,
        description: `Minigame tương tác về chủ đề ${topic}`,
        htmlContent: htmlContent
      };
    } catch (error) {
      console.error("Lỗi phân tích kết quả minigame:", error);
      return null;
    }
  }
}
