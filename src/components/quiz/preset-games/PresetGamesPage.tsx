
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BrainCircuit, Lightbulb, PuzzlePiece, Clock4, 
  Dices, HeartHandshake, PenTool, ArrowLeft, Home
} from 'lucide-react';

const gameTypes = [
  {
    id: 'quiz',
    name: 'Trắc Nghiệm',
    description: 'Trò chơi trắc nghiệm với nhiều lựa chọn',
    icon: BrainCircuit,
    color: 'from-blue-500 to-indigo-600',
    difficulty: 'Dễ - Trung bình'
  },
  {
    id: 'flashcards',
    name: 'Thẻ Ghi Nhớ',
    description: 'Thẻ lật hai mặt để học và ghi nhớ thông tin',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-600',
    difficulty: 'Dễ'
  },
  {
    id: 'matching',
    name: 'Nối Từ',
    description: 'Nối các cặp từ tương ứng với nhau',
    icon: PuzzlePiece,
    color: 'from-green-500 to-emerald-600',
    difficulty: 'Trung bình'
  },
  {
    id: 'memory',
    name: 'Trò Chơi Ghi Nhớ',
    description: 'Lật và ghép cặp các thẻ giống nhau',
    icon: BrainCircuit,
    color: 'from-purple-500 to-violet-600',
    difficulty: 'Trung bình - Khó'
  },
  {
    id: 'ordering',
    name: 'Sắp Xếp Câu',
    description: 'Sắp xếp các từ theo thứ tự đúng',
    icon: Dices,
    color: 'from-pink-500 to-rose-600',
    difficulty: 'Khó'
  },
  {
    id: 'wordsearch',
    name: 'Tìm Từ',
    description: 'Tìm các từ ẩn trong bảng chữ cái',
    icon: PenTool,
    color: 'from-cyan-500 to-blue-600',
    difficulty: 'Trung bình'
  },
  {
    id: 'truefalse',
    name: 'Đúng hay Sai',
    description: 'Kiểm tra kiến thức với các câu hỏi đúng/sai',
    icon: Clock4,
    color: 'from-red-500 to-pink-600',
    difficulty: 'Dễ - Trung bình'
  }
];

const PresetGamesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameType: string) => {
    navigate(`/preset-games/${gameType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header với navigation */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg border-b border-white/20">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Trang chủ
            </Button>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Chọn Loại Game
            </h1>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main content với spacing tốt hơn */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Title section với margin tốt hơn */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Chọn Loại Trò Chơi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các loại trò chơi học tập khác nhau. Mỗi game được thiết kế 
              để giúp bạn học một cách thú vị và hiệu quả.
            </p>
          </div>

          {/* Game cards grid với spacing đẹp hơn */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameTypes.map((game) => {
              const IconComponent = game.icon;
              
              return (
                <Card 
                  key={game.id}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
                  onClick={() => handleGameSelect(game.id)}
                >
                  <div className={`h-2 bg-gradient-to-r ${game.color}`}></div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${game.color} text-white shadow-lg`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {game.name}
                        </CardTitle>
                        <div className="text-xs text-gray-500 font-medium">
                          {game.difficulty}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 text-sm leading-relaxed mb-4">
                      {game.description}
                    </CardDescription>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg transition-all duration-200 text-white font-medium`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGameSelect(game.id);
                      }}
                    >
                      Chọn Game Này
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer info với margin tốt hơn */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              💡 Mỗi game có thể được tùy chỉnh theo độ khó và chủ đề của bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresetGamesPage;
