
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SparklesIcon, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomGameFormProps {
  gameType: string;
  onGenerate: (content: string, difficulty: string) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ gameType, onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const { toast } = useToast();

  const handleDifficultyChange = (value: string) => {
    if (value === 'easy' || value === 'medium' || value === 'hard') {
      setDifficulty(value);
    }
  };

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
        return 'Nhập yêu cầu để AI tạo câu hỏi trắc nghiệm.\n\nVí dụ:\n- Tạo 10 câu hỏi về địa lý Việt Nam\n- Tạo câu hỏi trắc nghiệm về văn học Việt Nam thế kỷ 20\n- Tạo trò chơi trắc nghiệm về động vật hoang dã';
      
      case 'flashcards':
        return 'Nhập yêu cầu để AI tạo thẻ ghi nhớ.\n\nVí dụ:\n- Tạo flashcard về từ vựng tiếng Anh chủ đề du lịch\n- Tạo thẻ ghi nhớ cho các công thức toán học\n- Tạo thẻ học các ngày lễ quan trọng trong năm';
      
      case 'matching':
        return 'Nhập yêu cầu để AI tạo trò chơi nối từ.\n\nVí dụ:\n- Tạo trò chơi nối từ đồng nghĩa tiếng Việt\n- Tạo game nối từ tiếng Anh-Việt về đồ vật trong nhà\n- Tạo game ghép cặp nước-thủ đô';
      
      case 'truefalse':
        return 'Nhập yêu cầu để AI tạo câu hỏi đúng/sai.\n\nVí dụ:\n- Tạo câu hỏi đúng sai về lịch sử Việt Nam\n- Tạo câu đúng sai về kiến thức khoa học tự nhiên\n- Tạo game đúng sai về tin học cơ bản';
      
      case 'wordsearch':
        return 'Nhập yêu cầu để AI tạo trò chơi tìm từ.\n\nVí dụ:\n- Tạo game tìm từ về các loài động vật\n- Tạo trò chơi tìm từ tiếng Anh chủ đề thể thao\n- Tạo game tìm từ về tên các loại trái cây';
      
      case 'ordering':
        return 'Nhập yêu cầu để AI tạo trò chơi sắp xếp câu.\n\nVí dụ:\n- Tạo trò chơi sắp xếp từ thành câu tiếng Việt\n- Tạo game sắp xếp các sự kiện lịch sử theo thời gian\n- Tạo game sắp xếp các bước trong quy trình nấu ăn';
      
      case 'memory':
        return 'Nhập yêu cầu để AI tạo trò chơi ghi nhớ.\n\nVí dụ:\n- Tạo trò chơi ghi nhớ với các biểu tượng động vật\n- Tạo game memory card với chủ đề phương tiện giao thông\n- Tạo game ghi nhớ về các loại hoa';
      
      case 'pictionary':
        return 'Nhập yêu cầu để AI tạo trò chơi đoán hình.\n\nVí dụ:\n- Tạo trò chơi đoán hình về các danh lam thắng cảnh\n- Tạo game pictionary về các loài động vật\n- Tạo trò chơi đoán hình về đồ vật hàng ngày';
      
      default:
        return 'Nhập yêu cầu để AI tạo nội dung cho trò chơi của bạn.';
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
    onGenerate(content, difficulty);
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Tạo trò chơi {getGameTypeName()} với AI
          </h2>
          <p className="text-muted-foreground">Nhập yêu cầu để AI tạo nội dung cho trò chơi của bạn</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="difficulty">Độ khó</Label>
            <Select 
              value={difficulty} 
              onValueChange={handleDifficultyChange}
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
            <p className="text-xs text-muted-foreground mt-1">
              Nhập yêu cầu chi tiết để AI tạo nội dung trò chơi theo ý bạn.
            </p>
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
              className="bg-primary"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Tạo trò chơi
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
