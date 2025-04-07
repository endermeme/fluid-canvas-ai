
import { GamePresetTemplate } from './gamePresetData';

/**
 * Builds a prompt for the AI based on the selected preset and custom content
 * @param preset The selected game preset template
 * @param customContent User's custom content for the game
 * @returns Complete prompt string for the AI
 */
export const buildPresetPrompt = (
  preset: GamePresetTemplate | undefined,
  customContent: string
): string => {
  if (!preset) {
    // Default prompt for custom requests
    return `
      # Trò chơi giáo dục tương tác đơn file
      
      ## Mục tiêu
      Tạo một trò chơi giáo dục tương tác chất lượng cao về chủ đề "${customContent}". Trò chơi phải hoạt động hoàn toàn trong một file HTML duy nhất (với CSS và JavaScript được nhúng bên trong).
      
      ## Yêu cầu chung
      - Tạo trò chơi đơn giản, dễ hiểu liên quan đến chủ đề "${customContent}"
      - Sử dụng giao diện trực quan, dễ sử dụng
      - Tối ưu cho cả desktop và thiết bị di động
      - Đảm bảo hướng dẫn chơi rõ ràng
      
      ## Định dạng đầu ra
      Kết quả cuối cùng phải được cung cấp dưới dạng một đối tượng JSON tối giản với cấu trúc sau:
      {
        "title": "Tiêu đề của trò chơi",
        "description": "Mô tả ngắn về trò chơi",
        "content": "Mã HTML đầy đủ của trò chơi"
      }
    `;
  }

  // Replace placeholders in the prompt template
  let promptContent = preset.promptTemplate.replace('{{content}}', customContent);

  // Add specific settings based on the preset
  const settingsPrompt = `
    Create with these settings:
    - Difficulty: ${preset.difficulty}
    - Number of questions/challenges: ${preset.questionCount}
    - Time per question/challenge: ${preset.timePerQuestion} seconds
    - Category: ${preset.category}
  `;

  // Build complete prompt
  return `
    # Trò chơi giáo dục tương tác đơn file - ${preset.name}
    
    ## Mục tiêu
    ${promptContent}
    
    ## Loại trò chơi
    Mẫu: ${preset.template}
    Loại: ${preset.name}
    
    ${settingsPrompt}
    
    ## Yêu cầu kỹ thuật
    - **Giải pháp một file:** Tất cả HTML, CSS và JavaScript phải được chứa trong một file HTML duy nhất.
    - **Không sử dụng thư viện bên ngoài:** Chỉ sử dụng Vanilla JavaScript.
    - **Cấu trúc HTML hợp lệ:** Sử dụng thẻ HTML5 đúng cách, đảm bảo tất cả thẻ đều đóng đúng cách.
    - **Thiết kế responsive:** Đảm bảo trò chơi hiển thị và hoạt động tốt trên mọi kích thước màn hình.
    - **Xử lý lỗi:** Thêm try-catch và validation để xử lý lỗi người dùng.
    - **Script DOM Ready:** Đặt tất cả code JavaScript trong event listener 'DOMContentLoaded'.
    
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
};
