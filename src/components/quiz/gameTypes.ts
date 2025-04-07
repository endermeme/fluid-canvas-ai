
import { GameType } from './types';

export const gameTypes: GameType[] = [
  {
    id: "quiz",
    name: "Trắc nghiệm ABCD",
    description: "Câu hỏi trắc nghiệm có 4 lựa chọn A/B/C/D, chọn đáp án đúng, được phản hồi ngay lập tức.",
    icon: "check",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "flashcards",
    name: "Thẻ ghi nhớ",
    description: "Thẻ hiển thị nội dung một mặt rồi lật sang mặt khác để xem đáp án khi nhấn vào.",
    icon: "rotate-ccw",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 12,
      timePerQuestion: 20,
      category: 'general',
    }
  },
  {
    id: "unjumble",
    name: "Xếp lại câu",
    description: "Sắp xếp các từ bị xáo trộn theo đúng thứ tự để tạo thành câu hoàn chỉnh.",
    icon: "sort-asc",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "sentence",
    name: "Điền vào chỗ trống",
    description: "Câu bị thiếu một từ, gõ từ thích hợp vào ô trống để hoàn thành câu.",
    icon: "pen-tool",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "truefalse",
    name: "Đúng hay sai",
    description: "Phát biểu được đưa ra, chọn Đúng hoặc Sai tương ứng với tính chính xác của phát biểu.",
    icon: "check",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 15,
      timePerQuestion: 10,
      category: 'general',
    }
  },
  {
    id: "memorize",
    name: "Ghi nhớ",
    description: "Xem nội dung trong thời gian giới hạn, sau đó nhập lại những gì đã ghi nhớ được.",
    icon: "brain-circuit",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 3,
      category: 'general',
    }
  },
  {
    id: "mathgenerator",
    name: "Đố vui Toán học",
    description: "Giải các biểu thức toán học đơn giản, nhập kết quả và kiểm tra đáp án.",
    icon: "calculator",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'math',
    }
  },
  {
    id: "riddle",
    name: "Câu đố mẹo",
    description: "Giải câu đố vui hoặc câu đố logic, nhận gợi ý nếu gặp khó khăn.",
    icon: "zap",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 60,
      category: 'general',
    }
  },
];

export const getGameTypeById = (id: string): GameType | undefined => {
  return gameTypes.find(game => game.id === id);
};

export const getGameTypeByTopic = (topic: string): GameType | undefined => {
  const lowerTopic = topic.toLowerCase();
  
  // Try to find a direct match in game descriptions
  for (const gameType of gameTypes) {
    if (lowerTopic.includes(gameType.name.toLowerCase())) {
      return gameType;
    }
  }
  
  // Check for specific game mechanics in the topic
  if (lowerTopic.includes('trắc nghiệm') || lowerTopic.includes('abcd')) {
    return getGameTypeById('quiz');
  }
  if (lowerTopic.includes('thẻ ghi nhớ') || lowerTopic.includes('flash card')) {
    return getGameTypeById('flashcards');
  }
  if (lowerTopic.includes('xếp lại câu') || lowerTopic.includes('unjumble')) {
    return getGameTypeById('unjumble');
  }
  if (lowerTopic.includes('điền vào chỗ trống') || lowerTopic.includes('hoàn thành câu')) {
    return getGameTypeById('sentence');
  }
  if (lowerTopic.includes('đúng sai') || lowerTopic.includes('true false')) {
    return getGameTypeById('truefalse');
  }
  if (lowerTopic.includes('ghi nhớ') || lowerTopic.includes('memorize')) {
    return getGameTypeById('memorize');
  }
  if (lowerTopic.includes('toán') || lowerTopic.includes('math')) {
    return getGameTypeById('mathgenerator');
  }
  if (lowerTopic.includes('câu đố') || lowerTopic.includes('riddle')) {
    return getGameTypeById('riddle');
  }
  
  // Default to quiz for general topics
  return getGameTypeById('quiz');
};
