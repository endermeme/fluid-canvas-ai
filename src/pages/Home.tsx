
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, Gamepad } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-primary">Smart</span> Learning Games
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Học tập thông minh và hiệu quả thông qua các trò chơi giáo dục
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/quiz" className="w-full">
            <Button size="lg" className="w-full h-16" variant="default">
              <Brain className="mr-2 h-5 w-5" />
              Tạo trò chơi với AI
            </Button>
          </Link>

          <Link to="/preset-games" className="w-full">
            <Button size="lg" className="w-full h-16" variant="outline">
              <Gamepad className="mr-2 h-5 w-5" />
              Trò chơi có sẵn
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          Nền tảng học tập thông minh với công nghệ AI hiện đại
        </p>
      </div>
    </div>
  );
};

export default Home;
