
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
    
    case 'matching':
      return `
      ## Hướng dẫn cho trò chơi Nối từ - nghĩa
      
      - Tạo danh sách các từ/khái niệm bên trái và định nghĩa tương ứng bên phải
      - Từ và định nghĩa hiển thị ở hai cột song song với khoảng cách rõ ràng
      - Sử dụng chức năng kéo/thả hoặc nối dòng để kết nối từ với định nghĩa
      - Các cặp từ-nghĩa được ghép đúng sẽ được đánh dấu hoặc đổi màu
      - Trộn ngẫu nhiên vị trí của các định nghĩa để tạo thử thách
      - Cung cấp phản hồi ngay khi người dùng ghép đúng hoặc sai
      - Thiết kế responsive, dễ sử dụng trên cả màn hình lớn và nhỏ
      `;
    
    case 'anagram':
      return `
      ## Hướng dẫn cho trò chơi Xáo chữ tạo từ
      
      - Tạo danh sách các từ có ý nghĩa liên quan đến chủ đề "${topic}"
      - Xáo trộn các chữ cái trong mỗi từ theo cách ngẫu nhiên
      - Người dùng phải sắp xếp lại đúng thứ tự để tạo ra từ có nghĩa
      - Cung cấp gợi ý về từ đang cần sắp xếp (như định nghĩa hoặc mô tả)
      - Cho phép người dùng kéo thả từng chữ cái hoặc nhấn vào chúng theo đúng thứ tự
      - Có nút "Gợi ý" để hiển thị chữ cái đầu tiên hoặc vị trí chính xác của một chữ cái
      - Thiết kế responsive, phù hợp với cả desktop và mobile
      `;
    
    case 'speaking':
      return `
      ## Hướng dẫn cho trò chơi Thẻ nói
      
      - Tạo bộ thẻ với các chủ đề hoặc câu hỏi phong phú liên quan đến "${topic}"
      - Mỗi thẻ hiển thị một câu hỏi hoặc tình huống để người dùng nói về
      - Thêm hướng dẫn hoặc gợi ý về cách diễn đạt nội dung trên thẻ
      - Bao gồm tiêu chí đánh giá (như độ trôi chảy, phát âm, từ vựng...)
      - Có nút để chuyển sang thẻ tiếp theo hoặc quay lại thẻ trước
      - Thêm bộ đếm thời gian tùy chỉnh cho mỗi thẻ nói (ví dụ: 30-60 giây)
      - Thiết kế giao diện đơn giản, tập trung vào nội dung
      `;
    
    case 'memory':
      return `
      ## Hướng dẫn cho trò chơi Tìm cặp giống nhau
      
      - Tạo bộ thẻ gồm các cặp khớp nhau (hình ảnh, từ-nghĩa, từ-hình ảnh...)
      - Tất cả thẻ ban đầu đều úp mặt, người chơi lật 2 thẻ mỗi lượt
      - Nếu 2 thẻ khớp nhau, giữ lật mở và vô hiệu hóa
      - Nếu 2 thẻ không khớp, úp lại sau 1-2 giây
      - Sử dụng animation đơn giản khi lật thẻ để tăng trải nghiệm
      - Đếm số lượt lật để tạo điểm số (càng ít lượt càng tốt)
      - Có thể thêm bộ đếm thời gian để tạo thử thách
      - Thiết kế lưới thẻ responsive, tự điều chỉnh trên các kích thước màn hình
      `;
    
    case 'unjumble':
      return `
      ## Hướng dẫn cho trò chơi Sắp xếp câu
      
      - Tạo các câu có ý nghĩa liên quan đến chủ đề "${topic}"
      - Các từ được hiển thị ngẫu nhiên, không theo thứ tự ban đầu
      - Người dùng có thể kéo/thả từng từ để sắp xếp thành câu có nghĩa
      - Giới hạn số từ trong mỗi câu (không quá 10 từ)
      - Sử dụng từ ngữ đơn giản, rõ ràng
      - Cung cấp gợi ý nếu người dùng gặp khó khăn
      - Kiểm tra đáp án ngay khi người dùng hoàn thành câu
      - Thiết kế responsive, dễ dàng sử dụng trên màn hình cảm ứng
      `;
    
    case 'openbox':
      return `
      ## Hướng dẫn cho trò chơi Mở hộp bí ẩn
      
      - Tạo một bảng gồm nhiều hộp/ô đánh số hoặc ký hiệu
      - Mỗi hộp chứa một câu hỏi, thử thách, hoặc phần thưởng
      - Người chơi lần lượt chọn và mở từng hộp
      - Có thể thêm "hộp bẫy" chứa điểm phạt hoặc thử thách khó
      - Thêm animation khi mở hộp để tăng hứng thú
      - Có thể kết hợp với hệ thống điểm và phần thưởng
      - Thiết kế hộp và nội dung rõ ràng, dễ hiểu
      - Đảm bảo giao diện responsive trên mọi thiết bị
      `;
    
    case 'spinwheel':
      return `
      ## Hướng dẫn cho trò chơi Xoay bánh xe
      
      - Tạo bánh xe chia thành nhiều phân đoạn với nội dung khác nhau
      - Mỗi phân đoạn chứa một câu hỏi, thử thách hoặc phần thưởng
      - Người chơi nhấn nút để quay bánh xe
      - Animation bánh xe quay với tốc độ giảm dần và dừng lại
      - Hiển thị nội dung/nhiệm vụ tương ứng với phân đoạn bánh xe dừng lại
      - Có thể kết hợp với hệ thống điểm và phần thưởng
      - Thiết kế bánh xe đẹp mắt với màu sắc phân biệt rõ ràng
      - Đảm bảo animation mượt mà và trải nghiệm thú vị
      `;
    
    case 'groupsort':
      return `
      ## Hướng dẫn cho trò chơi Phân loại nhóm
      
      - Tạo 2-4 nhóm phân loại rõ ràng liên quan đến chủ đề "${topic}"
      - Mỗi nhóm có 4-6 mục cần phân loại
      - Sử dụng giao diện kéo/thả để phân loại các mục
      - Các mục ban đầu được hiển thị ngẫu nhiên ở khu vực chờ
      - Hiển thị tiêu đề rõ ràng cho mỗi nhóm phân loại
      - Kiểm tra kết quả khi người dùng phân loại xong tất cả các mục
      - Thiết kế responsive, tối ưu trên cả desktop và mobile
      - Sử dụng màu sắc trực quan để phân biệt các nhóm
      `;
    
    case 'fliptiles':
      return `
      ## Hướng dẫn cho trò chơi Lật thẻ
      
      - Tạo lưới các thẻ/ô có thể lật
      - Mỗi thẻ có hai mặt: một mặt ẩn và một mặt hiển thị thông tin
      - Người chơi nhấn vào thẻ để lật và xem thông tin
      - Có thể là câu hỏi-trả lời, từ-định nghĩa, hình ảnh-mô tả...
      - Thêm animation lật thẻ mượt mà để tăng trải nghiệm
      - Có thể kết hợp với chức năng ghép cặp hoặc trả lời câu hỏi
      - Thiết kế thẻ rõ ràng với đủ không gian hiển thị nội dung
      - Đảm bảo giao diện responsive trên mọi thiết bị
      `;
    
    case 'wordsearch':
      return `
      ## Hướng dẫn cho trò chơi Tìm từ ẩn
      
      - Tạo bảng chữ cái kích thước vừa phải (không quá 10x10)
      - Giấu 8-10 từ liên quan đến chủ đề "${topic}" trong bảng
      - Các từ có thể nằm ngang, dọc hoặc chéo
      - Hiển thị danh sách các từ cần tìm bên cạnh bảng
      - Cho phép người dùng kéo để đánh dấu từ khi tìm thấy
      - Từ được tìm thấy sẽ được tô màu và đánh dấu trong danh sách
      - Có thể thêm bộ đếm thời gian để tạo thách thức
      - Thiết kế bảng chữ rõ ràng, dễ nhìn và tương tác
      `;
    
    case 'spellword':
      return `
      ## Hướng dẫn cho trò chơi Đánh vần từ
      
      - Tạo danh sách các từ liên quan đến chủ đề "${topic}"
      - Hiển thị gợi ý hoặc hình ảnh đại diện cho từ cần đánh vần
      - Cung cấp các chữ cái rời, người dùng kéo thả vào đúng vị trí
      - Có thể thêm chữ cái "mồi" để người dùng dễ đoán
      - Cung cấp phản hồi khi người dùng đặt chữ cái đúng hoặc sai
      - Có thể thêm gợi ý hoặc chế độ dễ dàng hơn cho người mới
      - Thiết kế rõ ràng, dễ nhìn với chữ cái kích thước lớn
      - Đảm bảo trải nghiệm kéo thả mượt mà trên mọi thiết bị
      `;
    
    case 'labeldiagram':
      return `
      ## Hướng dẫn cho trò chơi Gắn nhãn hình ảnh
      
      - Sử dụng hình ảnh/sơ đồ rõ ràng liên quan đến chủ đề "${topic}"
      - Tạo các nhãn với tên các bộ phận/thành phần của hình ảnh
      - Người dùng kéo thả nhãn vào đúng vị trí trên hình ảnh
      - Có thể thêm điểm đánh dấu vị trí cần gắn nhãn
      - Cung cấp phản hồi khi người dùng gắn nhãn đúng hoặc sai
      - Có thể thêm thông tin chi tiết khi nhãn được gắn đúng
      - Thiết kế hình ảnh rõ nét và nhãn dễ đọc
      - Đảm bảo trải nghiệm kéo thả mượt mà trên mọi thiết bị
      `;
    
    case 'crossword':
      return `
      ## Hướng dẫn cho trò chơi Ô chữ
      
      - Tạo ô chữ với kích thước phù hợp (8x8 đến 15x15)
      - Sử dụng từ vựng liên quan đến chủ đề "${topic}"
      - Tạo gợi ý rõ ràng cho các từ ngang và dọc
      - Cho phép người dùng nhấn vào ô và điền chữ cái
      - Tự động chuyển đến ô tiếp theo khi điền
      - Cung cấp tính năng kiểm tra đáp án và xóa ô
      - Có thể thêm tính năng gợi ý cho từ khó
      - Thiết kế ô chữ rõ ràng, dễ nhìn và tương tác
      `;
    
    case 'hangman':
      return `
      ## Hướng dẫn cho trò chơi Treo cổ chữ cái
      
      - Tạo danh sách các từ/cụm từ liên quan đến chủ đề "${topic}"
      - Hiển thị từ cần đoán dưới dạng dấu gạch ngang (mỗi gạch là một chữ cái)
      - Cung cấp bàn phím hoặc danh sách chữ cái để người dùng chọn
      - Hiển thị hình vẽ "người treo cổ" từng bước khi đoán sai
      - Giới hạn số lần đoán sai (thường là 6-8 lần)
      - Có thể thêm gợi ý về từ cần đoán
      - Hiển thị các chữ cái đã đoán (cả đúng và sai)
      - Thiết kế giao diện thân thiện, không quá đáng sợ
      `;
    
    case 'pictionary':
      return `
      ## Hướng dẫn cho trò chơi Đoán từ qua hình
      
      - QUAN TRỌNG: Sử dụng HÌNH ẢNH THỰC TẾ cho mỗi từ cần đoán
      - Mỗi từ cần đoán phải có 1-3 hình ảnh liên quan
      - Hình ảnh phải lấy từ nguồn thực tế (URL công khai) và hiển thị được
      - KHÔNG sử dụng mô tả văn bản thay cho hình ảnh
      - Hiển thị hình ảnh và cho phép người dùng nhập đáp án
      - Có thể hiển thị từng hình ảnh theo thứ tự hoặc cùng lúc
      - Cung cấp gợi ý nếu người dùng gặp khó khăn
      - Kiểm tra đáp án một cách linh hoạt (không phân biệt hoa thường)
      - Thiết kế giao diện tập trung vào hình ảnh, dễ nhìn và tương tác
      `;
    
    case 'flyingfruit':
      return `
      ## Hướng dẫn cho trò chơi Trái cây bay
      
      - Tạo các đối tượng "bay" ngang màn hình (các đáp án có thể)
      - Người dùng cần nhấn vào đáp án đúng khi nó xuất hiện
      - Đáp án bay với tốc độ vừa phải, không quá nhanh hoặc quá chậm
      - Hiển thị câu hỏi hoặc yêu cầu ở phía trên màn hình
      - Có thể thêm animation bay và hiệu ứng khi nhấn đúng/sai
      - Sử dụng hệ thống điểm và thời gian giới hạn
      - Tăng tốc độ dần để tạo thử thách
      - Thiết kế giao diện đơn giản, dễ tương tác trên cả desktop và mobile
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
      - Có thể thêm bộ đếm thời gian cho mỗi phát biểu
      - Tối ưu cho cả desktop và mobile
      `;
    
    case 'mazechase':
      return `
      ## Hướng dẫn cho trò chơi Rượt đuổi mê cung
      
      - Tạo một mê cung đơn giản với đường đi rõ ràng
      - Người dùng điều khiển nhân vật bằng phím mũi tên hoặc cử chỉ chạm
      - Bố trí các đáp án ở các vị trí khác nhau trong mê cung
      - Hiển thị câu hỏi hoặc yêu cầu ở phía trên mê cung
      - Có thể thêm chướng ngại vật hoặc vật cản di chuyển
      - Sử dụng hệ thống điểm và thời gian giới hạn
      - Thiết kế mê cung đẹp mắt với đồ họa phù hợp chủ đề
      - Đảm bảo điều khiển mượt mà trên cả desktop và mobile
      `;
    
    case 'mathgenerator':
      return `
      ## Hướng dẫn cho trò chơi Đố vui Toán học
      
      - Tạo các phép tính đơn giản phù hợp với chủ đề và độ khó
      - Sử dụng phép cộng, trừ, nhân, chia cơ bản
      - Tránh tạo phép tính quá phức tạp hoặc có kết quả là số thập phân dài
      - Sử dụng ô input rõ ràng để nhập kết quả
      - Cho phép người dùng sử dụng máy tính đơn giản trong game
      - Kiểm tra đáp án ngay khi nhập, cho phép làm tròn hợp lý
      - Hiển thị cách giải chi tiết sau khi trả lời
      - Thiết kế giao diện rõ ràng, dễ sử dụng để nhập số
      `;
    
    case 'rankorder':
      return `
      ## Hướng dẫn cho trò chơi Xếp theo thứ tự
      
      - Tạo danh sách các mục cần sắp xếp theo thứ tự nhất định
      - Thứ tự có thể là: thời gian, kích thước, giá trị, cấp độ...
      - Hiển thị các mục ngẫu nhiên, người dùng kéo thả để sắp xếp
      - Cung cấp hướng dẫn rõ ràng về tiêu chí sắp xếp
      - Kiểm tra kết quả khi người dùng hoàn thành việc sắp xếp
      - Có thể thêm giới hạn thời gian để tạo thách thức
      - Thiết kế các mục dễ kéo thả, với chiều cao phù hợp
      - Đảm bảo trải nghiệm kéo thả mượt mà trên cả desktop và mobile
      `;
    
    case 'wordmagnets':
      return `
      ## Hướng dẫn cho trò chơi Nam châm từ
      
      - Tạo bộ từ/chữ cái như các mảnh nam châm di chuyển được
      - Người dùng kéo thả các từ để tạo thành câu có nghĩa
      - Cung cấp đủ từ để tạo thành nhiều câu khác nhau
      - Có thể chia từ thành nhóm (danh từ, động từ...) với màu sắc khác nhau
      - Cung cấp khu vực "bảng" để người dùng đặt từ lên đó
      - Cho phép người dùng lưu hoặc chụp lại câu đã tạo
      - Thiết kế các mảnh từ hấp dẫn, dễ đọc và di chuyển
      - Đảm bảo trải nghiệm kéo thả mượt mà trên cả desktop và mobile
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
