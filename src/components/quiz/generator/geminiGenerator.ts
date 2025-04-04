
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';

export const generateWithGemini = async (
  model: any, 
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  // Get game type from topic to provide better context for the AI
  const gameType = getGameTypeByTopic(topic);
  const gameDescription = gameType ? gameType.description : "trò chơi tương tác";
  
  console.log(`🔷 Gemini: Bắt đầu tạo game "${topic}" - Loại: ${gameType?.name || "Không xác định"}`);
  console.log(`🔷 Gemini: Cài đặt: ${JSON.stringify(settings || {})}`);
  
  const settingsPrompt = settings ? `
    Hãy tạo với các cài đặt sau:
    - Độ khó: ${settings.difficulty}
    - Số lượng câu hỏi/thử thách: ${settings.questionCount}
    - Thời gian cho mỗi câu hỏi/thử thách: ${settings.timePerQuestion} giây
    - Thể loại: ${settings.category}
  ` : '';

  const prompt = `
    Tạo một minigame tương tác hoàn chỉnh để học về chủ đề "${topic}" dưới dạng ${gameDescription}.
    ${settingsPrompt}
    
    HƯỚNG DẪN CHI TIẾT:
    1. TẠO MỘT FILE HTML ĐẦY ĐỦ:
       - Bao gồm đầy đủ HTML, CSS và JavaScript trong một file HTML duy nhất
       - Sử dụng thẻ <style> cho CSS và thẻ <script> cho JavaScript
       - Code phải đơn giản, hiệu quả và KHÔNG có các thành phần không cần thiết
    
    2. YÊU CẦU KỸ THUẬT:
       - Code phải sạch sẽ và có indentation đúng
       - Game phải responsive, hoạt động tốt trên cả điện thoại và máy tính
       - KHÔNG sử dụng thư viện bên ngoài hay CDN
       - Game phải chiếm toàn bộ màn hình
       - Đảm bảo tất cả biến đều được khai báo đúng với let/const/var
       - Tất cả mã JavaScript phải được đặt vào event DOMContentLoaded
       - Đảm bảo JSON trả về KHÔNG chứa ký tự điều khiển hoặc ký tự đặc biệt
    
    3. TÍNH NĂNG GAME:
       - Giao diện hấp dẫn với màu sắc và animation
       - Tính năng tương tác như đếm điểm, hiển thị thời gian
       - Có màn hình kết thúc game và nút chơi lại
       - Kiểm tra logic game kỹ để tránh bug và lỗi
       - LOẠI BỎ những thành phần không cần thiết hoặc không liên quan đến chủ đề
       
    4. SỬ DỤNG HÌNH ẢNH:
       - Nếu game cần hình ảnh, HÃY SỬ DỤNG URL hình ảnh từ Google
       - BẮT BUỘC giữ nguyên URL hình ảnh, KHÔNG được thay đổi hoặc xóa URL
       - Đảm bảo URL hình ảnh được chèn chính xác vào mã HTML
       - Sử dụng hình ảnh liên quan đến chủ đề và phù hợp với nội dung game
    
    Trả về một đối tượng JSON với định dạng sau:
    {
      "title": "Tên minigame",
      "description": "Mô tả ngắn gọn về minigame",
      "content": "<đây là toàn bộ mã HTML đầy đủ, bao gồm cả CSS và JavaScript>"
    }
    
    QUAN TRỌNG:
    - Trả về JSON hoàn chỉnh và hợp lệ, KHÔNG chứa ký tự điều khiển, ký tự đặc biệt
    - Mã HTML phải là một trang web hoàn chỉnh và có thể chạy độc lập
    - Nếu có sử dụng hình ảnh, PHẢI GIỮ NGUYÊN URL hình ảnh và không được chỉnh sửa hoặc xóa chúng
    - KIỂM TRA lại logic code và loại bỏ mọi lỗi trước khi trả về
  `;

  try {
    console.log("🔷 Gemini: Gửi yêu cầu đến Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("🔷 Gemini: Đã nhận phản hồi, đang trích xuất JSON...");
    
    // Enhanced JSON extraction and cleaning
    try {
      // Method 1: Try JSON.parse directly if it's valid JSON
      try {
        // Check if the entire response is a valid JSON
        const gameData = JSON.parse(text);
        console.log("🔷 Gemini: JSON hợp lệ, trích xuất thành công");
        
        return {
          title: gameData.title || `Game về ${topic}`,
          description: gameData.description || `Minigame về chủ đề ${topic}`,
          content: gameData.content || ''
        };
      } catch (directParseError) {
        console.log("🔷 Gemini: Không thể phân tích trực tiếp, thử phương pháp 2...");
      }
      
      // Method 2: Use regex to find and extract JSON object
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        // Clean the JSON string - replace problematic characters
        const cleanedJson = jsonMatch[0]
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
          .replace(/\\(?!["\\/bfnrt])/g, "") // Remove invalid escape sequences
          .replace(/\\n/g, "\\n") // Properly escape newlines
          .replace(/\\r/g, "\\r") // Properly escape carriage returns
          .replace(/\\t/g, "\\t") // Properly escape tabs
          .replace(/\\\\/g, "\\") // Fix double backslashes
          .replace(/\\"/g, '"') // Fix escaped quotes
          .replace(/'/g, "'") // Replace smart quotes
          .replace(/"/g, '"') // Replace smart quotes
          .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
          .replace(/[\u2018\u2019]/g, "'"); // Replace smart quotes
        
        console.log("🔷 Gemini: Đang phân tích JSON từ phản hồi (phương pháp 2)...");
        try {
          const gameData = JSON.parse(cleanedJson);
          
          console.log(`🔷 Gemini: Đã tạo thành công game "${gameData.title || 'Không có tiêu đề'}"`);
          console.log(`🔷 Gemini: Mô tả: ${gameData.description || 'Không có mô tả'}`);
          console.log(`🔷 Gemini: Kích thước code: ${(gameData.content?.length || 0).toLocaleString()} ký tự`);
          
          return {
            title: gameData.title || `Game về ${topic}`,
            description: gameData.description || `Minigame về chủ đề ${topic}`,
            content: gameData.content || ''
          };
        } catch (jsonError) {
          console.error("❌ Gemini: Lỗi phân tích JSON (phương pháp 2):", jsonError);
          console.log("🔷 Gemini: Sử dụng phương pháp trích xuất thủ công...");
        }
      }
      
      // Method 3: Manual extraction as final fallback
      console.log("🔷 Gemini: Sử dụng phương pháp trích xuất thủ công (regex)...");
      const titleMatch = text.match(/"title"\s*:\s*"([^"]*)"/);
      const descriptionMatch = text.match(/"description"\s*:\s*"([^"]*)"/);
      const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*}|"\s*$)/);
      
      if (titleMatch || contentMatch) {
        console.log("🔷 Gemini: Trích xuất thành công bằng regex");
        return {
          title: titleMatch?.[1] || `Game về ${topic}`,
          description: descriptionMatch?.[1] || `Minigame về chủ đề ${topic}`,
          content: contentMatch 
            ? contentMatch[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\t/g, '\t')
                .replace(/\\\\/g, '\\')
            : `<html><body><h1>Game về ${topic}</h1><p>Không thể tạo nội dung.</p></body></html>`
        };
      }
      
      // Last resort: Extract any HTML content
      const htmlMatch = text.match(/<html[\s\S]*<\/html>/i);
      if (htmlMatch) {
        console.log("🔷 Gemini: Trích xuất HTML thành công");
        return {
          title: `Game về ${topic}`,
          description: `Minigame về chủ đề ${topic}`,
          content: htmlMatch[0]
        };
      }
      
      throw new Error("Không thể trích xuất JSON hoặc HTML từ phản hồi");
    } catch (extractionError) {
      console.error("❌ Gemini: Lỗi trích xuất:", extractionError);
      return null;
    }
  } catch (error) {
    console.error("❌ Gemini: Lỗi khi tạo với Gemini:", error);
    throw error; // Rethrow for retry mechanism
  }
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData, 
  retryCount = 0
): Promise<MiniGame | null> => {
  if (retryCount >= 3) { // Increase retry count to 3
    console.log("⚠️ Gemini: Đã đạt số lần thử lại tối đa");
    return null;
  }
  
  try {
    console.log(`⏳ Gemini: Lần thử ${retryCount + 1} cho chủ đề: "${topic}"`);
    return await generateWithGemini(model, topic, settings);
  } catch (error) {
    console.error(`❌ Gemini: Lần thử ${retryCount + 1} thất bại:`, error);
    // Wait a bit before retrying (increasing wait time with each retry)
    const waitTime = (retryCount + 1) * 1000;
    console.log(`⏳ Gemini: Đợi ${waitTime/1000} giây trước khi thử lại...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};
