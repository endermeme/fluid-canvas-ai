
export interface GamePromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: string;
  category?: string;
}

export const generateCustomGamePrompt = (options: GamePromptOptions): string => {
  const { 
    topic, 
    language = 'vi',
    difficulty = 'medium',
    category = 'general'
  } = options;

  const basePrompt = `
Tạo một game HTML đơn giản và sẵn sàng chơi về chủ đề: "${topic}"

**YÊU CẦU GAME QUAN TRỌNG:**
- Game phải có thể chơi ngay lập tức
- Giao diện đơn giản và trực quan
- Tập trung vào cơ chế chơi cốt lõi
- Hỗ trợ cả máy tính và điện thoại
- Ngôn ngữ: Tiếng Việt
- Độ khó: ${difficulty}
- Thể loại: ${category}

**YÊU CẦU CODE:**
- Trả về file HTML hoàn chỉnh với CSS/JS
- KHÔNG CÓ PHỤ THUỘC BÊN NGOÀI hoặc CDN
- Bắt đầu với \`\`\`html
- Format code hợp lý
- Kết thúc với \`\`\`
- KHÔNG CÓ COMMENT trong code

**CẤU TRÚC GAME:**
1. Tiêu đề game và hướng dẫn đơn giản
2. Nút bắt đầu ngay
3. Khu vực chơi game chính
4. Hiển thị điểm/tiến trình cơ bản
5. Tùy chọn chơi lại nhanh

Tập trung làm cho game có thể chơi ngay và thú vị!
`;

  return basePrompt;
};
