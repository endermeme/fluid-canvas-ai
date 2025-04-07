
import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';

export const generateWithGemini = async (
  model: any, 
  topic: string, 
  settings?: GameSettingsData,
  requiresImages: boolean = false
): Promise<MiniGame | null> => {
  // Get game type from topic to provide better context for the AI
  const gameType = getGameTypeByTopic(topic);
  const gameDescription = gameType ? gameType.description : "interactive learning game";
  
  console.log(`🔷 Gemini: Starting game generation for "${topic}" - Type: ${gameType?.name || "Not specified"}`);
  console.log(`🔷 Gemini: Settings: ${JSON.stringify(settings || {})}`);
  console.log(`🔷 Gemini: Requires images: ${requiresImages}`);
  
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
      
      - Sử dụng hình ảnh thực tế từ các nguồn có thật (xem phần "Xử lý hình ảnh đặc biệt")
      - Ưu tiên sử dụng URL hình ảnh từ Google Images, Wikipedia hoặc các nguồn uy tín
      - Tạo 5-10 câu hỏi đoán từ dựa trên hình ảnh
      - Mỗi câu hỏi có một hình ảnh liên quan đến chủ đề "${topic}"
      - Cho phép người dùng nhập đáp án vào ô input
      - Cung cấp gợi ý nếu người dùng gặp khó khăn
      - Đáp án không phân biệt hoa thường
      - Hiển thị điểm số và kết quả cuối cùng
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

  // Enhanced instructions for image-related games
  let imageInstructions = '';
  if (requiresImages) {
    imageInstructions = `
    ## Chỉ dẫn đặc biệt cho trò chơi có hình ảnh
    
    - QUAN TRỌNG: Nếu trò chơi cần hình ảnh, hãy sử dụng một trong các cách sau để cung cấp hình ảnh:
      1. Sử dụng URL hình ảnh cố định từ Wikipedia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/[...].jpg'
         Ví dụ: https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_processing_1.png/300px-Image_processing_1.png
      2. Sử dụng URL hình ảnh từ Pixabay:
         'https://pixabay.com/get/[image_id].jpg'
         Ví dụ: https://pixabay.com/get/g195c7ac0b32fb8ca4ccc9acbe03fcc38a2f064fd2ef9f0e4dd5c8f5b96a0c55c0a21c5c43429d0dcce92b26dda0aea13_1280.jpg
      3. Sử dụng URL hình ảnh từ Google Images cache
         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS[...]'
         Ví dụ: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC-qbvZ0MJEhAbgDZqf9KQgWNYJKrNLeFa4q5W8ZK6yQ&s
      4. Sử dụng URL hình ảnh từ placeholder.com: 'https://via.placeholder.com/[width]x[height].png?text=[text]'
         Ví dụ: https://via.placeholder.com/300x200.png?text=Forest
      5. Sử dụng URL ảnh từ dummyimage.com: 'https://dummyimage.com/[width]x[height]/[color]/[textcolor]&text=[text]'
         Ví dụ: https://dummyimage.com/300x200/7EC0EE/333333&text=Ocean
      6. Sử dụng inline SVG trực tiếp trong HTML khi cần đồ họa đơn giản
         Ví dụ: <svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="red" /></svg>
      7. Sử dụng base64 cho ảnh nhỏ (tối đa 3-5 ảnh nhỏ)
         Ví dụ: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." />
      8. Tạo hình ảnh ASCII/Unicode art khi các phương pháp trên không khả dụng

    - TUYỆT ĐỐI KHÔNG SỬ DỤNG URL từ source.unsplash.com vì chúng không ổn định
    - TUYỆT ĐỐI KHÔNG SỬ DỤNG URL từ loremflickr.com vì chúng không ổn định
    - Khi sử dụng hình ảnh từ Wikipedia, sử dụng đường dẫn trực tiếp tới file ảnh, không dùng URL tới bài viết
    - Đối với ảnh từ Pixabay, chỉ sử dụng URL có dạng https://pixabay.com/get/[...]
    - Khi sử dụng ảnh từ Google, chỉ dùng URL có dạng https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS[...]
    - Đối với trò chơi ghép thẻ hình ảnh (memory card), sử dụng 4-8 hình ảnh khác nhau với URL chắc chắn hoạt động
    - Luôn cung cấp text thay thế cho ảnh (alt text) để đảm bảo trò chơi vẫn hoạt động nếu ảnh không tải được
    - Khi một URL ảnh không khả dụng, hiển thị một hình ảnh phù hợp tạo bằng SVG hoặc base64
    - Luôn có một backup plan nếu tất cả các hình ảnh không tải được (ví dụ: chuyển sang chế độ văn bản)

    ## Xử lý hình ảnh đúng cách trong JavaScript
    - Thêm event handler onerror cho mọi thẻ <img>:
      <img src="URL" alt="Mô tả" onerror="this.onerror=null; this.src='URL_DỰ_PHÒNG'; this.alt='Không thể tải hình';">
    - Thử tải hình ảnh trước khi sử dụng:
      ```javascript
      function preloadImage(url, successCallback, errorCallback) {
        const img = new Image();
        img.onload = successCallback;
        img.onerror = errorCallback;
        img.src = url;
      }
      ```
    - Chuẩn bị các URL dự phòng cho mỗi hình ảnh cần thiết
    - Tạo SVG động nếu tất cả URL dự phòng đều thất bại
    `;
  }

  // Base prompt template with enhanced HTML validation and error handling
  const prompt = `
    # Trò chơi giáo dục tương tác đơn file

    ## Mục tiêu
    Tạo một trò chơi giáo dục tương tác chất lượng cao về chủ đề "${topic}". Trò chơi phải hoạt động hoàn toàn trong một file HTML duy nhất (với CSS và JavaScript được nhúng bên trong).

    ${gameSpecificInstructions}
    ${imageInstructions}

    ## Yêu cầu kỹ thuật
    - **Giải pháp một file:** Tất cả HTML, CSS và JavaScript phải được chứa trong một file HTML duy nhất.
    - **Không sử dụng thư viện bên ngoài:** Không sử dụng jQuery, Bootstrap hay bất kỳ thư viện bên ngoài nào. Chỉ sử dụng Vanilla JavaScript.
    - **Cấu trúc HTML hợp lệ:** Sử dụng thẻ HTML5 đúng cách, đảm bảo tất cả thẻ đều đóng đúng cách.
    - **Thiết kế responsive:** Đảm bảo trò chơi hiển thị và hoạt động tốt trên mọi kích thước màn hình.
    - **Xử lý lỗi:** Thêm try-catch và validation để xử lý lỗi người dùng.
    - **Script DOM Ready:** Đặt tất cả code JavaScript trong event listener 'DOMContentLoaded'.
    - **Tương thích trình duyệt:** Sử dụng các tính năng JavaScript được hỗ trợ rộng rãi.
    - **Tối ưu hiệu suất:** Tránh vòng lặp lồng nhau phức tạp và DOM manipulation không cần thiết.
    - **Xử lý hình ảnh:** Nếu trò chơi cần hình ảnh, sử dụng các dịch vụ hình ảnh miễn phí như đã nêu.

    ## Xử lý hình ảnh đặc biệt
    - **Đảm bảo hình ảnh hoạt động:** Luôn sử dụng URL hình ảnh cố định, không dùng API ngẫu nhiên
    - **Có nhiều nguồn ảnh dự phòng:** Nếu một URL không hoạt động, hiển thị ảnh dự phòng
    - **SVG Fallback:** Tạo SVG đơn giản làm dự phòng cuối cùng
    - **Xử lý lỗi hình ảnh:** Luôn thêm thuộc tính onerror cho thẻ img
    - **Preload images:** Tải trước hình ảnh để tránh độ trễ khi chơi
    - **Hướng dẫn chi tiết:** Cho trò chơi hình ảnh, hãy bổ sung hướng dẫn cách chơi rõ ràng

    ## Phòng tránh lỗi phổ biến
    - **Tránh click handlers không hoạt động:** Đảm bảo event listeners được đính kèm đúng cách.
    - **Tránh lỗi responsive:** Kiểm tra rằng UI không bị vỡ trên màn hình nhỏ.
    - **Tránh lỗi undefined:** Luôn kiểm tra biến trước khi sử dụng.
    - **Tránh lỗi CSS overflow:** Đảm bảo nội dung không tràn khỏi container.
    - **Tránh lỗi input validation:** Kiểm tra và làm sạch dữ liệu input từ người dùng.
    - **Tránh chồng chéo z-index:** Đảm bảo các phần tử không bị chồng lấp không mong muốn.
    - **Tránh animation lag:** Sử dụng CSS transitions thay vì JavaScript animations khi có thể.
    - **Tránh lỗi hình ảnh không tải được:** Luôn thêm xử lý lỗi cho hình ảnh.
    - **Tránh lỗi chuỗi JSON bị hỏng:** Đảm bảo chuỗi JSON escape đúng các ký tự đặc biệt.

    ${settingsPrompt}

    ## Cấu trúc file cuối cùng
    Một file HTML duy nhất với cấu trúc sau:
    - DOCTYPE và thẻ HTML, head, body đầy đủ
    - CSS trong thẻ style trong phần head
    - JavaScript trong thẻ script ở cuối body
    - Sử dụng DOMContentLoaded để khởi tạo game
    - Xử lý lỗi với try-catch

    ## Định dạng đầu ra
    Kết quả cuối cùng phải được cung cấp dưới dạng một đối tượng JSON tối giản với cấu trúc sau:
    {
      "title": "Tiêu đề của trò chơi",
      "description": "Mô tả ngắn về trò chơi",
      "content": "Mã HTML đầy đủ của trò chơi"
    }

    **Chi tiết quan trọng cho JSON đầu ra:**
    - Không bao gồm bất kỳ định dạng markdown, dấu phân cách khối code hoặc văn bản giải thích bên ngoài JSON.
    - JSON phải được định dạng đúng và thoát các ký tự đặc biệt đúng cách.
    - Trong chuỗi JSON, các dấu ngoặc kép (") phải được escape bằng dấu gạch chéo ngược (\\").
    - Trong chuỗi JSON, các dấu gạch chéo ngược (\\) phải được escape thành (\\\\).
    - Chuỗi "content" phải chứa một tài liệu HTML hoàn chỉnh, hợp lệ.

    GIAO KẾT QUẢ DƯỚI DẠNG MỘT ĐỐI TƯỢNG JSON HỢP LỆ DUY NHẤT KHÔNG CÓ MARKDOWN HOẶC DẤU BACKTICK.
  `;

  try {
    console.log("🔷 Gemini: Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("🔷 Gemini: Response received, extracting JSON...");
    console.log("🔷 Gemini: Response length:", text.length);
    
    // Enhanced JSON extraction and cleaning with more robust error handling
    try {
      // First approach: Try to extract JSON directly
      const jsonRegex = /\{[\s\S]*\}/g;
      const jsonMatch = text.match(jsonRegex);
      
      if (jsonMatch && jsonMatch[0]) {
        try {
          // Try to parse the JSON directly
          const gameData = JSON.parse(jsonMatch[0]);
          
          console.log("🔷 Gemini: Successfully parsed JSON directly");
          console.log(`🔷 Gemini: Game title: "${gameData.title || 'No title'}"`);
          
          return {
            title: gameData.title || topic,
            description: gameData.description || "",
            content: gameData.content || ''
          };
        } catch (parseError) {
          console.log("🔷 Gemini: Direct JSON parse failed, trying with sanitization:", parseError.message);
          
          // Try again with sanitization
          let sanitizedJson = jsonMatch[0]
            .replace(/\\(?!["\\/bfnrt])/g, "\\\\") // Fix invalid escape sequences
            .replace(/\n/g, "\\n")               // Properly escape newlines
            .replace(/\r/g, "\\r")               // Properly escape carriage returns
            .replace(/\t/g, "\\t")               // Properly escape tabs
            .replace(/\f/g, "\\f")               // Properly escape form feeds
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters
          
          try {
            const gameData = JSON.parse(sanitizedJson);
            console.log("🔷 Gemini: JSON parsed after sanitization");
            
            return {
              title: gameData.title || topic,
              description: gameData.description || "",
              content: gameData.content || ''
            };
          } catch (secondParseError) {
            console.log("🔷 Gemini: Sanitized JSON parse failed, moving to manual extraction:", secondParseError.message);
          }
        }
      }
      
      // Fallback: Manual extraction of HTML content
      console.log("🔷 Gemini: Attempting to extract HTML content directly...");
      const htmlRegex = /<!DOCTYPE html>[\s\S]*<\/html>/i;
      const htmlMatch = text.match(htmlRegex);
      
      if (htmlMatch && htmlMatch[0]) {
        console.log("🔷 Gemini: Successfully extracted HTML content");
        return {
          title: topic,
          description: "",
          content: htmlMatch[0]
        };
      }
      
      // Final fallback: Get anything between <html> and </html>
      const fallbackHtmlRegex = /<html[\s\S]*<\/html>/i;
      const fallbackHtmlMatch = text.match(fallbackHtmlRegex);
      
      if (fallbackHtmlMatch && fallbackHtmlMatch[0]) {
        console.log("🔷 Gemini: Extracted HTML with fallback regex");
        const htmlContent = `<!DOCTYPE html>${fallbackHtmlMatch[0]}`;
        return {
          title: topic,
          description: "",
          content: htmlContent
        };
      }
      
      throw new Error("Unable to extract valid content from Gemini response");
    } catch (extractionError) {
      console.error("❌ Gemini: Content extraction error:", extractionError);
      throw extractionError;
    }
  } catch (error) {
    console.error("❌ Gemini: Error generating with Gemini:", error);
    throw error;
  }
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData,
  requiresImages: boolean = false,
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 5; // Maximum number of retries
  
  if (retryCount >= maxRetries) {
    console.log(`⚠️ Gemini: Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    console.log(`⏳ Gemini: Attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithGemini(model, topic, settings, requiresImages);
  } catch (error) {
    console.error(`❌ Gemini: Attempt ${retryCount + 1} failed:`, error);
    // Wait a bit before retrying (increasing wait time with each retry)
    const waitTime = (retryCount + 1) * 1500; // Increase wait time between retries
    console.log(`⏳ Gemini: Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return tryGeminiGeneration(model, topic, settings, requiresImages, retryCount + 1);
  }
};
