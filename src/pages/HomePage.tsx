
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad, SparklesIcon, History, Share2 } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl px-4 py-10">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI Game Creator
          </h1>
          <p className="text-muted-foreground mt-2">Tạo trò chơi tương tác bằng trí tuệ nhân tạo</p>
        </header>
        
        <main className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link to="/custom-game" className="block h-full transform transition-all duration-300 hover:scale-[1.02]">
              <Card className="p-6 h-full hover:shadow-lg transition-all hover:border-primary hover:bg-primary/5 cursor-pointer border-2 border-primary/20 overflow-hidden group">
                <div className="flex flex-col items-center text-center gap-4 h-full relative">
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full transform group-hover:scale-110 transition-transform"></div>
                  <div className="p-4 bg-primary/10 rounded-full z-10 transform group-hover:scale-110 transition-transform">
                    <SparklesIcon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="z-10">
                    <h3 className="font-bold text-xl mb-1">Tạo Game HTML</h3>
                    <p className="text-muted-foreground">
                      Mô tả game bạn muốn và AI sẽ tạo ngay
                    </p>
                  </div>
                  <div className="mt-auto pt-2 w-full">
                    <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
                      Bắt đầu tạo
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/preset-games" className="block h-full transform transition-all duration-300 hover:scale-[1.02]">
              <Card className="p-6 h-full hover:shadow-lg transition-all hover:border-primary hover:bg-primary/5 cursor-pointer border-2 border-primary/20 overflow-hidden group">
                <div className="flex flex-col items-center text-center gap-4 h-full relative">
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full transform group-hover:scale-110 transition-transform"></div>
                  <div className="p-4 bg-primary/10 rounded-full z-10 transform group-hover:scale-110 transition-transform">
                    <Gamepad className="h-10 w-10 text-primary" />
                  </div>
                  <div className="z-10">
                    <h3 className="font-bold text-xl mb-1">Trò Chơi Có Sẵn</h3>
                    <p className="text-muted-foreground">
                      Chọn từ các loại trò chơi được thiết kế sẵn dưới đây
                    </p>
                  </div>
                  <div className="mt-auto pt-2 w-full">
                    <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
                      Xem trò chơi
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <Link to="/game-history">
              <Card className="p-5 hover:shadow-lg transition-all hover:border-primary/50 hover:bg-primary/5 border border-primary/20 overflow-hidden transform hover:scale-[1.02] duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <History className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Lịch Sử Game</h3>
                    <p className="text-sm text-muted-foreground">
                      Xem và quản lý các trò chơi đã tạo
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </main>
        
        <footer className="mt-12 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} AI Game Creator | Powered by CES AI</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
