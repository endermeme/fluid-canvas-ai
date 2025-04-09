
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SparklesIcon, Brain, PenTool, Info, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AIGameGenerator, MiniGame } from '../generator/AIGameGenerator';
import { GameSettingsData } from '../types';

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

  const getGameTypeName = () => {
    switch (gameType) {
      case 'quiz': return 'Trắc Nghiệm';
      case 'flashcards': return 'Thẻ Ghi Nhớ';
      case 'matching': return 'Nối Từ';
      case 'memory': return 'Trò Chơi Ghi Nhớ';
      case 'ordering': return 'Sắp Xếp Câu';
      case 'wordsearch': return 'Tìm Từ';
      case 'pictionary': return 'Đoán Hình';
      case 'truefalse': return 'Đúng hay Sai';
      default: return 'Trò Chơi';
    }
  };

  const getPlaceholderText = () => {
    switch (gameType) {
      case 'quiz':
        return 'Nhập yêu cầu để AI tạo câu hỏi trắc nghiệm.\n\nVí dụ: "Tạo 10 câu hỏi trắc nghiệm về lịch sử Việt Nam thời kỳ phong kiến, mỗi câu có 4 lựa chọn. Độ khó trung bình, phù hợp với học sinh lớp 10."';
      
      case 'flashcards':
        return 'Nhập yêu cầu để AI tạo thẻ ghi nhớ.\n\nVí dụ: "Tạo 15 thẻ ghi nhớ từ vựng tiếng Anh về chủ đề công nghệ, mỗi thẻ có từ tiếng Anh, nghĩa tiếng Việt và ví dụ. Độ khó dễ, dành cho người mới học."';
      
      case 'matching':
        return 'Nhập yêu cầu để AI tạo trò chơi nối từ.\n\nVí dụ: "Tạo 12 cặp từ đồng nghĩa tiếng Việt để ghép nối, độ khó trung bình, chủ đề văn học. Dành cho học sinh phổ thông."';
      
      case 'truefalse':
        return 'Nhập yêu cầu để AI tạo câu hỏi đúng/sai.\n\nVí dụ: "Tạo 10 câu phát biểu đúng/sai về sinh học cấp 3, đủ độ khó cao, đảm bảo số lượng câu đúng và sai cân bằng. Mỗi câu có giải thích chi tiết."';
      
      default:
        return 'Nhập yêu cầu chi tiết để AI tạo nội dung trò chơi. Hãy mô tả cụ thể chủ đề, độ khó, số lượng và bất kỳ yêu cầu đặc biệt nào.\n\nVí dụ: "Tạo trò chơi với chủ đề toán học cho học sinh lớp 5, độ khó trung bình, tập trung vào phép nhân và chia."';
    }
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
        category: 'general'
      };
      
      console.log("Tạo game với chủ đề:", content);
      
      const game = await gameGenerator.generateMiniGame(content, settings);
      
      if (game) {
        toast({
          title: "Đã tạo trò chơi",
          description: `Trò chơi ${getGameTypeName()} đã được tạo thành công với AI.`,
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

  const generateSamplePrompt = () => {
    let samplePrompt = '';
    
    switch (gameType) {
      case 'quiz':
        samplePrompt = 'Tạo 8 câu hỏi trắc nghiệm về các địa danh nổi tiếng ở Việt Nam, mỗi câu có 4 lựa chọn. Độ khó vừa phải, phù hợp với học sinh cấp 2.';
        break;
      case 'flashcards':
        samplePrompt = 'Tạo 10 thẻ ghi nhớ về các công thức Vật lý quan trọng trong chương trình THPT, mỗi thẻ có công thức và ý nghĩa của công thức.';
        break;
      case 'memory':
        samplePrompt = 'Tạo trò chơi ghi nhớ với chủ đề động vật, 8 cặp thẻ, mỗi thẻ có tên và hình ảnh động vật.';
        break;
      case 'matching':
        samplePrompt = 'Tạo 12 cặp từ tiếng Anh - tiếng Việt về chủ đề thể thao, độ khó trung bình, phù hợp cho học sinh cấp 2.';
        break;
      default:
        samplePrompt = 'Tạo trò chơi với chủ đề khoa học vũ trụ cho học sinh cấp 3, độ khó trung bình, tập trung vào các hành tinh trong hệ mặt trời, 10 câu hỏi.';
    }
    
    setContent(samplePrompt);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      <Card className="bg-background/60 backdrop-blur-sm border-primary/20 shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Tạo trò chơi {getGameTypeName()} với AI
          </h2>
          <p className="text-muted-foreground">Mô tả yêu cầu của bạn để AI tạo nội dung trò chơi phù hợp</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="content" className="text-base font-medium">Yêu cầu nội dung</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={generateSamplePrompt}
                className="text-xs h-6 px-2 py-0 flex items-center gap-1 hover:bg-primary/5"
              >
                <Wand2 className="h-3.5 w-3.5" /> Gợi ý
              </Button>
            </div>
            <Textarea
              id="content"
              placeholder={getPlaceholderText()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm mt-1.5"
            />
          </div>
          
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-1" />
              <p className="text-sm text-muted-foreground">
                Viết yêu cầu chi tiết giúp AI hiểu rõ nội dung bạn muốn tạo. Hãy nêu rõ chủ đề, độ khó, đối tượng người chơi và các yêu cầu đặc biệt.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <PenTool className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Tùy chỉnh chi tiết</h4>
                <p className="text-xs text-muted-foreground">Mô tả càng chi tiết càng tốt để AI hiểu đúng ý bạn</p>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <SparklesIcon className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Trò chơi tương tác</h4>
                <p className="text-xs text-muted-foreground">AI sẽ tạo trò chơi tương tác đẹp mắt theo yêu cầu của bạn</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isGenerating}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Tạo với AI
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomGameForm;
