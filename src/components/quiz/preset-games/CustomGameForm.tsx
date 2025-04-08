
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SparklesIcon, Brain, PenTool, BookOpen, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomGameFormProps {
  gameType: string;
  onGenerate: (content: string) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ gameType, onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const { toast } = useToast();

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
        return 'Nhập yêu cầu để AI tạo câu hỏi trắc nghiệm.\n\nVí dụ: "Tạo 10 câu hỏi trắc nghiệm về lịch sử Việt Nam thời kỳ phong kiến, mỗi câu có 4 lựa chọn."';
      
      case 'flashcards':
        return 'Nhập yêu cầu để AI tạo thẻ ghi nhớ.\n\nVí dụ: "Tạo 15 thẻ ghi nhớ từ vựng tiếng Anh về chủ đề công nghệ, mỗi thẻ có từ tiếng Anh, nghĩa tiếng Việt và ví dụ."';
      
      case 'matching':
        return 'Nhập yêu cầu để AI tạo trò chơi nối từ.\n\nVí dụ: "Tạo 12 cặp từ đồng nghĩa tiếng Việt để ghép nối, độ khó trung bình, chủ đề văn học."';
      
      case 'truefalse':
        return 'Nhập yêu cầu để AI tạo câu hỏi đúng/sai.\n\nVí dụ: "Tạo 10 câu phát biểu đúng/sai về sinh học cấp 3, đủ độ khó, đảm bảo số lượng câu đúng và sai cân bằng."';
      
      default:
        return 'Nhập yêu cầu chi tiết để AI tạo nội dung trò chơi. Hãy mô tả cụ thể chủ đề, độ khó, số lượng và bất kỳ yêu cầu đặc biệt nào.';
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập yêu cầu nội dung cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // This would be replaced with actual AI generation later
    setTimeout(() => {
      onGenerate(content);
      setIsGenerating(false);
      
      toast({
        title: "Đã tạo trò chơi",
        description: `Trò chơi ${getGameTypeName()} đã được tạo thành công với AI.`,
      });
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
            <Label htmlFor="difficulty">Độ khó</Label>
            <Select 
              value={difficulty} 
              onValueChange={setDifficulty}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="content">Yêu cầu nội dung</Label>
            <Textarea
              id="content"
              placeholder={getPlaceholderText()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary mt-1" />
              <p className="text-sm text-muted-foreground">
                Chế độ Canvas <span className="text-primary font-medium">đã được bật</span> để tạo giao diện trò chơi đẹp mắt hơn.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <PenTool className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Tùy chỉnh chi tiết</h4>
                <p className="text-xs text-muted-foreground">Càng chi tiết càng tốt</p>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <BookOpen className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Nêu chủ đề học tập</h4>
                <p className="text-xs text-muted-foreground">Lịch sử, toán học, ngôn ngữ...</p>
              </div>
              
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col items-center text-center">
                <SparklesIcon className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-medium">Trò chơi tương tác</h4>
                <p className="text-xs text-muted-foreground">Quiz, ghép cặp, sắp xếp...</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
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
