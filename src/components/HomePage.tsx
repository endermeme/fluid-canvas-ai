import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, RocketIcon, PuzzleIcon, Lightbulb, BookOpenIcon } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Chào mừng đến với Trang Chủ</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Game Selectors */}
        <div className="p-4 border rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors duration-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-yellow-500" />
            Chơi Nhanh
          </h2>
          <p className="text-muted-foreground mb-4">Chọn một trò chơi nhanh để bắt đầu ngay lập tức.</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate('/preset-games/quiz')} variant="outline">
              <Lightbulb className="h-4 w-4 mr-2" />
              Trắc nghiệm Nhanh
            </Button>
            <Button onClick={() => navigate('/preset-games/matching')} variant="outline">
              <PuzzleIcon className="h-4 w-4 mr-2" />
              Ghép Cặp
            </Button>
            <Button onClick={() => navigate('/preset-games/wordsearch')} variant="outline">
              <BookOpenIcon className="h-4 w-4 mr-2" />
              Tìm Ô Chữ
            </Button>
          </div>
        </div>
        
        {/* Custom Game Creation */}
        <div className="p-4 border rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors duration-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <RocketIcon className="h-5 w-5 text-blue-500" />
            Tạo Game Tùy Chỉnh
          </h2>
          <p className="text-muted-foreground mb-4">Tạo trò chơi của riêng bạn với chủ đề và nội dung tùy chỉnh.</p>
          <Button 
            onClick={() => navigate('/custom-game')}
            className="mt-4"
          >
            Tạo Game Tùy Chỉnh
          </Button>
        </div>
        
        {/* Placeholder for Future Feature */}
        <div className="p-4 border rounded-lg bg-muted/50 text-center">
          <h2 className="text-xl font-semibold mb-4">Tính năng Sắp Ra Mắt</h2>
          <p className="text-muted-foreground">
            Các tính năng mới đang được phát triển và sẽ sớm có mặt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
