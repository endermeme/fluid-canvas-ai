
import { GameSettingsData } from '../types';

/**
 * Generates game-specific instructions based on the game type
 * @param gameTypeId The ID of the game type
 * @param topic The topic of the game
 * @returns string with game-specific instructions
 */
export const getGameSpecificInstructions = (gameTypeId: string | undefined, topic: string): string => {
  switch(gameTypeId) {
    case 'quiz':
      return `
      ## Hướng dẫn cho trò chơi Trắc nghiệm ABCD
      
      - Tạo câu hỏi trắc nghiệm với 4 lựa chọn A, B, C, D rõ ràng
      - Mỗi câu hỏi chỉ có đúng một đáp án đúng
      - Các lựa chọn phải rõ ràng, không mơ hồ hoặc chồng chéo
      - Sử dụng giao diện nút bấm rõ ràng, dễ nhấn cả trên mobile
      - Hiển thị phản hồi ngay khi người chơi chọn đáp án
      - Đếm điểm và hiển thị kết quả tổng kết cuối game
      - Tránh sử dụng hình ảnh không cần thiết
      `;
    
    case 'flashcards':
      return `
      ## Hướng dẫn cho trò chơi Thẻ ghi nhớ
      
      - Tạo bộ thẻ có hai mặt: một mặt hiển thị câu hỏi/từ, mặt sau hiển thị đáp án
      - Sử dụng animation đơn giản để lật thẻ khi người dùng click/tap
      - Mỗi thẻ hiển thị một khái niệm, không quá nhiều thông tin
      - Có nút "Tiếp theo" và "Quay lại" rõ ràng để điều hướng giữa các thẻ
      - Có nút "Lật thẻ" để xem đáp án
      - Thêm tùy chọn để người dùng đánh dấu thẻ "Đã thuộc" hoặc "Cần ôn lại"
      - Đảm bảo thẻ có kích thước phù hợp trên cả màn hình lớn và nhỏ
      `;
    
    case 'unjumble':
      return `
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
    
    case 'sentence':
      return `
      ## Hướng dẫn cho trò chơi Điền vào chỗ trống
      
      - Tạo các câu có nghĩa với một từ bị thiếu (được thay bằng dấu gạch ngang hoặc ô trống)
      - Mỗi câu chỉ thiếu một từ để tránh phức tạp
      - Cung cấp gợi ý cho từ cần điền
      - Sử dụng ô input đơn giản để người dùng nhập đáp án
      - Cho phép kiểm tra đáp án với nút "Kiểm tra"
      - Đáp án không phân biệt hoa thường và dấu câu
      - Hiển thị phản hồi ngay khi người dùng nhập đáp án
      `;
    
    case 'truefalse':
      return `
      ## Hướng dẫn cho trò chơi Đúng hay sai
      
      - Tạo các phát biểu rõ ràng về chủ đề "${topic}"
      - Mỗi phát biểu phải rõ ràng là đúng hoặc sai, không mơ hồ
      - Sử dụng hai nút lớn, dễ nhấn: "Đúng" và "Sai"
      - Hiển thị giải thích ngắn gọn sau khi người dùng chọn
      - Sử dụng màu sắc trực quan (xanh cho đúng, đỏ cho sai)
      - Đếm điểm người chơi và hiển thị tổng điểm
      - Tối ưu cho cả desktop và mobile
      `;
    
    case 'mathgenerator':
      return `
      ## Hướng dẫn cho trò chơi Đố vui Toán học
      
      - Tạo các phép tính đơn giản phù hợp với chủ đề
      - Sử dụng phép cộng, trừ, nhân, chia cơ bản
      - Tránh tạo phép tính quá phức tạp hoặc có kết quả là số thập phân dài
      - Sử dụng ô input rõ ràng để nhập kết quả
      - Cho phép người dùng sử dụng máy tính đơn giản trong game
      - Kiểm tra đáp án ngay khi nhập, cho phép làm tròn hợp lý
      - Hiển thị cách giải chi tiết sau khi trả lời
      `;
    
    case 'riddle':
      return `
      ## Hướng dẫn cho trò chơi Câu đố mẹo
      
      - Tạo các câu đố vui, dễ hiểu liên quan đến chủ đề "${topic}"
      - Câu đố phải có logic rõ ràng, không quá khó hiểu
      - Cung cấp hệ thống gợi ý theo cấp độ (từ gợi ý nhẹ đến rõ ràng)
      - Cho phép người dùng nhập đáp án tự do
      - Kiểm tra đáp án linh hoạt (chấp nhận các cách diễn đạt khác nhau)
      - Hiển thị giải thích sau khi người dùng trả lời
      - Thiết kế giao diện thân thiện, không gây căng thẳng
      `;
    
    case 'matching':
      return `
      ## Hướng dẫn cho trò chơi Nối từ
      
      - Tạo tối đa 8 cặp từ/khái niệm và định nghĩa tương ứng
      - Hiển thị rõ ràng hai cột: một cột chứa từ, một cột chứa định nghĩa
      - Sử dụng chức năng kéo/thả hoặc click tuần tự để nối
      - Các cặp từ đúng sẽ được nối bằng đường thẳng hoặc đổi màu
      - Các cặp từ có liên quan chặt chẽ với chủ đề "${topic}"
      - Thiết kế responsive, phù hợp với cả màn hình nhỏ
      - Cập nhật điểm số và hiển thị kết quả cuối cùng
      `;
    
    case 'pictionary':
      return `
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
    
    case 'wordsearch':
      return `
      ## Hướng dẫn cho trò chơi Tìm từ ẩn
      
      - Tạo bảng chữ cái kích thước phù hợp (8x8 cho dễ, 12x12 cho trung bình, 15x15 cho khó)
      - Sử dụng 7-15 từ liên quan đến chủ đề "${topic}"
      - Các từ được sắp xếp theo nhiều hướng: ngang, dọc và chéo (chéo tùy theo độ khó)
      - Hiển thị danh sách các từ cần tìm ở bên cạnh bảng
      - Cho phép đánh dấu từ bằng cách click vào ô đầu và ô cuối
      - Từ được tìm thấy sẽ được tô màu xanh và gạch ngang trong danh sách
      - Tạo JSON trả về có cấu trúc rõ ràng với từ khóa settings có thuộc tính allowDiagonalWords: true/false
      - Đảm bảo khoảng cách giữa các ô đủ lớn cho thiết bị cảm ứng
      - Trả về JSON hợp lệ để có thể parse thành JavaScript object
      `;
    
    case 'categorizing':
      return `
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
    
    default:
      return `
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
};

/**
 * Generates settings prompt based on game settings
 * @param settings The game settings
 * @returns string with settings prompt
 */
export const getSettingsPrompt = (settings?: GameSettingsData): string => {
  if (!settings) return '';
  
  return `
    Create with these settings:
    - Difficulty: ${settings.difficulty}
    - Number of questions/challenges: ${settings.questionCount}
    - Time per question/challenge: ${settings.timePerQuestion} seconds
    - Category: ${settings.category}
  `;
};
