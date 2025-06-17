
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, BookOpen, Puzzle, Dices, 
  CheckSquare, Layers, ArrowRightLeft, Search, Sparkles,
  ArrowRight, DoorOpen
} from 'lucide-react';
import { GameSettingsData } from '../types';
import { useNavigate } from 'react-router-dom';

interface GameSelectorProps {
  onSelectGame: (gameType: string) => void;
  onQuickStart?: (gameType: string, prompt: string, settings: GameSettingsData) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const [selectedGameType, setSelectedGameType] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const navigate = useNavigate();
  
  const handleSelectGame = (gameType: string) => {
    setSelectedGameType(gameType);
    
    // Tự động điền "Học cùng AI" nếu topic trống
    const finalTopic = topic.trim() || 'Học cùng AI';
    
    if (gameType) {
      onSelectGame(gameType);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const gameTypes = [
    { 
      id: 'back', 
      name: 'Quay Lại', 
      description: 'Trở về trang chủ để chọn loại trò chơi khác',
      icon: <DoorOpen className="h-12 w-12 text-primary" />,
      isBackButton: true
    },
    { 
      id: 'quiz', 
      name: 'Trắc Nghiệm', 
      description: 'Trả lời câu hỏi nhiều lựa chọn với các chủ đề đa dạng',
      icon: <Brain className="h-12 w-12 text-primary" />
    },
    { 
      id: 'flashcards', 
      name: 'Thẻ Ghi Nhớ', 
      description: 'Học với thẻ hai mặt để ghi nhớ kiến thức hiệu quả',
      icon: <BookOpen className="h-12 w-12 text-primary" />
    },
    { 
      id: 'matching', 
      name: 'Nối Từ', 
      description: 'Nối các cặp từ tương ứng để kiểm tra hiểu biết',
      icon: <ArrowRightLeft className="h-12 w-12 text-primary" />
    },
    { 
      id: 'memory', 
      name: 'Trò Chơi Ghi Nhớ', 
      description: 'Tìm các cặp thẻ giống nhau để rèn luyện trí nhớ',
      icon: <Dices className="h-12 w-12 text-primary" />
    },
    { 
      id: 'ordering', 
      name: 'Sắp Xếp Câu', 
      description: 'Sắp xếp các từ để tạo thành câu hoàn chỉnh',
      icon: <Layers className="h-12 w-12 text-primary" />
    },
    { 
      id: 'wordsearch', 
      name: 'Tìm Từ Ẩn', 
      description: 'Tìm các từ ẩn trong bảng chữ cái thú vị',
      icon: <Search className="h-12 w-12 text-primary" />
    },
    { 
      id: 'truefalse', 
      name: 'Đúng hay Sai', 
      description: 'Xác định nội dung là đúng hay sai một cách nhanh chóng',
      icon: <CheckSquare className="h-12 w-12 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Chọn Loại Trò Chơi
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tạo trò chơi học tập tương tác với AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {gameTypes.map((game) => (
            <Card 
              key={game.id}
              className={`p-8 cursor-pointer transform transition-all duration-300 ease-out will-change-transform ${
                selectedGameType === game.id ? 'border-primary bg-primary/10 shadow-lg scale-105' : 'border-border hover:border-primary hover:bg-primary/5 hover:shadow-xl hover:scale-105 hover:-translate-y-1'
              } ${game.isBackButton ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30' : ''}`}
              style={{
                backfaceVisibility: 'hidden',
                perspective: '1000px',
                transform: 'translate3d(0, 0, 0)'
              }}
              onClick={() => game.isBackButton ? handleBackToHome() : handleSelectGame(game.id)}
            >
              <div className="flex flex-col items-center text-center gap-6 h-full">
                <div className="p-4 bg-primary/10 rounded-full transition-transform duration-300 ease-out will-change-transform">
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300">{game.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300">
                    {game.description}
                  </p>
                </div>
                <div className="mt-auto w-full">
                  <div className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out ${
                    game.isBackButton 
                      ? 'bg-gradient-to-r from-primary/30 to-primary/20 text-primary' 
                      : 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary'
                  }`}>
                    {game.isBackButton ? (
                      <>
                        <DoorOpen className="h-4 w-4 mr-2 transition-transform duration-300" />
                        <span className="transition-all duration-300">Về trang chủ</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 transition-transform duration-300" />
                        <span className="transition-all duration-300">Tạo với AI</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelector;
