
import { Puzzle, MessageSquare, Layers, Dices, Shuffle, BookOpen, Target, ArrowUpDown } from 'lucide-react';

export interface GamePresetTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  template: string;
  placeholders: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  category: string;
  promptTemplate: string;
}

export const gamePresetTemplates: GamePresetTemplate[] = [
  {
    id: 'quiz',
    name: 'Trắc Nghiệm ABCD',
    description: 'Trò chơi trắc nghiệm truyền thống với 4 lựa chọn',
    icon: MessageSquare,
    template: 'quiz-abcd',
    placeholders: ['nội dung câu hỏi', 'chủ đề', 'độ khó'],
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'general',
    promptTemplate: 'Hãy tạo trò chơi trắc nghiệm ABCD về chủ đề {{content}}. Mỗi câu hỏi có 4 lựa chọn với chỉ một đáp án đúng.'
  },
  {
    id: 'flashcards',
    name: 'Thẻ Ghi Nhớ',
    description: 'Thẻ lật hai mặt giúp ghi nhớ từ vựng, khái niệm',
    icon: Layers,
    template: 'flashcards',
    placeholders: ['thuật ngữ', 'định nghĩa', 'chủ đề'],
    difficulty: 'medium',
    questionCount: 8,
    timePerQuestion: 20,
    category: 'language',
    promptTemplate: 'Hãy tạo bộ thẻ ghi nhớ về chủ đề {{content}}. Mỗi thẻ có một thuật ngữ/từ ở mặt trước và định nghĩa/giải thích ở mặt sau.'
  },
  {
    id: 'matching',
    name: 'Nối Từ',
    description: 'Trò chơi nối các cặp từ/ý tưởng tương ứng',
    icon: Shuffle,
    template: 'matching',
    placeholders: ['từ khóa', 'định nghĩa', 'chủ đề'],
    difficulty: 'easy',
    questionCount: 8,
    timePerQuestion: 45,
    category: 'general',
    promptTemplate: 'Hãy tạo trò chơi nối từ về chủ đề {{content}}. Tạo các cặp từ/khái niệm ở cột trái và định nghĩa/giải thích tương ứng ở cột phải.'
  },
  {
    id: 'unjumble',
    name: 'Xếp Lại Câu',
    description: 'Sắp xếp các từ để tạo thành câu có nghĩa',
    icon: ArrowUpDown,
    template: 'unjumble',
    placeholders: ['từ ngữ', 'câu', 'chủ đề'],
    difficulty: 'medium',
    questionCount: 5,
    timePerQuestion: 60,
    category: 'language',
    promptTemplate: 'Hãy tạo trò chơi xếp lại câu về chủ đề {{content}}. Mỗi câu hỏi hiển thị các từ xáo trộn và người chơi phải sắp xếp lại thành câu có nghĩa.'
  },
  {
    id: 'truefalse',
    name: 'Đúng Hay Sai',
    description: 'Trò chơi xác định các phát biểu đúng hay sai',
    icon: Target,
    template: 'truefalse',
    placeholders: ['phát biểu', 'đúng/sai', 'chủ đề'],
    difficulty: 'easy',
    questionCount: 10,
    timePerQuestion: 20,
    category: 'general',
    promptTemplate: 'Hãy tạo trò chơi đúng hay sai về chủ đề {{content}}. Mỗi câu hỏi là một phát biểu mà người chơi phải xác định là đúng hay sai.'
  },
  {
    id: 'sentence',
    name: 'Điền Vào Chỗ Trống',
    description: 'Điền từ thích hợp vào chỗ trống trong câu',
    icon: BookOpen,
    template: 'sentence',
    placeholders: ['câu', 'từ bị thiếu', 'chủ đề'],
    difficulty: 'medium',
    questionCount: 8,
    timePerQuestion: 30,
    category: 'language',
    promptTemplate: 'Hãy tạo trò chơi điền vào chỗ trống về chủ đề {{content}}. Mỗi câu hỏi là một câu có một từ bị thiếu và người chơi phải điền từ thích hợp vào.'
  },
  {
    id: 'riddle',
    name: 'Câu Đố Mẹo',
    description: 'Suy luận và giải các câu đố thú vị',
    icon: Puzzle,
    template: 'riddle',
    placeholders: ['câu đố', 'đáp án', 'chủ đề'],
    difficulty: 'hard',
    questionCount: 5,
    timePerQuestion: 60,
    category: 'general',
    promptTemplate: 'Hãy tạo trò chơi câu đố mẹo về chủ đề {{content}}. Mỗi câu đố phải có logic rõ ràng và một đáp án chính xác.'
  },
  {
    id: 'mathgenerator',
    name: 'Toán Học',
    description: 'Luyện tập kỹ năng toán học với các phép tính',
    icon: Dices,
    template: 'mathgenerator',
    placeholders: ['phép tính', 'kết quả', 'độ khó'],
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30,
    category: 'math',
    promptTemplate: 'Hãy tạo trò chơi toán học về chủ đề {{content}}. Mỗi câu hỏi là một phép tính mà người chơi phải tính kết quả đúng.'
  }
];

export const getPresetById = (id: string): GamePresetTemplate | undefined => {
  return gamePresetTemplates.find(preset => preset.id === id);
};

