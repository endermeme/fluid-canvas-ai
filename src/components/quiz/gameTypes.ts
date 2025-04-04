
import { GameType } from './types';

export const gameTypes: GameType[] = [
  {
    id: "quiz",
    name: "Câu hỏi trắc nghiệm",
    description: "Chuỗi câu hỏi trắc nghiệm có nhiều lựa chọn. Chọn đáp án đúng để tiếp tục qua câu tiếp theo.",
    icon: "award",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "flashcards",
    name: "Thẻ ghi nhớ hai mặt",
    description: "Thẻ có nội dung ở một mặt (câu hỏi) và câu trả lời ở mặt còn lại. Tự kiểm tra bản thân bằng cách lật mặt sau xem đáp án.",
    icon: "rotate-ccw",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 12,
      timePerQuestion: 20,
      category: 'general',
    }
  },
  {
    id: "matchup",
    name: "Ghép cặp thông tin",
    description: "Các từ hoặc khái niệm và định nghĩa rời rạc. Kéo và thả từng từ vào đúng định nghĩa của nó.",
    icon: "puzzle",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 40,
      category: 'general',
    }
  },
  {
    id: "anagram",
    name: "Xáo trộn chữ cái",
    description: "Một từ hoặc cụm từ bị xáo trộn chữ cái. Kéo các chữ cái vào đúng vị trí để tạo ra từ/cụm từ đúng.",
    icon: "shuffle",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 45,
      category: 'general',
    }
  },
  {
    id: "speakingcards",
    name: "Thẻ hội thoại",
    description: "Bộ bài gồm nhiều chủ đề hoặc câu hỏi. Rút ngẫu nhiên một thẻ và nói/diễn đạt ý tưởng theo nội dung trên thẻ.",
    icon: "message-square",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 60,
      category: 'general',
    }
  },
  {
    id: "findmatch",
    name: "Tìm cặp đôi",
    description: "Cặp thông tin bị trộn lẫn (từ + nghĩa, hình + tên). Nhấn vào hai mục khớp nhau để loại bỏ. Làm đến khi hết.",
    icon: "layers",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 3,
      category: 'general',
    }
  },
  {
    id: "unjumble",
    name: "Sắp xếp từ thành câu",
    description: "Một câu bị trộn lộn từ. Kéo và thả các từ để sắp xếp lại câu đúng ngữ pháp.",
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
    name: "Mở hộp bí mật",
    description: "Hộp được đánh số, mỗi hộp chứa một câu hỏi hoặc phần thưởng. Nhấn vào từng hộp để mở và xem nội dung bên trong.",
    icon: "blocks",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "spinwheel",
    name: "Vòng quay may mắn",
    description: "Bánh xe có các lựa chọn ngẫu nhiên. Nhấn xoay và thực hiện nhiệm vụ ở ô đã dừng.",
    icon: "dices",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 12,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "groupsort",
    name: "Phân loại thành nhóm",
    description: "Các mục rời rạc thuộc nhiều nhóm khác nhau. Kéo và thả vào nhóm đúng (vd: động vật–đồ vật–thực vật).",
    icon: "layers",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 15,
      timePerQuestion: 45,
      category: 'general',
    }
  },
  {
    id: "matchpairs",
    name: "Ghép cặp hình giống nhau",
    description: "Các ô ẩn, mỗi cặp là một sự khớp về nghĩa/hình/âm. Lật 2 ô một lượt, nếu trùng thì giữ lại, không thì úp xuống.",
    icon: "puzzle",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 3,
      category: 'general',
    }
  },
  {
    id: "sentence",
    name: "Điền từ vào chỗ trống",
    description: "Câu bị bỏ trống từ/cụm từ. Kéo thả đúng từ vào chỗ trống để hoàn chỉnh câu.",
    icon: "pen-tool",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "gameshow",
    name: "Trò chơi truyền hình",
    description: "Giống show truyền hình đố vui, có điểm số và áp lực thời gian. Trả lời đúng càng nhiều càng tốt, có thể có trợ giúp.",
    icon: "sparkles",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 20,
      category: 'general',
    }
  },
  {
    id: "fliptiles",
    name: "Thẻ lật đôi",
    description: "Bộ thẻ hai mặt với nội dung liên quan. Nhấn lật từng thẻ để xem thông tin và tìm cặp/trả lời.",
    icon: "rotate-ccw",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 3,
      category: 'general',
    }
  },
  {
    id: "wordsearch",
    name: "Tìm từ trong ô chữ",
    description: "Một lưới chữ cái có giấu các từ vựng. Tìm và tô đậm các từ được yêu cầu càng nhanh càng tốt.",
    icon: "book-open",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 120,
      category: 'general',
    }
  },
  {
    id: "spellword",
    name: "Đánh vần từ",
    description: "Một từ bị trống chữ. Kéo các chữ cái vào đúng vị trí để hoàn thành từ.",
    icon: "pen-tool",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 12,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "labelled",
    name: "Gắn nhãn vào hình",
    description: "Hình minh họa cần gắn nhãn đúng vị trí. Kéo các nhãn vào vị trí đúng trên sơ đồ/hình ảnh.",
    icon: "image",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 60,
      category: 'science',
    }
  },
  {
    id: "crossword",
    name: "Ô chữ",
    description: "Trò chơi giải ô chữ với gợi ý. Nhấn vào một ô, đọc gợi ý, rồi nhập từ đúng vào ô đó.",
    icon: "grid-3x3",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 15,
      timePerQuestion: 300,
      category: 'general',
    }
  },
  {
    id: "hangman",
    name: "Treo người",
    description: "Đoán từng chữ cái để hoàn thành từ. Đoán sai nhiều lần là thua.",
    icon: "shapes",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 60,
      category: 'general',
    }
  },
  {
    id: "imagequiz",
    name: "Câu đố hình ảnh",
    description: "Hình ảnh dần hé lộ, ai bấm chuông đầu tiên sẽ được trả lời câu hỏi.",
    icon: "image",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 15,
      category: 'general',
    }
  },
  {
    id: "flyingfruit",
    name: "Hái quả bay",
    description: "Các đáp án bay ngang màn hình, bạn phải nhấn đúng khi thấy đáp án đúng.",
    icon: "zap",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 15,
      timePerQuestion: 3,
      category: 'general',
    }
  },
  {
    id: "truefalse",
    name: "Đúng hay sai",
    description: "Mỗi phát biểu xuất hiện nhanh, chọn đúng hoặc sai trong thời gian giới hạn.",
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
    name: "Đuổi bắt trong mê cung",
    description: "Điều khiển nhân vật chạy đến đáp án đúng, tránh va vào vật cản hoặc sai.",
    icon: "target",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "balloonpop",
    name: "Bắn bong bóng",
    description: "Bắn bong bóng chứa từ để kéo vào đúng định nghĩa.",
    icon: "zap",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 15,
      timePerQuestion: 2,
      category: 'general',
    }
  },
  {
    id: "whackamole",
    name: "Đập chuột",
    description: "Chuột hiện lên từng con, đập đúng con mang đáp án chính xác.",
    icon: "gamepad",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 15,
      timePerQuestion: 2,
      category: 'general',
    }
  },
  {
    id: "memorize",
    name: "Trò chơi ghi nhớ",
    description: "Xem một loạt vật phẩm xuất hiện, sau đó chọn lại đúng các món đã thấy.",
    icon: "brain-circuit",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 3,
      category: 'general',
    }
  },
  {
    id: "airplane",
    name: "Lái máy bay tìm đáp án",
    description: "Điều khiển máy bay bay qua đáp án đúng, né các đáp án sai.",
    icon: "plane",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 5,
      category: 'general',
    }
  },
  {
    id: "rankorder",
    name: "Sắp xếp theo thứ tự",
    description: "Kéo và thả các mục theo thứ tự đúng (vd: từ nhỏ đến lớn, theo thời gian...).",
    icon: "sort-asc",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 45,
      category: 'general',
    }
  },
  {
    id: "winlosequiz",
    name: "Đặt cược điểm số",
    description: "Chọn số điểm đặt cược cho từng câu, đúng thì được, sai thì mất điểm.",
    icon: "badge-dollar-sign",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "mathgenerator",
    name: "Bài tập toán",
    description: "Chọn chủ đề toán học, hệ thống sẽ tạo ra loạt câu hỏi tự động.",
    icon: "calculator",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 30,
      category: 'math',
    }
  },
  {
    id: "wordmagnets",
    name: "Từ nam châm",
    description: "Kéo thả các từ hoặc chữ cái như nam châm để tạo thành câu hoàn chỉnh.",
    icon: "book-open",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 45,
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
  if (lowerTopic.includes('ghép cặp') || lowerTopic.includes('nối')) {
    return getGameTypeById('matchup');
  }
  if (lowerTopic.includes('xáo trộn chữ') || lowerTopic.includes('anagram')) {
    return getGameTypeById('anagram');
  }
  if (lowerTopic.includes('nam châm') || lowerTopic.includes('từ kéo thả')) {
    return getGameTypeById('wordmagnets');
  }
  if (lowerTopic.includes('điền từ') || lowerTopic.includes('chỗ trống')) {
    return getGameTypeById('sentence');
  }
  if (lowerTopic.includes('ghi nhớ') || lowerTopic.includes('trí nhớ')) {
    return getGameTypeById('memorize');
  }
  if (lowerTopic.includes('đúng sai') || lowerTopic.includes('true false')) {
    return getGameTypeById('truefalse');
  }
  if (lowerTopic.includes('sắp xếp') || lowerTopic.includes('thứ tự')) {
    return getGameTypeById('rankorder');
  }
  if (lowerTopic.includes('toán') || lowerTopic.includes('tính toán')) {
    return getGameTypeById('mathgenerator');
  }
  
  // Default to quiz for general topics
  return getGameTypeById('quiz');
};
