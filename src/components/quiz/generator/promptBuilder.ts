
import { GameSettingsData } from '../types';
import { getGameSpecificInstructions, getSettingsPrompt } from './gameInstructions';
import { getImageInstructions } from './imageInstructions';

/**
 * Builds a complete prompt for the Gemini API based on game parameters
 * @param topic The topic of the game
 * @param gameTypeId Optional game type ID
 * @param settings Optional game settings
 * @param requiresImages Whether the game requires images
 * @returns Complete prompt string for Gemini API
 */
export const buildGeminiPrompt = (
  topic: string, 
  gameTypeId: string | undefined, 
  settings?: GameSettingsData,
  requiresImages: boolean = false
): string => {
  const gameSpecificInstructions = getGameSpecificInstructions(gameTypeId, topic);
  const imageInstructions = requiresImages ? getImageInstructions() : '';
  const settingsPrompt = getSettingsPrompt(settings);

  return `
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
};
