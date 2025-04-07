
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SparklesIcon, Brain, Wand } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomGameFormProps {
  gameType: string;
  onGenerate: (content: string) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ gameType, onGenerate, onCancel }) => {
  const [topic, setTopic] = useState('');
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
        return 'Nhập nội dung để tạo câu hỏi trắc nghiệm hoặc để trống để AI tự tạo theo chủ đề.\n\nVí dụ:\n1. Thủ đô của Việt Nam là gì?\na) Hà Nội\nb) TP.HCM\nc) Đà Nẵng\nd) Huế\n\n2. Việt Nam có bao nhiêu tỉnh thành?\na) 58\nb) 61\nc) 63\nd) 65';
      
      case 'flashcards':
        return 'Nhập nội dung để tạo thẻ ghi nhớ hoặc để trống để AI tự tạo theo chủ đề.\n\nVí dụ:\nMặt trước: Photosynthesis\nMặt sau: Quang hợp\n\nMặt trước: Democracy\nMặt sau: Dân chủ';
      
      case 'matching':
        return 'Nhập nội dung để tạo trò chơi nối từ hoặc để trống để AI tự tạo theo chủ đề.\n\nVí dụ:\nBên trái: Mèo\nBên phải: Cat\n\nBên trái: Chó\nBên phải: Dog';
      
      case 'truefalse':
        return 'Nhập nội dung để tạo câu hỏi đúng/sai hoặc để trống để AI tự tạo theo chủ đề.\n\nVí dụ:\nĐúng: Mặt trời mọc ở hướng đông.\nSai: Trái đất có hình vuông.';
      
      default:
        return 'Nhập nội dung để tạo trò chơi tùy chỉnh hoặc để trống để AI tự tạo theo chủ đề.';
    }
  };

  const handleSubmit = () => {
    if (!topic.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập chủ đề cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation request
    setTimeout(() => {
      onGenerate(content);
      setIsGenerating(false);
      
      toast({
        title: "Đã tạo trò chơi",
        description: `Trò chơi ${getGameTypeName()} về chủ đề "${topic}" đã được tạo thành công.`,
      });
    }, 2000);
  };

  const handleAIGenerate = () => {
    if (!topic.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập chủ đề cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation request
    setTimeout(() => {
      // AI would generate content here...
      setContent("AI đã tạo nội dung cho trò chơi. Bấm Tạo trò chơi để tiếp tục.");
      setIsGenerating(false);
      
      toast({
        title: "AI đã tạo nội dung",
        description: `Nội dung cho chủ đề "${topic}" đã được tạo. Bạn có thể chỉnh sửa trước khi tạo trò chơi.`,
      });
    }, 2000);
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Tạo trò chơi {getGameTypeName()} tùy chỉnh
          </h2>
          <p className="text-muted-foreground">Điền thông tin dưới đây để tạo trò chơi theo ý bạn, hoặc để AI tự động tạo nội dung</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Chủ đề</Label>
            <Input 
              id="topic" 
              placeholder="Nhập chủ đề của trò chơi, ví dụ: Lịch sử Việt Nam" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
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
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="content">Nội dung trò chơi</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAIGenerate}
                disabled={isGenerating}
              >
                <Wand className="h-4 w-4 mr-1" />
                AI tạo nội dung
              </Button>
            </div>
            <Textarea
              id="content"
              placeholder={getPlaceholderText()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
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
