
import { GameType, GameSettingsData } from '../types/game';

export const gameTypes: GameType[] = [
  {
    id: 'quiz',
    name: 'Trắc Nghiệm',
    description: 'Trò chơi trắc nghiệm với nhiều câu hỏi đa dạng',
    icon: 'graduation-cap',
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general'
    }
  },
  {
    id: 'flashcards',
    name: 'Thẻ Ghi Nhớ',
    description: 'Thẻ ghi nhớ để học thuộc kiến thức mới',
    icon: 'puzzle',
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 15,
      category: 'general'
    }
  },
  {
    id: 'matching',
    name: 'Nối Cặp',
    description: 'Nối các khái niệm có liên quan với nhau',
    icon: 'puzzle',
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 30,
      category: 'general'
    }
  },
  {
    id: 'memory',
    name: 'Trò Chơi Ghi Nhớ',
    description: 'Lật các thẻ bài để tìm cặp giống nhau',
    icon: 'puzzle',
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 3,
      totalTime: 120,
      category: 'general'
    }
  },
  {
    id: 'ordering',
    name: 'Sắp Xếp Thứ Tự',
    description: 'Sắp xếp các phần tử theo đúng thứ tự',
    icon: 'puzzle',
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 40,
      category: 'general'
    }
  },
  {
    id: 'wordsearch',
    name: 'Tìm Từ',
    description: 'Tìm các từ trong bảng chữ cái',
    icon: 'puzzle',
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 60,
      category: 'general'
    }
  },
  {
    id: 'pictionary',
    name: 'Đoán Hình',
    description: 'Đoán khái niệm dựa trên hình ảnh',
    icon: 'puzzle',
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 30,
      category: 'general'
    }
  },
  {
    id: 'truefalse',
    name: 'Đúng Sai',
    description: 'Phán đoán câu phát biểu đúng hay sai',
    icon: 'puzzle',
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 15,
      category: 'general'
    }
  }
];

/**
 * Get game type by id
 */
export const getGameTypeById = (id: string): GameType | undefined => {
  return gameTypes.find(gameType => gameType.id === id);
};

/**
 * Get game type based on topic
 */
export const getGameTypeByTopic = (topic: string): GameType | undefined => {
  const lowerTopic = topic.toLowerCase();
  
  if (lowerTopic.includes('trắc nghiệm') || lowerTopic.includes('quiz')) {
    return getGameTypeById('quiz');
  } else if (lowerTopic.includes('thẻ ghi nhớ') || lowerTopic.includes('flashcard')) {
    return getGameTypeById('flashcards');
  } else if (lowerTopic.includes('nối cặp') || lowerTopic.includes('match')) {
    return getGameTypeById('matching');
  } else if (lowerTopic.includes('ghi nhớ') || lowerTopic.includes('memory')) {
    return getGameTypeById('memory');
  } else if (lowerTopic.includes('sắp xếp') || lowerTopic.includes('order')) {
    return getGameTypeById('ordering');
  } else if (lowerTopic.includes('tìm từ') || lowerTopic.includes('wordsearch')) {
    return getGameTypeById('wordsearch');
  } else if (lowerTopic.includes('đoán hình') || lowerTopic.includes('pictionary')) {
    return getGameTypeById('pictionary');
  } else if (lowerTopic.includes('đúng sai') || lowerTopic.includes('true false')) {
    return getGameTypeById('truefalse');
  }
  
  return undefined;
};
