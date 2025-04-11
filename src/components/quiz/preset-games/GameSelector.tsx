
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  Image, CheckSquare, Layers, ArrowRightLeft, Search, Sparkles
} from 'lucide-react';

interface GameSelectorProps {
  onSelectGame: (gameType: string) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const gameTypes = [
    { 
      id: 'quiz', 
      name: 'Trắc Nghiệm', 
      description: 'Trả lời câu hỏi nhiều lựa chọn',
      icon: <Brain className="h-8 w-8 text-primary" />
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học với thẻ hai mặt',
      icon: <BookOpen className="h-8 w-8 text-primary" />
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Nối các cặp từ tương ứng với nhau',
      icon: <ArrowRightLeft className="h-8 w-8 text-primary" />
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Tìm các cặp thẻ giống nhau',
      icon: <Dices className="h-8 w-8 text-primary" />
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="h-8 w-8 text-primary" />
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm các từ ẩn trong bảng chữ cái',
      icon: <Search className="h-8 w-8 text-primary" />
    },
    { 
      id: 'pictionary', 
      name: 'Đoán Hình', 
      description: 'Đoán từ qua hình ảnh',
      icon: <Image className="h-8 w-8 text-primary" />
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Xác định nội dung là đúng hay sai',
      icon: <CheckSquare className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Chọn loại trò chơi để tạo với AI</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {gameTypes.map((game) => (
          <Card 
            key={game.id}
            className="p-4 hover:shadow-md transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
            onClick={() => onSelectGame(game.id)}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                {game.icon}
              </div>
              <div>
                <h3 className="font-bold">{game.name}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </div>
              <div className="mt-2 flex items-center justify-center w-full px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-1" />
                Tạo với AI
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GameSelector;
