
export interface GameType {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

const gameTypes: GameType[] = [
  {
    id: 'quiz',
    name: 'Trắc nghiệm',
    description: 'Câu hỏi nhiều lựa chọn',
    keywords: ['câu hỏi', 'trắc nghiệm', 'quiz', 'test', 'kiểm tra']
  },
  {
    id: 'memory',
    name: 'Trò chơi trí nhớ',
    description: 'Ghi nhớ và tìm cặp',
    keywords: ['trí nhớ', 'memory', 'ghi nhớ', 'tìm cặp', 'matching']
  },
  {
    id: 'puzzle',
    name: 'Trò chơi ghép hình',
    description: 'Xếp hình và giải đố',
    keywords: ['ghép hình', 'puzzle', 'xếp hình', 'jigsaw', 'giải đố']
  },
  {
    id: 'action',
    name: 'Trò chơi hành động',
    description: 'Game tương tác nhanh',
    keywords: ['hành động', 'action', 'tương tác', 'nhanh', 'phản xạ']
  }
];

export const getGameTypeByTopic = (topic: string): GameType | null => {
  const lowercaseTopic = topic.toLowerCase();
  
  for (const gameType of gameTypes) {
    for (const keyword of gameType.keywords) {
      if (lowercaseTopic.includes(keyword)) {
        return gameType;
      }
    }
  }
  
  return gameTypes[0]; // Default to quiz
};

export const getAllGameTypes = (): GameType[] => {
  return [...gameTypes];
};
