
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
  {
    id: "mindmap",
    name: "Sơ đồ tư duy",
    description: "Xây dựng sơ đồ tư duy tương tác từ các khái niệm và mối liên hệ giữa chúng.",
    icon: "brain-circuit",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 1,
      timePerQuestion: 300,
      category: 'general',
    }
  },
  {
    id: "timeline",
    name: "Dòng thời gian",
    description: "Sắp xếp các sự kiện lịch sử theo đúng thứ tự thời gian trên trục dòng thời gian.",
    icon: "clock4",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 40,
      category: 'history',
    }
  },
  {
    id: "conceptmap",
    name: "Bản đồ khái niệm",
    description: "Tạo mối liên kết giữa các khái niệm và giải thích mối quan hệ giữa chúng.",
    icon: "layers",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 1,
      timePerQuestion: 300,
      category: 'general',
    }
  },
  {
    id: "chainreaction",
    name: "Phản ứng dây chuyền",
    description: "Giải các câu đố liên tiếp, đáp án của câu trước sẽ là gợi ý cho câu tiếp theo.",
    icon: "zap",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 30,
      category: 'general',
    }
  },
  {
    id: "experimentlab",
    name: "Phòng thí nghiệm ảo",
    description: "Tiến hành các thí nghiệm khoa học ảo với kết quả tương tác theo thời gian thực.",
    icon: "flask-conical",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 120,
      category: 'science',
    }
  },
  {
    id: "debate",
    name: "Phiên tranh luận",
    description: "Luyện tập kỹ năng tranh luận với các chủ đề và quan điểm đối lập được cung cấp.",
    icon: "message-square",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 120,
      category: 'general',
    }
  },
  {
    id: "casestudy",
    name: "Nghiên cứu tình huống",
    description: "Phân tích các tình huống thực tế và đề xuất giải pháp dựa trên kiến thức đã học.",
    icon: "book",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 3,
      timePerQuestion: 300,
      category: 'general',
    }
  },
  {
    id: "literaryanalysis",
    name: "Phân tích văn học",
    description: "Phân tích văn bản, nhận diện các thủ pháp văn học và ý nghĩa của tác phẩm.",
    icon: "book-open",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 180,
      category: 'arts',
    }
  },
  {
    id: "problemsolving",
    name: "Giải quyết vấn đề",
    description: "Áp dụng tư duy phản biện để giải quyết các vấn đề thực tế đa lĩnh vực.",
    icon: "lightbulb",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 240,
      category: 'general',
    }
  },
  {
    id: "vocabularybuilder",
    name: "Xây dựng vốn từ vựng",
    description: "Học từ vựng mới thông qua các bài tập tương tác và ngữ cảnh thực tế.",
    icon: "book",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 20,
      timePerQuestion: 20,
      category: 'general',
    }
  },
  {
    id: "storytelling",
    name: "Kể chuyện sáng tạo",
    description: "Xây dựng câu chuyện dựa trên các yếu tố được cung cấp, phát triển kỹ năng sáng tác.",
    icon: "pen-tool",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 1,
      timePerQuestion: 600,
      category: 'arts',
    }
  },
  {
    id: "datainterpretation",
    name: "Phân tích dữ liệu",
    description: "Diễn giải biểu đồ, đồ thị và dữ liệu thống kê để rút ra kết luận."  ,
    icon: "bar-chart",
    defaultSettings: {
      difficulty: 'medium',
      questionCount: 8,
      timePerQuestion: 60,
      category: 'math',
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
  if (lowerTopic.includes('sơ đồ tư duy') || lowerTopic.includes('mindmap')) {
    return getGameTypeById('mindmap');
  }
  if (lowerTopic.includes('dòng thời gian') || lowerTopic.includes('timeline')) {
    return getGameTypeById('timeline');
  }
  if (lowerTopic.includes('phân tích dữ liệu') || lowerTopic.includes('biểu đồ')) {
    return getGameTypeById('datainterpretation');
  }
  if (lowerTopic.includes('từ vựng') || lowerTopic.includes('vocabulary')) {
    return getGameTypeById('vocabularybuilder');
  }
  if (lowerTopic.includes('phân loại') || lowerTopic.includes('nhóm')) {
    return getGameTypeById('groupsort');
  }
  if (lowerTopic.includes('kể chuyện') || lowerTopic.includes('storytelling')) {
    return getGameTypeById('storytelling');
  }
  if (lowerTopic.includes('tranh luận') || lowerTopic.includes('debate')) {
    return getGameTypeById('debate');
  }
  if (lowerTopic.includes('tình huống') || lowerTopic.includes('case study')) {
    return getGameTypeById('casestudy');
  }
  if (lowerTopic.includes('văn học') || lowerTopic.includes('literary')) {
    return getGameTypeById('literaryanalysis');
  }
  if (lowerTopic.includes('vấn đề') || lowerTopic.includes('problem solving')) {
    return getGameTypeById('problemsolving');
  }
  if (lowerTopic.includes('thí nghiệm') || lowerTopic.includes('experiment')) {
    return getGameTypeById('experimentlab');
  }
  if (lowerTopic.includes('liên kết') || lowerTopic.includes('concept map')) {
    return getGameTypeById('conceptmap');
  }
  if (lowerTopic.includes('dây chuyền') || lowerTopic.includes('chain')) {
    return getGameTypeById('chainreaction');
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
