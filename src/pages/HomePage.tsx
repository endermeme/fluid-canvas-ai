
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Code, 
  Zap, 
  BookOpen, 
  FileQuestion, 
  FileSpreadsheet,
  RotateCw,
  Brain,
  Layout,
  Edit3
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        <section className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Game Learning Platform
          </h1>
          <p className="text-muted-foreground text-lg">
            Tạo và chơi các trò chơi học tập tương tác
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trò chơi có sẵn - Card */}
          <Card className="shadow-md border-primary/10 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">Trò chơi chuẩn</CardTitle>
                <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-700">
                  Chính thức
                </Badge>
              </div>
              <CardDescription>
                Các mẫu trò chơi được thiết kế sẵn, dễ dàng tùy chỉnh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 gap-2 rounded-lg border border-border bg-background/50">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <span className="text-xs text-center">Flashcards</span>
                </div>
                <div className="flex flex-col items-center p-3 gap-2 rounded-lg border border-border bg-background/50">
                  <FileQuestion className="h-8 w-8 text-primary" />
                  <span className="text-xs text-center">Quiz</span>
                </div>
                <div className="flex flex-col items-center p-3 gap-2 rounded-lg border border-border bg-background/50">
                  <FileSpreadsheet className="h-8 w-8 text-primary" />
                  <span className="text-xs text-center">Matching</span>
                </div>
                <div className="flex flex-col items-center p-3 gap-2 rounded-lg border border-border bg-background/50">
                  <RotateCw className="h-8 w-8 text-primary" />
                  <span className="text-xs text-center">Memory</span>
                </div>
                <div className="flex flex-col items-center p-3 gap-2 rounded-lg border border-border bg-background/50">
                  <Brain className="h-8 w-8 text-primary" />
                  <span className="text-xs text-center">Word Search</span>
                </div>
                <div className="flex flex-col items-center p-3 gap-2 text-muted-foreground rounded-lg border border-dashed border-border bg-background/50">
                  <span className="text-2xl">+</span>
                  <span className="text-xs text-center">Thêm nữa</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleNavigate('/preset-game')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              >
                <Layout className="mr-2 h-4 w-4" />
                Chọn trò chơi có sẵn
              </Button>
            </CardFooter>
          </Card>

          {/* Tạo trò chơi HTML tùy chỉnh - Card */}
          <Card className="shadow-md border-primary/10 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">Tạo game tùy chỉnh</CardTitle>
                <Badge variant="outline" className="bg-amber-200/50 text-amber-700 border-amber-500">
                  BETA
                </Badge>
              </div>
              <CardDescription>
                Tạo trò chơi HTML tùy chỉnh với AI từ ý tưởng của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center p-4 rounded-lg border border-dashed border-primary/40 bg-primary/5">
                  <Code className="h-12 w-12 text-primary mb-3" />
                  <p className="text-sm text-center">
                    Nhập mô tả về trò chơi bạn muốn tạo và AI sẽ tạo mã HTML, 
                    CSS, JavaScript tương tác ngay lập tức
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 p-2 rounded-md bg-background border border-border">
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span>Tương tác cao</span>
                  </div>
                  <div className="flex items-center gap-1 p-2 rounded-md bg-background border border-border">
                    <Edit3 className="h-3 w-3 text-blue-500" />
                    <span>Tùy chỉnh</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleNavigate('/custom-game')} 
                variant="secondary"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
              >
                <Code className="mr-2 h-4 w-4" />
                Tạo trò chơi HTML
              </Button>
            </CardFooter>
          </Card>
        </section>
        
        <section className="text-center mt-4">
          <Button variant="link" onClick={() => handleNavigate('/game-history')}>
            Xem lịch sử game đã tạo
          </Button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
