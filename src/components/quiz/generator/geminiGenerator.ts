
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
    
    2. YÊU CẦU KỸ THUẬT:
       - Code phải sạch sẽ và có indentation đúng
       - Game phải responsive, hoạt động tốt trên cả điện thoại và máy tính
       - KHÔNG sử dụng thư viện bên ngoài hay CDN
       - Game phải chiếm toàn bộ màn hình
       - Đảm bảo tất cả biến đều được khai báo đúng với let/const/var
       - Tất cả mã JavaScript phải được đặt vào event DOMContentLoaded
    
    3. TÍNH NĂNG GAME:
       - Giao diện hấp dẫn với màu sắc và animation
       - Tính năng tương tác như đếm điểm, hiển thị thời gian
       - Có màn hình kết thúc game và nút chơi lại
       - Kiểm tra logic game kỹ để tránh bug và lỗi
    
    Trả về một đối tượng JSON với định dạng sau:
    {
      "title": "Tên minigame",
      "description": "Mô tả ngắn gọn về minigame",
      "content": "<đây là toàn bộ mã HTML đầy đủ, bao gồm cả CSS và JavaScript>"
    }
    
    QUAN TRỌNG: Trả về JSON hoàn chỉnh. Mã HTML phải là một trang web hoàn chỉnh và có thể chạy độc lập.
  `;

  try {
    console.log("🔷 Gemini: Gửi yêu cầu đến Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("🔷 Gemini: Đã nhận phản hồi, đang trích xuất JSON...");
    
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
        
        console.log("🔷 Gemini: Đang phân tích JSON từ phản hồi...");
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
        console.error("❌ Gemini: Lỗi phân tích JSON:", jsonError);
        
        // Manual extraction as fallback
        console.log("🔷 Gemini: Sử dụng phương pháp trích xuất thủ công...");
        const titleMatch = text.match(/"title"\s*:\s*"([^"]*)"/);
        const descriptionMatch = text.match(/"description"\s*:\s*"([^"]*)"/);
        const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*}|"\s*$)/);
        
        if (titleMatch && contentMatch) {
          console.log("🔷 Gemini: Trích xuất thành công bằng regex");
          return {
            title: titleMatch[1] || `Game về ${topic}`,
            description: descriptionMatch ? descriptionMatch[1] : `Minigame về chủ đề ${topic}`,
            content: contentMatch[1]
              .replace(/\\n/g, '\n')
              .replace(/\\"/g, '"')
              .replace(/\\t/g, '\t')
              .replace(/\\\\/g, '\\')
          };
        }
      }
    }
    
    console.error("❌ Gemini: Không thể trích xuất nội dung game từ phản hồi");
    return null;
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
  if (retryCount >= 2) {
    console.log("⚠️ Gemini: Đã đạt số lần thử lại tối đa");
    return null;
  }
  
  try {
    console.log(`⏳ Gemini: Lần thử ${retryCount + 1} cho chủ đề: "${topic}"`);
    return await generateWithGemini(model, topic, settings);
  } catch (error) {
    console.error(`❌ Gemini: Lần thử ${retryCount + 1} thất bại:`, error);
    // Wait a bit before retrying
    console.log(`⏳ Gemini: Đợi 1 giây trước khi thử lại...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};
