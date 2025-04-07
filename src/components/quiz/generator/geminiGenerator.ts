
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
  const gameDescription = gameType ? gameType.description : "interactive learning game";
  
  console.log(`🔷 Gemini: Starting game generation for "${topic}" - Type: ${gameType?.name || "Not specified"}`);
  console.log(`🔷 Gemini: Settings: ${JSON.stringify(settings || {})}`);
  
  const settingsPrompt = settings ? `
    Create with these settings:
    - Difficulty: ${settings.difficulty}
    - Number of questions/challenges: ${settings.questionCount}
    - Time per question/challenge: ${settings.timePerQuestion} seconds
    - Category: ${settings.category}
  ` : '';

  // Hướng dẫn đơn giản cho các trò chơi
  let gameSpecificInstructions = '';
  
  // Thêm hướng dẫn cụ thể cho trò chơi tìm từ ẩn
  if (gameType?.id === 'wordsearch') {
    gameSpecificInstructions = `
    ## Hướng dẫn cho trò chơi Tìm từ ẩn
    
    - Tạo bảng chữ cái kích thước vừa phải (không quá 10x10)
    - Chỉ sử dụng các từ đơn giản liên quan đến chủ đề "${topic}"
    - Từ chỉ được sắp xếp theo chiều ngang hoặc dọc (không có chéo)
    - Sử dụng CSS đơn giản để làm nổi bật từ khi người dùng tìm thấy
    - Hiển thị danh sách các từ cần tìm ở bên cạnh bảng chữ cái
    - Đảm bảo trò chơi hoạt động trên cả máy tính và thiết bị di động
    `;
  }

  const prompt = `
    # Trò chơi giáo dục tương tác đơn file

    ## Mục tiêu
    Tạo một trò chơi giáo dục tương tác hoạt động hoàn toàn trong một file HTML duy nhất (với CSS và JavaScript được nhúng bên trong). Trò chơi phải tự chứa (không sử dụng thư viện bên ngoài) và cung cấp trải nghiệm hấp dẫn về chủ đề "${topic}".

    ${gameSpecificInstructions}

    ## Loại trò chơi
    Trò chơi của bạn nên hỗ trợ các chế độ chơi khác nhau, cung cấp phong cách tương tác độc đáo. Bao gồm:
    - **Trắc nghiệm** (câu hỏi nhiều lựa chọn)
    - **Thẻ ghi nhớ** (lật thẻ để hiển thị thông tin)
    - **Xếp lại từ** (sắp xếp lại các chữ cái hoặc từ để tạo câu trả lời đúng)
    - **Điền vào chỗ trống** (cung cấp từ hoặc cụm từ còn thiếu)
    - **Đúng/Sai** (xác minh các phát biểu là đúng hay sai)
    - **Câu đố toán học** (giải các câu hỏi/bài toán)
    - **Câu đố vui** (giải các câu đố hoặc câu hỏi mẹo)
    - **Nối từ** (nối các khái niệm với định nghĩa tương ứng)
    - **Đoán từ qua hình** (xem hình ảnh và đoán từ)
    - **Tìm từ ẩn** (tìm các từ ẩn trong bảng chữ cái)
    - **Phân loại** (phân loại các đối tượng vào các nhóm khác nhau)

    Chọn chế độ chơi phù hợp nhất cho chủ đề "${topic}".
    ${settingsPrompt}

    ## Yêu cầu kỹ thuật
    - **Giải pháp một file:** Tất cả HTML, CSS và JavaScript phải được chứa trong một file HTML duy nhất. Không sử dụng bất kỳ script, stylesheet hoặc thư viện bên ngoài nào. Mọi thứ (code, style, logic) phải được nhúng vào file.
    - **Thiết kế responsive:** Trò chơi phải hoàn toàn responsive và hoạt động tốt trên điện thoại di động, máy tính bảng và trình duyệt desktop.
    - **Script DOM Ready:** Bọc tất cả logic JavaScript bên trong một event listener 'DOMContentLoaded'. Điều này đảm bảo rằng DOM được tải đầy đủ trước khi bất kỳ script nào chạy.
    - **Giao diện đơn giản:** Sử dụng CSS cơ bản để tạo giao diện dễ nhìn, dễ sử dụng.
    - **Không quá phức tạp:** Giữ cho code đơn giản, dễ hiểu, tránh các kỹ thuật phức tạp.
    - **Làm việc trên mọi thiết bị:** Đảm bảo trò chơi hoạt động tốt trên cả máy tính và thiết bị di động.
    - **Không lỗi:** Code phải hoạt động mà không có lỗi JavaScript trong console.

    ## Định dạng đầu ra
    Kết quả cuối cùng phải được cung cấp dưới dạng một đối tượng JSON tối giản với cấu trúc sau:
    - **\`title\`**: (string) Tiêu đề của trò chơi.
    - **\`description\`**: (string) Mô tả ngắn về trò chơi.
    - **\`content\`**: (string) Mã HTML đầy đủ của trò chơi.

    **Chi tiết quan trọng cho JSON đầu ra:**
    - Không bao gồm bất kỳ định dạng markdown, dấu phân cách khối code hoặc văn bản giải thích bên ngoài JSON. Phản hồi chỉ nên là đối tượng JSON.
    - JSON phải được định dạng đúng và thoát các ký tự đặc biệt.
    - Chuỗi \`content\` phải chứa một tài liệu HTML hoàn chỉnh, hợp lệ.

    GIAO KẾT QUẢ DƯỚi DẠNG MỘT ĐỐI TƯỢNG JSON HỢP LỆ DUY NHẤT KHÔNG CÓ MARKDOWN HOẶC DẤU BACKTICK.
  `;

  try {
    console.log("🔷 Gemini: Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("🔷 Gemini: Response received, extracting JSON...");
    console.log("🔷 Gemini: Response length:", text.length);
    
    // Enhanced JSON extraction and cleaning
    try {
      // First prepare the text by trimming unnecessary parts
      const preparedText = text.trim()
        // Remove markdown code blocks if present
        .replace(/```json\s+/g, '')
        .replace(/```\s*$/g, '')
        // Remove leading/trailing whitespace
        .trim();
      
      // Method 1: Try JSON.parse directly if it's valid JSON
      try {
        // Check if the entire response is a valid JSON
        const gameData = JSON.parse(preparedText);
        console.log("🔷 Gemini: Valid JSON, extraction successful");
        
        return {
          title: gameData.title || topic,
          description: gameData.description || "",
          content: gameData.content || ''
        };
      } catch (directParseError) {
        console.log("🔷 Gemini: Cannot parse directly, trying method 2...");
        console.log("🔷 Gemini: Parse error:", directParseError.message);
      }
      
      // Method 2: Use regex to find and extract JSON object
      const jsonMatch = text.match(/{[\s\S]*?(?:}(?=[,\s]|$))/);
      if (jsonMatch) {
        // Clean the JSON string - replace problematic characters
        const cleanedJson = jsonMatch[0]
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
          .replace(/\\(?!["\\/bfnrt])/g, "\\\\") // Fix invalid escape sequences
          .replace(/([^\\])"/g, '$1\\"') // Escape unescaped quotes
          .replace(/([^\\])'/g, '$1"') // Replace single quotes with double quotes
          .replace(/\\n/g, "\\n") // Properly escape newlines
          .replace(/\\r/g, "\\r") // Properly escape carriage returns
          .replace(/\\t/g, "\\t") // Properly escape tabs
          .replace(/\\\\/g, "\\\\") // Fix double backslashes
          .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
          .replace(/[\u2018\u2019]/g, "'"); // Replace smart quotes
        
        console.log("🔷 Gemini: Parsing JSON from response (method 2)...");
        try {
          // Try with JSON5 parsing approach (more lenient)
          const jsonString = `(${cleanedJson})`;
          const gameData = eval(jsonString); // Using eval as a last resort for malformed JSON
          
          console.log(`🔷 Gemini: Successfully created game "${gameData.title || 'No title'}"`);
          console.log(`🔷 Gemini: Description: ${gameData.description || 'No description'}`);
          console.log(`🔷 Gemini: Code size: ${(gameData.content?.length || 0).toLocaleString()} characters`);
          
          return {
            title: gameData.title || topic,
            description: gameData.description || "",
            content: gameData.content || ''
          };
        } catch (jsonError) {
          console.error("❌ Gemini: JSON parsing error (method 2):", jsonError);
          console.log("🔷 Gemini: Using manual extraction method...");
        }
      }
      
      // Method 3: Manual extraction as final fallback
      console.log("🔷 Gemini: Using manual extraction method (regex)...");
      
      // Extract content with a more robust pattern
      let content = '';
      const contentStart = text.indexOf('"content"');
      if (contentStart !== -1) {
        // Find the first quote after "content":
        const firstQuotePos = text.indexOf('"', contentStart + 10);
        if (firstQuotePos !== -1) {
          // Now find the closing quote, accounting for escaped quotes
          let pos = firstQuotePos + 1;
          let foundClosingQuote = false;
          let level = 0;
          
          while (pos < text.length) {
            if (text[pos] === '"' && text[pos-1] !== '\\') {
              if (level === 0) {
                foundClosingQuote = true;
                break;
              }
              level--;
            }
            pos++;
          }
          
          if (foundClosingQuote) {
            content = text.substring(firstQuotePos + 1, pos)
              .replace(/\\"/g, '"')
              .replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t')
              .replace(/\\\\/g, '\\');
          }
        }
      }
      
      // If we couldn't extract content, try a different approach
      if (!content) {
        const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*}|"\s*$)/);
        if (contentMatch) {
          content = contentMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\');
        }
      }
      
      if (content) {
        console.log("🔷 Gemini: Successful extraction using regex");
        return {
          title: topic,
          description: "",
          content: content
        };
      }
      
      // Last resort: Extract any HTML content
      const htmlMatch = text.match(/<html[\s\S]*<\/html>/i);
      if (htmlMatch) {
        console.log("🔷 Gemini: Successful HTML extraction");
        return {
          title: topic,
          description: "",
          content: htmlMatch[0]
        };
      }
      
      throw new Error("Cannot extract JSON or HTML from response");
    } catch (extractionError) {
      console.error("❌ Gemini: Extraction error:", extractionError);
      return null;
    }
  } catch (error) {
    console.error("❌ Gemini: Error generating with Gemini:", error);
    throw error; // Rethrow for retry mechanism
  }
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData, 
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 5; // Maximum number of retries
  
  if (retryCount >= maxRetries) {
    console.log(`⚠️ Gemini: Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    console.log(`⏳ Gemini: Attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithGemini(model, topic, settings);
  } catch (error) {
    console.error(`❌ Gemini: Attempt ${retryCount + 1} failed:`, error);
    // Wait a bit before retrying (increasing wait time with each retry)
    const waitTime = (retryCount + 1) * 1500; // Increase wait time between retries
    console.log(`⏳ Gemini: Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};
