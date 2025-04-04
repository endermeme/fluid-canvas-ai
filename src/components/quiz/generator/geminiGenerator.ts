
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
    
    3. TÍNH NĂNG GAME:
       - Giao diện hấp dẫn với màu sắc và animation
       - Tính năng tương tác như đếm điểm, hiển thị thời gian
       - Có màn hình kết thúc game và nút chơi lại
    
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
    const result = await model.generateContent(prompt);
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
          title: gameData.title || `Game về ${topic}`,
          description: gameData.description || `Minigame về chủ đề ${topic}`,
          content: gameData.content || ''
        };
      } catch (jsonError) {
        console.error("Error parsing Gemini JSON:", jsonError);
        
        // Manual extraction as fallback
        const titleMatch = text.match(/"title"\s*:\s*"([^"]*)"/);
        const descriptionMatch = text.match(/"description"\s*:\s*"([^"]*)"/);
        const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*}|"\s*$)/);
        
        if (titleMatch && contentMatch) {
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
    
    console.error("Failed to extract game content from Gemini response");
    return null;
  } catch (error) {
    console.error("Error generating with Gemini:", error);
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
    console.log("Max retries reached for Gemini generation");
    return null;
  }
  
  try {
    console.log(`Gemini attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithGemini(model, topic, settings);
  } catch (error) {
    console.error(`Gemini attempt ${retryCount + 1} failed:`, error);
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};
