
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SparklesIcon, Brain, Lightbulb, Bookmark, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomGameFormProps {
  onGenerate: (content: string) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameType, setGameType] = useState('quiz');
  const { toast } = useToast();

  const gameTypes = [
    { id: 'quiz', name: 'Trắc Nghiệm', description: 'Câu hỏi nhiều lựa chọn' },
    { id: 'flashcards', name: 'Thẻ Ghi Nhớ', description: 'Thẻ học từ vựng, định nghĩa' },
    { id: 'matching', name: 'Nối Từ', description: 'Ghép nối các cặp từ có liên quan' },
    { id: 'memory', name: 'Trò Chơi Ghi Nhớ', description: 'Lật và ghép các thẻ giống nhau' },
    { id: 'ordering', name: 'Sắp Xếp Câu', description: 'Sắp xếp các phần tử theo thứ tự đúng' },
    { id: 'wordsearch', name: 'Tìm Từ', description: 'Tìm từ ẩn trong lưới chữ cái' },
    { id: 'truefalse', name: 'Đúng hay Sai', description: 'Phán đoán đúng sai về các phát biểu' }
  ];

  const getPlaceholderText = () => {
    switch (gameType) {
      case 'quiz':
        return 'Nhập yêu cầu để AI tạo câu hỏi trắc nghiệm.\n\nVí dụ: "Tạo 10 câu hỏi trắc nghiệm về lịch sử Việt Nam thời kỳ phong kiến, mỗi câu có 4 lựa chọn."';
      case 'flashcards':
        return 'Nhập yêu cầu để AI tạo thẻ ghi nhớ.\n\nVí dụ: "Tạo 15 thẻ ghi nhớ từ vựng tiếng Anh về chủ đề công nghệ, mỗi thẻ có từ tiếng Anh, nghĩa tiếng Việt và ví dụ."';
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
        description: `Trò chơi ${gameTypes.find(g => g.id === gameType)?.name || ""} đã được tạo thành công với AI.`,
      });
    }, 2000);
  };

  const renderGameTypeOptions = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {gameTypes.map((type) => (
          <div 
            key={type.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50 ${gameType === type.id ? 'border-primary bg-primary/10' : 'border-border'}`}
            onClick={() => setGameType(type.id)}
          >
            <div className="flex items-center gap-2 font-medium">
              <GraduationCap className="h-5 w-5 text-primary" />
              {type.name}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Tạo Trò Chơi Với AI</h2>
            </div>
          </div>

          <Tabs defaultValue="type" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="type">Loại Trò Chơi</TabsTrigger>
              <TabsTrigger value="content">Nội Dung</TabsTrigger>
            </TabsList>

            <TabsContent value="type" className="space-y-4">
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  Chọn Loại Trò Chơi
                </Label>
                {renderGameTypeOptions()}
              </div>
              
              <div className="mt-6">
                <Label htmlFor="difficulty" className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Độ Khó
                </Label>
                <Select 
                  value={difficulty} 
                  onValueChange={setDifficulty}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Chọn độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="content" className="text-base font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Yêu Cầu Nội Dung
                </Label>
                <div className="mt-2 bg-muted/50 p-3 rounded-md mb-3">
                  <p className="text-sm text-muted-foreground">
                    <strong>Mẹo:</strong> Mô tả chi tiết nội dung bạn muốn và cung cấp ví dụ cụ thể sẽ giúp AI tạo trò chơi chất lượng hơn.
                  </p>
                </div>
                <Textarea
                  id="content"
                  placeholder={getPlaceholderText()}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="font-mono text-sm resize-y"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-6 mt-6 border-t">
            <Button 
              variant="outline" 
              onClick={onCancel}
            >
              Huỷ
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isGenerating || !content.trim()}
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
                  Tạo với AI
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomGameForm;
