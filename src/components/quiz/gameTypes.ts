
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
      totalTime: 300,
      bonusTime: 5,
      useTimer: true,
      showExplanation: true,
      shuffleQuestions: true,
      shuffleOptions: true
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
      totalTime: 240,
      autoFlip: false,
      shuffleCards: true,
      allowHints: true,
      showProgress: true
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
      totalTime: 320,
      bonusTime: 10,
      showHints: true,
      progressiveHints: true
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
      totalTime: 300,
      caseSensitive: false,
      allowSynonyms: true,
      showHints: true
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
      totalTime: 150,
      bonusTime: 3,
      showExplanation: true,
      progressiveScoring: true,
      shuffleQuestions: true
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
      totalTime: 300,
      bonusTime: 5,
      allowCalculator: false,
      roundingPrecision: 2,
      showSteps: true
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
      totalTime: 480,
      hintCount: 3,
      hintPenalty: 10,
      allowSkip: true
    }
  },
  {
    id: "matching",
    name: "Nối từ",
    description: "Nối các từ hoặc khái niệm ở cột bên trái với định nghĩa tương ứng ở cột bên phải.",
    icon: "link",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 40,
      category: 'general',
      totalTime: 120,
      shuffleItems: true,
      allowPartialMatching: false,
      bonusTimePerMatch: 5,
      showHints: true
    }
  },
  {
    id: "pictionary",
    name: "Đoán từ qua hình",
    description: "Xem hình ảnh và đoán từ hoặc cụm từ được mô tả bằng hình ảnh đó.",
    icon: "image",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 30,
      category: 'general',
      totalTime: 240,
      showHints: true,
      hintPenalty: 5,
      allowMultipleAttempts: true,
      autoAdvance: false
    }
  },
  {
    id: "wordsearch",
    name: "Tìm từ ẩn",
    description: "Tìm các từ ẩn giấu trong bảng chữ cái đơn giản, các từ có thể nằm ngang hoặc dọc.",
    icon: "search",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 60,
      category: 'general',
      totalTime: 300,
      gridSize: 'medium',
      allowDiagonalWords: true,
      showWordList: true,
      bonusTimePerWord: 15
    }
  },
  {
    id: "categorizing",
    name: "Phân loại",
    description: "Phân loại các đối tượng vào các nhóm khác nhau dựa trên đặc điểm chung.",
    icon: "folder",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
      totalTime: 320,
      categoryCount: 3,
      itemsPerCategory: 5,
      allowMultipleCategories: false,
      showCategoryHints: true
    }
  }
];

export const getGameTypeById = (id: string): GameType | undefined => {
  return gameTypes.find(game => game.id === id);
};

export const getGameTypeByTopic = (topic: string): GameType | undefined => {
  if (!topic) return getGameTypeById('quiz'); // Default to quiz if no topic
  
  const lowerTopic = topic.toLowerCase();
  
  // Improved matching algorithm with keyword weights
  const gameMatches = gameTypes.map(gameType => {
    let score = 0;
    
    // Direct name match gets highest score
    if (lowerTopic.includes(gameType.name.toLowerCase())) {
      score += 10;
    }
    
    // Check for specific game keywords in the topic
    switch (gameType.id) {
      case 'quiz':
        if (lowerTopic.includes('trắc nghiệm') || lowerTopic.includes('quiz') || 
            lowerTopic.includes('abcd') || lowerTopic.includes('chọn đáp án')) {
          score += 8;
        }
        break;
      case 'flashcards':
        if (lowerTopic.includes('thẻ ghi nhớ') || lowerTopic.includes('flash card') || 
            lowerTopic.includes('flashcard') || lowerTopic.includes('thẻ học')) {
          score += 8;
        }
        break;
      case 'unjumble':
        if (lowerTopic.includes('xếp lại') || lowerTopic.includes('sắp xếp') || 
            lowerTopic.includes('unjumble') || lowerTopic.includes('từ xáo trộn')) {
          score += 8;
        }
        break;
      case 'sentence':
        if (lowerTopic.includes('điền vào chỗ trống') || lowerTopic.includes('hoàn thành câu') || 
            lowerTopic.includes('fill in') || lowerTopic.includes('từ thiếu')) {
          score += 8;
        }
        break;
      case 'truefalse':
        if (lowerTopic.includes('đúng sai') || lowerTopic.includes('true false') || 
            lowerTopic.includes('đúng hay sai') || lowerTopic.includes('thật giả')) {
          score += 8;
        }
        break;
      case 'mathgenerator':
        if (lowerTopic.includes('toán') || lowerTopic.includes('math') || 
            lowerTopic.includes('tính') || lowerTopic.includes('số học')) {
          score += 8;
        }
        break;
      case 'riddle':
        if (lowerTopic.includes('câu đố') || lowerTopic.includes('đố') || 
            lowerTopic.includes('riddle') || lowerTopic.includes('đố vui')) {
          score += 8;
        }
        break;
      case 'matching':
        if (lowerTopic.includes('nối từ') || lowerTopic.includes('matching') || 
            lowerTopic.includes('ghép đôi') || lowerTopic.includes('nối')) {
          score += 8;
        }
        break;
      case 'pictionary':
        if (lowerTopic.includes('đoán từ qua hình') || lowerTopic.includes('pictionary') || 
            lowerTopic.includes('hình ảnh') || lowerTopic.includes('đoán hình')) {
          score += 8;
        }
        break;
      case 'wordsearch':
        if (lowerTopic.includes('tìm từ') || lowerTopic.includes('word search') || 
            lowerTopic.includes('từ ẩn') || lowerTopic.includes('tìm chữ')) {
          score += 8;
        }
        break;
      case 'categorizing':
        if (lowerTopic.includes('phân loại') || lowerTopic.includes('categorizing') || 
            lowerTopic.includes('phân nhóm') || lowerTopic.includes('sắp xếp nhóm')) {
          score += 8;
        }
        break;
    }
    
    // Check for subject compatibility
    if (gameType.id === 'mathgenerator' && 
        (lowerTopic.includes('toán') || lowerTopic.includes('math') || 
         lowerTopic.includes('tính') || lowerTopic.includes('số học'))) {
      score += 5;
    }
    
    if (gameType.id === 'pictionary' && 
        (lowerTopic.includes('nghệ thuật') || lowerTopic.includes('hình ảnh') || 
         lowerTopic.includes('vẽ') || lowerTopic.includes('minh họa'))) {
      score += 5;
    }
    
    if (gameType.id === 'matching' && 
        (lowerTopic.includes('từ vựng') || lowerTopic.includes('vocabulary') || 
         lowerTopic.includes('ghép đôi') || lowerTopic.includes('định nghĩa'))) {
      score += 5;
    }
    
    return { gameType, score };
  });
  
  // Sort by score and get the highest match
  gameMatches.sort((a, b) => b.score - a.score);
  
  // If we have a good match, return it
  if (gameMatches[0].score > 0) {
    return gameMatches[0].gameType;
  }
  
  // Default to quiz if no good match found
  return getGameTypeById('quiz');
};
