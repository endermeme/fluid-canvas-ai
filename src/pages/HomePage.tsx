
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad, SparklesIcon, History } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex flex-col">
      <header className="p-4 flex justify-center">
        <h1 className="text-2xl font-bold text-primary">AI Game Creator</h1>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/custom-game">
              <Card className="p-5 hover:shadow-md transition-all hover:border-primary hover:bg-primary/5 cursor-pointer h-full border-2 border-primary/20">
                <div className="flex flex-col items-center text-center gap-3 h-full">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <SparklesIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Tạo Game HTML</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Mô tả game bạn muốn và AI sẽ tạo ngay
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/preset-games">
              <Card className="p-5 hover:shadow-md transition-all hover:border-primary hover:bg-primary/5 cursor-pointer h-full">
                <div className="flex flex-col items-center text-center gap-3 h-full">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Gamepad className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Trò Chơi Có Sẵn</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Chọn từ các loại trò chơi được thiết kế sẵn
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
          
          <div className="mt-6">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="p-2 bg-primary/10 rounded-full">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Lịch Sử Game</h3>
                  <p className="text-sm text-muted-foreground">
                    Xem các trò chơi đã tạo
                  </p>
                </div>
                <Link to="/game-history">
                  <Button variant="default" size="sm" className="whitespace-nowrap">
                    Xem lịch sử
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="p-3 text-center text-muted-foreground text-xs">
        <p>© 2023 AI Game Creator</p>
      </footer>
    </div>
  );
};

export default HomePage;
