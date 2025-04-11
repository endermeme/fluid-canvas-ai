
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, Brain, PenTool, Info, Globe, Gamepad2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator, MiniGame } from '../generator/AIGameGenerator';
import { GameSettingsData } from '../types';
import GameLoading from '../GameLoading';
import QuizContainer from '../QuizContainer';

interface CustomGameFormProps {
  gameType: string;
  onGenerate: (content: string, game?: MiniGame) => void;
  onCancel: () => void;
}

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

const CustomGameForm: React.FC<CustomGameFormProps> = ({ gameType, onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the singleton pattern
  const gameGenerator = AIGameGenerator.getInstance(API_KEY);

  const getPlaceholderText = () => {
    return 'Nhập yêu cầu chi tiết để AI tạo nội dung trò chơi. Hãy mô tả cụ thể chủ đề, mong muốn về số lượng câu hỏi, độ khó và bất kỳ yêu cầu đặc biệt nào.\n\nVí dụ: "Tạo 10 câu hỏi trắc nghiệm về lịch sử Việt Nam thời kỳ phong kiến, mỗi câu có 4 lựa chọn."';
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập yêu cầu nội dung cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const settings: GameSettingsData = {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
        useTimer: true,
        bonusTime: 5,
        totalTime: 300
      };
      
      console.log("Tạo game với chủ đề:", content);
      
      const game = await gameGenerator.generateMiniGame(content, settings);
      
      if (game) {
        toast({
          title: "Đã tạo trò chơi",
          description: "Trò chơi đã được tạo thành công với AI.",
        });
        
        onGenerate(content, game);
      } else {
        throw new Error("Không thể tạo game");
      }
    } catch (error) {
      console.error("Lỗi khi tạo game:", error);
      toast({
        title: "Lỗi tạo game",
        description: "Có lỗi xảy ra khi tạo game. Vui lòng thử lại.",
        variant: "destructive"
      });
      onGenerate(content);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    if (window.location.pathname === '/quiz' && !window.location.search) {
      navigate('/');
    } else {
      onCancel();
    }
  };

  if (isGenerating) {
    return <GameLoading topic={content} />;
  }

  const footerActions = (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={handleCancel}
        className="border-primary/20 hover:border-primary/30 hover:bg-primary/5"
      >
        Hủy
      </Button>
      <Button 
        onClick={handleSubmit}
        disabled={!content.trim() || isGenerating}
        className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
      >
        <SparklesIcon className="h-4 w-4 mr-2" />
        Tạo với AI
      </Button>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto w-full">
      <Card className="bg-background/70 backdrop-blur-sm border-primary/20 shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            Tạo trò chơi tùy chỉnh với AI
          </h2>
          <p className="text-muted-foreground">Mô tả yêu cầu của bạn để AI tạo nội dung trò chơi phù hợp</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="content" className="flex items-center gap-2 text-base">
              <SparklesIcon className="h-4 w-4 text-primary" /> 
              Yêu cầu nội dung
            </Label>
            <Textarea
              id="content"
              placeholder={getPlaceholderText()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm mt-2 border-primary/20 focus-visible:ring-primary/30"
            />
          </div>
          
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-start gap-2 bg-primary/5 p-3 rounded-lg">
              <Info className="w-4 h-4 text-primary mt-1" />
              <p className="text-sm text-muted-foreground">
                Trò chơi sẽ được tạo theo yêu cầu của bạn với các cài đặt mặc định (độ khó trung bình, 10 câu hỏi, 30 giây mỗi câu).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <PenTool className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Mô tả chi tiết</h4>
                <p className="text-xs text-muted-foreground">Càng chi tiết càng tốt</p>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <Globe className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Đa dạng chủ đề</h4>
                <p className="text-xs text-muted-foreground">Lịch sử, khoa học, văn hóa...</p>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <Gamepad2 className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Tương tác cao</h4>
                <p className="text-xs text-muted-foreground">Trải nghiệm người dùng tốt</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameForm;
