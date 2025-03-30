
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

      // Xử lý nội dung tùy chỉnh nếu được cung cấp
      let customContentInfo = '';
      if (options?.customContent && options.contentType === 'custom') {
        customContentInfo = `dựa trên nội dung tùy chỉnh sau: ${options.customContent}`;
      }

      // Xử lý tệp tải lên nếu được cung cấp
      let customFileInfo = '';
      if (options?.customFile) {
        customFileInfo = `với thông tin từ tệp "${options.customFile.name}"`;
      }

      // Tạo prompt cho Gemini - Fixing the issue with backticks by escaping them
      const prompt = `
      Tạo cho tôi một HTML minigame hoàn chỉnh cho chủ đề "${userMessage}" với các đặc điểm:
      - Độ khó: ${difficulty}
      - Loại nội dung: ${contentType}
      - Phù hợp cho: ${ageGroup}
      - Số câu hỏi: ${questionCount}
      - Thời gian mỗi câu: ${timePerQuestion} giây
      ${customContentInfo ? `- Sử dụng nội dung: ${customContentInfo}` : ''}
      ${customFileInfo ? `- Kết hợp thông tin từ tệp: ${customFileInfo}` : ''}
      
      Yêu cầu QUAN TRỌNG:
      1. Tạo một file HTML hoàn chỉnh, có thể chạy độc lập.
      2. Bao gồm TẤT CẢ CSS và JavaScript trong file HTML, KHÔNG có tài nguyên bên ngoài.
      3. Tạo giao diện đẹp, thân thiện với người dùng, đáp ứng (responsive) cho cả điện thoại lẫn máy tính.
      4. Có hiển thị điểm số và thời gian.
      5. Có logic hoàn chỉnh để chơi, bao gồm bắt đầu, kết thúc, và tính điểm.
      6. Minigame này PHẢI chạy ngay trong iframe mà không cần bất kỳ sự can thiệp nào.
      7. KHÔNG sử dụng bất kỳ thư viện bên ngoài nào (như jQuery, Bootstrap).
      8. Không thêm bất kỳ chú thích markdown nào (\`\`\`html, \`\`\`), chỉ trả về mã HTML thuần túy.
      9. Minigame phải có đủ tính năng chơi được ngay, không phải chỉ là bố cục hoặc demo.

      QUAN TRỌNG: CHỈ TRẢ VỀ MÃ HTML HOÀN CHỈNH. KHÔNG THÊM CHÚ THÍCH HOẶC GIẢI THÍCH GÌ KHÁC.
      `;
      
      console.log("Đang gửi prompt tới Gemini...");

      // Tạo nội dung sử dụng Gemini
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const textResponse = response.text();

      console.log("Đã nhận phản hồi từ Gemini, độ dài:", textResponse.length);

      // Xử lý phản hồi để đảm bảo là HTML thuần túy
      const cleanHtml = this.cleanHtmlResponse(textResponse);
      console.log("HTML đã được làm sạch, độ dài:", cleanHtml.length);

      // Tạo đối tượng MiniGame với phản hồi của Gemini
      return {
        title: `Minigame: ${userMessage}`,
        description: `Trò chơi về chủ đề ${userMessage}${options?.customContent ? ' với nội dung tùy chỉnh' : ''}`,
        htmlContent: cleanHtml
      };
    } catch (error) {
      console.error('Lỗi tạo Minigame:', error);
      return null;
    }
  }

  // Hàm để làm sạch phản hồi HTML, loại bỏ các đánh dấu markdown
  cleanHtmlResponse(htmlText: string): string {
    // Loại bỏ các khối mã markdown nếu có
    let cleanedHtml = htmlText;
    
    // Nếu có định dạng ```html ... ```
    const htmlBlockMatch = cleanedHtml.match(/```html\s*([\s\S]*?)\s*```/);
    if (htmlBlockMatch && htmlBlockMatch[1]) {
      cleanedHtml = htmlBlockMatch[1].trim();
    } 
    // Nếu chỉ có ``` ... ``` không có từ khóa html
    else if (cleanedHtml.includes('```')) {
      const codeBlockMatch = cleanedHtml.match(/```\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        cleanedHtml = codeBlockMatch[1].trim();
      }
    }

    // Đảm bảo mã HTML bắt đầu với <!DOCTYPE html> hoặc <html>
    if (!cleanedHtml.trim().startsWith('<!DOCTYPE') && !cleanedHtml.trim().startsWith('<html')) {
      cleanedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minigame</title>
</head>
<body>
${cleanedHtml}
</body>
</html>`;
    }

    return cleanedHtml;
  }
}
