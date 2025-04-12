
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad, SparklesIcon, Dices, Layers } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex flex-col">
      <header className="p-6 flex justify-center">
        <h1 className="text-3xl font-bold text-primary">AI Game Creator</h1>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Chọn loại trò chơi</h2>
            <p className="text-muted-foreground">Tạo và chơi các trò chơi tương tác với AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/preset-games">
              <Card className="p-6 hover:shadow-md transition-all hover:border-primary hover:bg-primary/5 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center gap-4 h-full">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Dices className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Trò Chơi Có Sẵn</h3>
                    <p className="text-muted-foreground mt-2">
                      Chọn từ các trò chơi có sẵn như trắc nghiệm, thẻ nhớ, và hơn thế nữa
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/custom-game">
              <Card className="p-6 hover:shadow-md transition-all hover:border-primary hover:bg-primary/5 cursor-pointer h-full border-2 border-primary/20">
                <div className="flex flex-col items-center text-center gap-4 h-full">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <SparklesIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Trò Chơi HTML Tùy Chỉnh</h3>
                    <p className="text-muted-foreground mt-2">
                      Tạo trò chơi HTML tùy chỉnh với AI từ mô tả của bạn
                    </p>
                  </div>
                  <div className="mt-auto">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      Mới
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/quiz">
              <Card className="p-6 hover:shadow-md transition-all hover:border-primary hover:bg-primary/5 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center gap-4 h-full">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Gamepad className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Tạo Game Nhanh</h3>
                    <p className="text-muted-foreground mt-2">
                      Nhập mô tả để AI tạo nhanh một trò chơi đơn giản
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
          
          <div className="mt-12">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Layers className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Trò Chơi Đã Lưu</h3>
                  <p className="text-muted-foreground mt-1">
                    Xem và chơi lại các trò chơi bạn đã tạo trước đó
                  </p>
                </div>
                <Link to="/game-history">
                  <Button variant="default" className="whitespace-nowrap">
                    Xem lịch sử
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="p-4 text-center text-muted-foreground text-sm">
        <p>© 2023 AI Game Creator. Tất cả trò chơi được tạo bởi AI.</p>
      </footer>
    </div>
  );
};

export default HomePage;
