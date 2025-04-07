
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

  // Generate game-specific instructions based on the detected game type
  let gameSpecificInstructions = '';
  
  switch(gameType?.id) {
    case 'quiz':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Trắc nghiệm ABCD
      
      - Tạo câu hỏi trắc nghiệm với 4 lựa chọn A, B, C, D rõ ràng
      - Mỗi câu hỏi chỉ có đúng một đáp án đúng
      - Các lựa chọn phải rõ ràng, không mơ hồ hoặc chồng chéo
      - Sử dụng giao diện nút bấm rõ ràng, dễ nhấn cả trên mobile
      - Hiển thị phản hồi ngay khi người chơi chọn đáp án
      - Đếm điểm và hiển thị kết quả tổng kết cuối game
      - Tránh sử dụng hình ảnh không cần thiết
      `;
      break;
    
    case 'flashcards':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Thẻ ghi nhớ
      
      - Tạo bộ thẻ có hai mặt: một mặt hiển thị câu hỏi/từ, mặt sau hiển thị đáp án
      - Sử dụng animation đơn giản để lật thẻ khi người dùng click/tap
      - Mỗi thẻ hiển thị một khái niệm, không quá nhiều thông tin
      - Có nút "Tiếp theo" và "Quay lại" rõ ràng để điều hướng giữa các thẻ
      - Có nút "Lật thẻ" để xem đáp án
      - Thêm tùy chọn để người dùng đánh dấu thẻ "Đã thuộc" hoặc "Cần ôn lại"
      - Đảm bảo thẻ có kích thước phù hợp trên cả màn hình lớn và nhỏ
      `;
      break;
    
    case 'unjumble':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Xếp lại câu
      
      - Tạo các câu có ý nghĩa liên quan đến chủ đề "${topic}"
      - Các từ được hiển thị ngẫu nhiên, không theo thứ tự ban đầu
      - Người dùng có thể kéo/thả hoặc click vào từ để sắp xếp
      - Giới hạn số từ trong mỗi câu (không quá 10 từ)
      - Sử dụng từ ngữ đơn giản, rõ ràng
      - Cung cấp gợi ý nếu người dùng gặp khó khăn
      - Kiểm tra đáp án ngay khi người dùng hoàn thành câu
      - Thiết kế responsive, dễ dàng sử dụng trên màn hình cảm ứng
      `;
      break;
    
    case 'sentence':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Điền vào chỗ trống
      
      - Tạo các câu có nghĩa với một từ bị thiếu (được thay bằng dấu gạch ngang hoặc ô trống)
      - Mỗi câu chỉ thiếu một từ để tránh phức tạp
      - Cung cấp gợi ý cho từ cần điền
      - Sử dụng ô input đơn giản để người dùng nhập đáp án
      - Cho phép kiểm tra đáp án với nút "Kiểm tra"
      - Đáp án không phân biệt hoa thường và dấu câu
      - Hiển thị phản hồi ngay khi người dùng nhập đáp án
      `;
      break;
    
    case 'truefalse':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Đúng hay sai
      
      - Tạo các phát biểu rõ ràng về chủ đề "${topic}"
      - Mỗi phát biểu phải rõ ràng là đúng hoặc sai, không mơ hồ
      - Sử dụng hai nút lớn, dễ nhấn: "Đúng" và "Sai"
      - Hiển thị giải thích ngắn gọn sau khi người dùng chọn
      - Sử dụng màu sắc trực quan (xanh cho đúng, đỏ cho sai)
      - Đếm điểm người chơi và hiển thị tổng điểm
      - Tối ưu cho cả desktop và mobile
      `;
      break;
    
    case 'mathgenerator':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Đố vui Toán học
      
      - Tạo các phép tính đơn giản phù hợp với chủ đề
      - Sử dụng phép cộng, trừ, nhân, chia cơ bản
      - Tránh tạo phép tính quá phức tạp hoặc có kết quả là số thập phân dài
      - Sử dụng ô input rõ ràng để nhập kết quả
      - Cho phép người dùng sử dụng máy tính đơn giản trong game
      - Kiểm tra đáp án ngay khi nhập, cho phép làm tròn hợp lý
      - Hiển thị cách giải chi tiết sau khi trả lời
      `;
      break;
    
    case 'riddle':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Câu đố mẹo
      
      - Tạo các câu đố vui, dễ hiểu liên quan đến chủ đề "${topic}"
      - Câu đố phải có logic rõ ràng, không quá khó hiểu
      - Cung cấp hệ thống gợi ý theo cấp độ (từ gợi ý nhẹ đến rõ ràng)
      - Cho phép người dùng nhập đáp án tự do
      - Kiểm tra đáp án linh hoạt (chấp nhận các cách diễn đạt khác nhau)
      - Hiển thị giải thích sau khi người dùng trả lời
      - Thiết kế giao diện thân thiện, không gây căng thẳng
      `;
      break;
    
    case 'matching':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Nối từ
      
      - Tạo tối đa 8 cặp từ/khái niệm và định nghĩa tương ứng
      - Hiển thị rõ ràng hai cột: một cột chứa từ, một cột chứa định nghĩa
      - Sử dụng chức năng kéo/thả hoặc click tuần tự để nối
      - Các cặp từ đúng sẽ được nối bằng đường thẳng hoặc đổi màu
      - Các cặp từ có liên quan chặt chẽ với chủ đề "${topic}"
      - Thiết kế responsive, phù hợp với cả màn hình nhỏ
      - Cập nhật điểm số và hiển thị kết quả cuối cùng
      `;
      break;
    
    case 'pictionary':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Đoán từ qua hình
      
      - Chỉ sử dụng mô tả text-based cho hình ảnh, không nhúng hình ảnh thật
      - Tạo mô tả hình vẽ đơn giản bằng ASCII art hoặc Unicode
      - Cho phép người dùng nhập đáp án vào ô input
      - Cung cấp gợi ý nếu người dùng gặp khó khăn
      - Các từ cần đoán liên quan chặt chẽ đến chủ đề "${topic}"
      - Đáp án không phân biệt hoa thường
      - Hỗ trợ nhiều cách diễn đạt đúng khác nhau
      `;
      break;
    
    case 'wordsearch':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Tìm từ ẩn
      
      - Tạo bảng chữ cái kích thước vừa phải (không quá 10x10)
      - Sử dụng tối đa 8 từ liên quan đến chủ đề "${topic}"
      - Các từ chỉ được sắp xếp theo chiều ngang hoặc dọc (không có chéo)
      - Hiển thị danh sách các từ cần tìm ở bên cạnh bảng
      - Cho phép đánh dấu từ bằng cách click vào ô đầu và ô cuối
      - Từ được tìm thấy sẽ được tô màu hoặc gạch ngang
      - Đảm bảo khoảng cách giữa các ô đủ lớn cho thiết bị cảm ứng
      - Sử dụng JavaScript đơn giản để xử lý tương tác
      `;
      break;
    
    case 'categorizing':
      gameSpecificInstructions = `
      ## Hướng dẫn cho trò chơi Phân loại
      
      - Tạo 2-4 nhóm phân loại rõ ràng liên quan đến chủ đề "${topic}"
      - Mỗi nhóm có 4-6 mục cần phân loại
      - Sử dụng giao diện kéo/thả để phân loại các mục
      - Các mục ban đầu được hiển thị ngẫu nhiên ở khu vực chờ
      - Hiển thị tiêu đề rõ ràng cho mỗi nhóm phân loại
      - Kiểm tra kết quả khi người dùng phân loại xong tất cả các mục
      - Thiết kế responsive, tối ưu trên cả desktop và mobile
      - Sử dụng màu sắc trực quan để phân biệt các nhóm
      `;
      break;
    
    default:
      gameSpecificInstructions = `
      ## Hướng dẫn chung cho trò chơi học tập
      
      - Tạo trò chơi đơn giản, dễ hiểu liên quan đến chủ đề "${topic}"
      - Sử dụng giao diện trực quan, dễ sử dụng
      - Tối ưu cho cả desktop và thiết bị di động
      - Đảm bảo hướng dẫn chơi rõ ràng
      - Tránh sử dụng các chức năng phức tạp
      - Hiển thị điểm số và kết quả rõ ràng
      - Tập trung vào trải nghiệm học tập thú vị
      `;
  }

  // Base prompt template with enhanced HTML validation and error handling
  const prompt = `
    # Trò chơi giáo dục tương tác đơn file

    ## Mục tiêu
    Tạo một trò chơi giáo dục tương tác chất lượng cao về chủ đề "${topic}". Trò chơi phải hoạt động hoàn toàn trong một file HTML duy nhất (với CSS và JavaScript được nhúng bên trong).

    ${gameSpecificInstructions}

    ## Yêu cầu kỹ thuật
    - **Giải pháp một file:** Tất cả HTML, CSS và JavaScript phải được chứa trong một file HTML duy nhất.
    - **Không sử dụng thư viện bên ngoài:** Không sử dụng jQuery, Bootstrap hay bất kỳ thư viện bên ngoài nào. Chỉ sử dụng Vanilla JavaScript.
    - **Cấu trúc HTML hợp lệ:** Sử dụng thẻ HTML5 đúng cách, đảm bảo tất cả thẻ đều đóng đúng cách.
    - **Thiết kế responsive:** Đảm bảo trò chơi hiển thị và hoạt động tốt trên mọi kích thước màn hình.
    - **Xử lý lỗi:** Thêm try-catch và validation để xử lý lỗi người dùng.
    - **Script DOM Ready:** Đặt tất cả code JavaScript trong event listener 'DOMContentLoaded'.
    - **Tương thích trình duyệt:** Sử dụng các tính năng JavaScript được hỗ trợ rộng rãi.
    - **Tối ưu hiệu suất:** Tránh vòng lặp lồng nhau phức tạp và DOM manipulation không cần thiết.

    ## Phòng tránh lỗi phổ biến
    - **Tránh click handlers không hoạt động:** Đảm bảo event listeners được đính kèm đúng cách.
    - **Tránh lỗi responsive:** Kiểm tra rằng UI không bị vỡ trên màn hình nhỏ.
    - **Tránh lỗi undefined:** Luôn kiểm tra biến trước khi sử dụng.
    - **Tránh lỗi CSS overflow:** Đảm bảo nội dung không tràn khỏi container.
    - **Tránh lỗi input validation:** Kiểm tra và làm sạch dữ liệu input từ người dùng.
    - **Tránh chồng chéo z-index:** Đảm bảo các phần tử không bị chồng lấp không mong muốn.
    - **Tránh animation lag:** Sử dụng CSS transitions thay vì JavaScript animations khi có thể.

    ${settingsPrompt}

    ## Cấu trúc file cuối cùng
    ```html
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trò chơi: ${topic}</title>
        <style>
            /* CSS ở đây */
        </style>
    </head>
    <body>
        <!-- HTML content ở đây -->
        
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // JavaScript ở đây
                
                // Luôn có try-catch để xử lý lỗi
                try {
                    // Game initialization code
                } catch (error) {
                    console.error('Game error:', error);
                    // Show user-friendly error message
                }
            });
        </script>
    </body>
    </html>
    ```

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
        
        // Validate HTML content to catch common issues
        if (!gameData.content || !gameData.content.includes('<!DOCTYPE html>')) {
          console.warn("🔷 Gemini: HTML content may be incomplete, adding DOCTYPE");
          gameData.content = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameData.title || topic}</title>
</head>
<body>
    ${gameData.content || '<div>Content generation error</div>'}
</body>
</html>`;
        }
        
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
          
          // Validate and fix HTML content
          let htmlContent = gameData.content || '';
          
          // Ensure HTML has proper structure
          if (!htmlContent.includes('<!DOCTYPE html>')) {
            console.warn("🔷 Gemini: Adding missing DOCTYPE and HTML structure");
            htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameData.title || topic}</title>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
          }
          
          // Check for unclosed tags
          const openTags = (htmlContent.match(/<[a-z][^>]*>/gi) || []).length;
          const closeTags = (htmlContent.match(/<\/[a-z][^>]*>/gi) || []).length;
          if (openTags > closeTags) {
            console.warn(`🔷 Gemini: Possible unclosed tags detected (${openTags} open vs ${closeTags} close)`);
          }
          
          return {
            title: gameData.title || topic,
            description: gameData.description || "",
            content: htmlContent
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
      
      // Ensure content has proper HTML structure
      if (content && !content.includes('<!DOCTYPE html>')) {
        console.warn("🔷 Gemini: Adding proper HTML structure to content");
        content = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topic}</title>
</head>
<body>
    ${content}
</body>
</html>`;
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
