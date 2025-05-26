
export class PromptManager {
  static buildCustomGamePrompt(description: string): string {
    return `Tạo một trò chơi HTML5 hoàn chỉnh dựa trên mô tả sau: "${description}"

YÊU CẦU THIẾT KẾ:
- Sử dụng HTML5 Canvas cho đồ họa chất lượng cao
- Thiết kế responsive cho mọi thiết bị
- Có âm thanh và hiệu ứng đặc biệt
- Hệ thống điểm số và progress tracking
- Animation mượt mà và hấp dẫn

CẤU TRÚC CODE:
1. HTML structure với Canvas element
2. CSS styling với modern effects
3. JavaScript game logic với:
   - Game state management
   - Input handling (touch + keyboard)
   - Collision detection
   - Score system
   - Sound effects

OUTPUT FORMAT:
Trả về file HTML hoàn chỉnh với cấu trúc:
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Game Title]</title>
    <style>[CSS Code]</style>
</head>
<body>
    [HTML Structure]
    <script>[JavaScript Game Logic]</script>
</body>
</html>

CHẤT LƯỢNG CODE:
- Tối ưu performance
- Error handling
- Clean code structure
- Comments in Vietnamese
- Mobile-first approach

Mô tả game: ${description}`;
  }

  static buildPresetGamePrompt(gameType: string, topic: string, settings: any): string {
    const gamePrompts = {
      quiz: `Tạo game trắc nghiệm về "${topic}" với ${settings.questionCount || 10} câu hỏi`,
      flashcards: `Tạo game thẻ ghi nhớ về "${topic}" với animation lật thẻ`,
      matching: `Tạo game nối từ về "${topic}" với drag & drop`,
      memory: `Tạo game ghi nhớ về "${topic}" với các cặp thẻ`,
      ordering: `Tạo game sắp xếp câu về "${topic}"`,
      wordsearch: `Tạo game tìm từ ẩn về "${topic}"`,
      pictionary: `Tạo game đoán hình về "${topic}"`,
      truefalse: `Tạo game đúng/sai về "${topic}"`
    };

    const basePrompt = gamePrompts[gameType as keyof typeof gamePrompts] || gamePrompts.quiz;
    
    return `${basePrompt}

THIẾT KẾ GAME:
- Sử dụng HTML5 Canvas để tạo giao diện đẹp
- Responsive design cho mobile và desktop
- Có âm thanh phản hồi khi chọn đáp án
- Animation transitions mượt mà
- Hiệu ứng particle khi đúng/sai
- Thanh progress bar
- Timer countdown (nếu có)

TÍNH NĂNG:
- Hệ thống điểm số thông minh
- Feedback ngay lập tức
- Kết quả cuối game với thống kê
- Nút replay để chơi lại
- Share score functionality

Độ khó: ${settings.difficulty || 'medium'}
Thời gian: ${settings.timePerQuestion || 30}s/câu
Danh mục: ${settings.category || 'general'}`;
  }
}
