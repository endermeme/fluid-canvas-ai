
/**
 * Prompt Manager - Manages AI prompts for game generation
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

  const basePrompt = `
Tạo một trò chơi HTML hoàn chỉnh về chủ đề: "${topic}"

Yêu cầu:
- Sử dụng ${useCanvas ? 'HTML5 Canvas' : 'DOM elements'} để tạo giao diện
- Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt' : 'English'}
- Độ khó: ${difficulty}
- Thể loại: ${category}
- Tạo game tương tác và hấp dẫn
- Bao gồm âm thanh và hiệu ứng nếu có thể
- Responsive design cho mobile và desktop
- Code hoàn chỉnh trong một file HTML duy nhất

Trả về HTML hoàn chỉnh bao gồm CSS và JavaScript inline.
`;

  return basePrompt.trim();
};

export const createQuizPrompt = (topic: string, questionCount: number = 10): string => {
  return `
Tạo ${questionCount} câu hỏi trắc nghiệm về chủ đề: "${topic}"

Format JSON:
{
  "questions": [
    {
      "question": "Câu hỏi",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Giải thích"
    }
  ]
}
`;
};
