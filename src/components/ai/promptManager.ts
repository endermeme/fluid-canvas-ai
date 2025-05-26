
/**
 * Prompt Manager - Quản lý các prompt AI để tạo game
 */

import type { PromptOptions } from './types';

export const createGamePrompt = (options: PromptOptions): string => {
  const {
    topic,
    useCanvas = true,
    language = 'vi',
    difficulty = 'medium',
    category = 'general'
  } = options;

  const difficultySettings = {
    easy: {
      description: 'đơn giản, dễ hiểu',
      mechanics: 'cơ chế đơn giản như click, kéo thả cơ bản',
      ui: 'giao diện đơn giản với màu sắc tươi sáng'
    },
    medium: {
      description: 'vừa phải, có thách thức',
      mechanics: 'cơ chế tương tác đa dạng, có điểm số và level',
      ui: 'giao diện đẹp với hiệu ứng và animation'
    },
    hard: {
      description: 'khó, yêu cầu kỹ năng cao',
      mechanics: 'cơ chế phức tạp, nhiều tính năng nâng cao',
      ui: 'giao diện chuyên nghiệp với nhiều hiệu ứng'
    }
  };

  const currentDifficulty = difficultySettings[difficulty];
  const canvasInstruction = useCanvas ? 'SỬ DỤNG HTML5 Canvas để vẽ đồ họa' : 'SỬ DỤNG DOM elements cho giao diện';
  const languageInstruction = language === 'vi' ? 'Toàn bộ văn bản PHẢI bằng Tiếng Việt' : 'All text MUST be in English';

  return `
Hãy tạo một trò chơi HTML hoàn chỉnh và tương tác về chủ đề: "${topic}"

YÊU CẦU CHÍNH:
- ${languageInstruction}
- Độ khó: ${currentDifficulty.description}
- Thể loại: ${category}
- ${canvasInstruction}
- ${currentDifficulty.mechanics}
- ${currentDifficulty.ui}

YÊU CẦU KỸ THUẬT:
1. PHẢI là một file HTML hoàn chỉnh với CSS và JavaScript inline
2. PHẢI responsive cho cả desktop và mobile
3. PHẢI có âm thanh (nếu có thể) và hiệu ứng thị giác
4. PHẢI có hệ thống điểm số hoặc mục tiêu rõ ràng
5. PHẢI có nút bắt đầu, tạm dừng, và restart
6. PHẢI có hướng dẫn chơi ngắn gọn
7. CSS PHẢI có animation và transition mượt mà
8. JavaScript PHẢI xử lý touch events cho mobile

YÊU CẦU GIAO DIỆN:
- Màu sắc hài hòa và bắt mắt
- Font chữ dễ đọc
- Button và element có kích thước tối thiểu 44px cho touch
- Hiệu ứng hover và active states
- Loading và feedback cho user actions

YÊU CẦU GAMEPLAY:
- Game phải có mục tiêu rõ ràng
- Có feedback tức thì khi người chơi tương tác
- Có thể chơi nhiều lần
- Có thể thắng/thua hoặc có điểm cao
- Thời gian chơi từ 1-3 phút mỗi lượt

TEMPLATE CẤU TRÚC:
\`\`\`html
<!DOCTYPE html>
<html lang="${language === 'vi' ? 'vi' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>[Tên Game]</title>
    <style>
        /* CSS hoàn chỉnh ở đây */
    </style>
</head>
<body>
    <!-- HTML game ở đây -->
    <script>
        /* JavaScript hoàn chỉnh ở đây */
    </script>
</body>
</html>
\`\`\`

CHÚ Ý QUAN TRỌNG:
- CHỈ trả về code HTML, KHÔNG giải thích thêm
- Code PHẢI hoạt động ngay lập tức
- PHẢI test với touch events
- PHẢI có error handling cơ bản
- Sử dụng modern JavaScript (ES6+)

Hãy tạo game ngay bây giờ!
`.trim();
};

export const createQuizPrompt = (topic: string, questionCount: number = 10): string => {
  return `
Tạo ${questionCount} câu hỏi trắc nghiệm về chủ đề: "${topic}"

YÊU CẦU:
- Câu hỏi phải chính xác và có giá trị giáo dục
- 4 đáp án cho mỗi câu (A, B, C, D)
- Có giải thích cho đáp án đúng
- Độ khó tăng dần

Format JSON:
{
  "questions": [
    {
      "question": "Câu hỏi",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correctAnswer": 0,
      "explanation": "Giải thích chi tiết"
    }
  ]
}
`;
};

export const createCustomGamePrompt = (description: string): string => {
  return `
Dựa trên mô tả sau, hãy tạo một trò chơi HTML hoàn chỉnh:

MÔ TẢ GAME: "${description}"

YÊU CẦU:
1. Phân tích mô tả và xác định:
   - Thể loại game
   - Cơ chế chơi chính
   - Giao diện cần thiết
   - Tính năng đặc biệt

2. Tạo game với:
   - HTML5 Canvas hoặc DOM tùy theo phù hợp
   - CSS responsive và đẹp mắt
   - JavaScript với logic game hoàn chỉnh
   - Âm thanh và hiệu ứng nếu có thể

3. Đảm bảo:
   - Game hoạt động trên cả desktop và mobile
   - Có hướng dẫn chơi
   - Có hệ thống điểm số hoặc mục tiêu
   - Code sạch và có comment

CHỈ trả về code HTML hoàn chỉnh, không giải thích thêm.
`;
};
