
import { GameType } from './types';

export const gameTypes: GameType[] = [
  {
    id: "quiz",
    name: "Trắc nghiệm ABCD",
    description: "Câu hỏi trắc nghiệm có 4 lựa chọn, chọn đáp án đúng và được phản hồi ngay lập tức.",
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
    description: "Thẻ hai mặt, một mặt hiển thị câu hỏi/từ vựng, lật sang mặt kia để xem đáp án.",
    icon: "rotate-ccw",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 12,
      timePerQuestion: 20,
      category: 'general',
    }
  },
  {
    id: "matching",
    name: "Nối từ - nghĩa",
    description: "Nối các từ hoặc khái niệm ở cột bên trái với định nghĩa tương ứng ở cột bên phải.",
    icon: "link",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "anagram",
    name: "Xáo chữ tạo từ",
    description: "Sắp xếp lại các chữ cái bị xáo trộn để tạo thành từ hoặc cụm từ có nghĩa.",
    icon: "shuffle",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "speaking",
    name: "Thẻ nói",
    description: "Thẻ chứa chủ đề hoặc câu hỏi, người chơi phải nói hoặc diễn đạt ý tưởng theo nội dung.",
    icon: "message-square",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 60,
      category: 'general',
    }
  },
  {
    id: "memory",
    name: "Tìm cặp giống nhau",
    description: "Lật hai thẻ mỗi lượt, tìm các cặp thẻ khớp nhau về nội dung hoặc ý nghĩa.",
    icon: "layers",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "unjumble",
    name: "Sắp xếp câu",
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
    id: "openbox",
    name: "Mở hộp bí ẩn",
    description: "Chọn và mở các hộp đánh số, mỗi hộp chứa một câu hỏi hoặc phần thưởng.",
    icon: "box",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "spinwheel",
    name: "Xoay bánh xe",
    description: "Xoay bánh xe ngẫu nhiên và thực hiện nhiệm vụ ở phần bánh xe dừng lại.",
    icon: "refresh-cw",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "groupsort",
    name: "Phân loại nhóm",
    description: "Phân loại các đối tượng vào các nhóm khác nhau dựa trên đặc điểm chung.",
    icon: "folder",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "fliptiles",
    name: "Lật thẻ",
    description: "Lật từng thẻ để xem thông tin và tìm cặp khớp hoặc trả lời câu hỏi.",
    icon: "rotate-ccw",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "wordsearch",
    name: "Tìm từ ẩn",
    description: "Tìm các từ ẩn giấu trong bảng chữ cái, các từ có thể nằm ngang, dọc hoặc chéo.",
    icon: "search",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 60,
      category: 'general',
    }
  },
  {
    id: "spellword",
    name: "Đánh vần từ",
    description: "Kéo các chữ cái vào đúng vị trí để hoàn thành từ theo gợi ý hoặc hình ảnh.",
    icon: "pen-tool",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "labeldiagram",
    name: "Gắn nhãn hình ảnh",
    description: "Kéo các nhãn vào đúng vị trí trên sơ đồ hoặc hình ảnh.",
    icon: "image",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "crossword",
    name: "Ô chữ",
    description: "Điền từ vào ô chữ dựa trên các gợi ý ngang và dọc.",
    icon: "grid",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 120,
      category: 'general',
    }
  },
  {
    id: "hangman",
    name: "Treo cổ chữ cái",
    description: "Đoán từng chữ cái để hoàn thành từ trước khi hình người treo cổ hoàn thiện.",
    icon: "user-minus",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 60,
      category: 'general',
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
    }
  },
  {
    id: "flyingfruit",
    name: "Trái cây bay",
    description: "Các đáp án bay ngang màn hình, nhấn đúng khi thấy đáp án đúng.",
    icon: "zap",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "truefalse",
    name: "Đúng hay sai",
    description: "Phán đoán tính đúng đắn của các phát biểu bằng cách chọn Đúng hoặc Sai.",
    icon: "check",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 15,
      timePerQuestion: 10,
      category: 'general',
    }
  },
  {
    id: "mazechase",
    name: "Rượt đuổi mê cung",
    description: "Điều khiển nhân vật chạy đến đáp án đúng, tránh va vào vật cản.",
    icon: "map",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
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
    id: "rankorder",
    name: "Xếp theo thứ tự",
    description: "Kéo và thả các mục theo thứ tự đúng (nhỏ đến lớn, thời gian, cấp độ...).",
    icon: "sort-asc",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "wordmagnets",
    name: "Nam châm từ",
    description: "Kéo thả các từ như nam châm để tạo thành câu hoàn chỉnh và có nghĩa.",
    icon: "move",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
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
      case 'matching':
        if (lowerTopic.includes('nối từ') || lowerTopic.includes('matching') || 
            lowerTopic.includes('ghép đôi') || lowerTopic.includes('nối')) {
          score += 8;
        }
        break;
      case 'anagram':
        if (lowerTopic.includes('xáo chữ') || lowerTopic.includes('anagram') || 
            lowerTopic.includes('sắp xếp chữ') || lowerTopic.includes('tạo từ')) {
          score += 8;
        }
        break;
      case 'speaking':
        if (lowerTopic.includes('thẻ nói') || lowerTopic.includes('speaking') || 
            lowerTopic.includes('diễn đạt') || lowerTopic.includes('nói')) {
          score += 8;
        }
        break;
      case 'memory':
        if (lowerTopic.includes('tìm cặp') || lowerTopic.includes('memory') || 
            lowerTopic.includes('trùng khớp') || lowerTopic.includes('ghép cặp')) {
          score += 8;
        }
        break;
      case 'unjumble':
        if (lowerTopic.includes('xếp lại') || lowerTopic.includes('sắp xếp') || 
            lowerTopic.includes('unjumble') || lowerTopic.includes('từ xáo trộn')) {
          score += 8;
        }
        break;
      case 'wordsearch':
        if (lowerTopic.includes('tìm từ') || lowerTopic.includes('word search') || 
            lowerTopic.includes('từ ẩn') || lowerTopic.includes('tìm chữ')) {
          score += 8;
        }
        break;
      case 'pictionary':
        if (lowerTopic.includes('đoán từ qua hình') || lowerTopic.includes('pictionary') || 
            lowerTopic.includes('hình ảnh') || lowerTopic.includes('đoán hình')) {
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
      case 'crossword':
        if (lowerTopic.includes('ô chữ') || lowerTopic.includes('crossword') || 
            lowerTopic.includes('điền chữ') || lowerTopic.includes('giải ô chữ')) {
          score += 8;
        }
        break;
      case 'hangman':
        if (lowerTopic.includes('treo cổ') || lowerTopic.includes('hangman') || 
            lowerTopic.includes('đoán chữ') || lowerTopic.includes('đoán từng chữ')) {
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
