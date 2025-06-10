
export const getGameTypeName = (gameType: string) => {
  switch (gameType) {
    case 'quiz': return 'Trắc Nghiệm';
    case 'flashcards': return 'Thẻ Ghi Nhớ';
    case 'matching': return 'Nối Từ';
    case 'memory': return 'Trò Chơi Ghi Nhớ';
    case 'ordering': return 'Sắp Xếp Câu';
    case 'wordsearch': return 'Tìm Từ';
    case 'pictionary': return 'Đoán Hình';
    case 'truefalse': return 'Đúng hay Sai';
    case 'groupsort': return 'Phân Nhóm';
    case 'spinwheel': return 'Vòng Quay May Mắn';
    case 'completesentence': return 'Hoàn Thành Câu';
    case 'anagram': return 'Đảo Chữ';
    case 'openbox': return 'Mở Hộp Bí Ẩn';
    case 'speakingcards': return 'Thẻ Luyện Nói';
    case 'neuronpaths': return 'Đường Dẫn Thần Kinh';
    default: return 'Trò Chơi';
  }
};

export const getGameTypeObject = (gameType: string, settings: any) => {
  const gameTypeMap = {
    'quiz': {
      id: 'quiz',
      name: 'Trắc Nghiệm',
      description: 'Trò chơi trắc nghiệm với nhiều lựa chọn',
      icon: 'brain-circuit',
      defaultSettings: settings
    },
    'flashcards': {
      id: 'flashcards',
      name: 'Thẻ Ghi Nhớ',
      description: 'Thẻ lật hai mặt để học và ghi nhớ thông tin',
      icon: 'light-bulb',
      defaultSettings: settings
    },
    'matching': {
      id: 'matching',
      name: 'Nối Từ',
      description: 'Nối các cặp từ tương ứng với nhau',
      icon: 'puzzle-piece',
      defaultSettings: settings
    },
    'memory': {
      id: 'memory',
      name: 'Trò Chơi Ghi Nhớ',
      description: 'Lật và ghép cặp các thẻ giống nhau',
      icon: 'brain-circuit',
      defaultSettings: settings
    },
    'ordering': {
      id: 'ordering',
      name: 'Sắp Xếp Câu',
      description: 'Sắp xếp các từ theo thứ tự đúng',
      icon: 'dices',
      defaultSettings: settings
    },
    'wordsearch': {
      id: 'wordsearch',
      name: 'Tìm Từ',
      description: 'Tìm các từ ẩn trong bảng chữ cái',
      icon: 'pen-tool',
      defaultSettings: settings
    },
    'pictionary': {
      id: 'pictionary',
      name: 'Đoán Hình',
      description: 'Chọn đáp án đúng dựa trên hình ảnh',
      icon: 'heart-handshake',
      defaultSettings: settings
    },
    'truefalse': {
      id: 'truefalse',
      name: 'Đúng hay Sai',
      description: 'Kiểm tra kiến thức với các câu hỏi đúng/sai',
      icon: 'clock',
      defaultSettings: settings
    },
    'groupsort': {
      id: 'groupsort',
      name: 'Phân Nhóm',
      description: 'Phân nhóm các câu hỏi theo nhóm',
      icon: 'users',
      defaultSettings: settings
    },
    'spinwheel': {
      id: 'spinwheel',
      name: 'Vòng Quay May Mắn',
      description: 'Vòng quay may mắn với các phần thưởng',
      icon: 'dices',
      defaultSettings: settings
    },
    'completesentence': {
      id: 'completesentence',
      name: 'Hoàn Thành Câu',
      description: 'Hoàn thành câu hỏi với các từ trống',
      icon: 'pencil',
      defaultSettings: settings
    },
    'anagram': {
      id: 'anagram',
      name: 'Đảo Chữ',
      description: 'Đảo chữ của các từ',
      icon: 'pencil',
      defaultSettings: settings
    },
    'openbox': {
      id: 'openbox',
      name: 'Mở Hộp Bí Ẩn',
      description: 'Mở hộp bí ẩn với các phần thưởng',
      icon: 'box',
      defaultSettings: settings
    },
    'speakingcards': {
      id: 'speakingcards',
      name: 'Thẻ Luyện Nói',
      description: 'Thẻ luyện nói với các câu hỏi',
      icon: 'pencil',
      defaultSettings: settings
    },
    'neuronpaths': {
      id: 'neuronpaths',
      name: 'Đường Dẫn Thần Kinh',
      description: 'Tạo neural map với các nodes concepts',
      icon: 'brain-circuit',
      defaultSettings: settings
    }
  };

  return gameTypeMap[gameType] || null;
};
