
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SparklesIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface CustomGameFormProps {
  onGenerate: (content: string) => void;
  onCancel: () => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ onGenerate, onCancel }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameType, setGameType] = useState('quiz');
  const [difficulty, setDifficulty] = useState('medium');
  const { toast } = useToast();

  const gameTypes = [
    { id: 'quiz', name: 'Trắc Nghiệm' },
    { id: 'flashcards', name: 'Thẻ Ghi Nhớ' },
    { id: 'matching', name: 'Nối Từ' },
    { id: 'memory', name: 'Trò Chơi Ghi Nhớ' },
    { id: 'ordering', name: 'Sắp Xếp Câu' },
    { id: 'wordsearch', name: 'Tìm Từ' },
    { id: 'pictionary', name: 'Đoán Hình' },
    { id: 'truefalse', name: 'Đúng hay Sai' },
  ];

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập yêu cầu nội dung cho trò chơi",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const generationConfig = {
        temperature: 0.7,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 8000,
      };
      
      const selectedGame = gameTypes.find(game => game.id === gameType);
      
      const gamePrompt = `Tạo nội dung cho trò chơi ${selectedGame?.name} với yêu cầu: ${prompt}. 
      Độ khó: ${difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}.
      Hãy tạo nội dung phù hợp với loại trò chơi và độ khó đã chọn.`;
      
      console.log("Sending prompt to Gemini:", gamePrompt);
      
      const result = await model.generateContent(gamePrompt);
      const response = await result.response;
      const text = response.text();
      
      onGenerate(text);
      
      toast({
        title: "Đã tạo trò chơi",
        description: `Trò chơi ${selectedGame?.name} đã được tạo thành công với AI.`,
      });
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        title: "Lỗi AI",
        description: "Không thể tạo nội dung. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-primary" />
            Tạo trò chơi với AI
          </h2>
          <p className="text-muted-foreground">Mô tả yêu cầu của bạn để AI tạo nội dung trò chơi phù hợp</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="gameType">Loại trò chơi</Label>
            <Select 
              value={gameType} 
              onValueChange={setGameType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại trò chơi" />
              </SelectTrigger>
              <SelectContent>
                {gameTypes.map(game => (
                  <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="prompt">Yêu cầu nội dung</Label>
            <Textarea
              id="prompt"
              placeholder="Nhập yêu cầu chi tiết để AI tạo nội dung trò chơi. Ví dụ: Tạo 10 câu hỏi trắc nghiệm về lịch sử Việt Nam thời kỳ phong kiến, mỗi câu có 4 lựa chọn."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
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
