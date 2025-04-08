
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SparklesIcon, Wand2Icon, GamepadIcon } from 'lucide-react';
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

  const difficultyLabels = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó'
  };

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
      Độ khó: ${difficultyLabels[difficulty as keyof typeof difficultyLabels]}.
      Hãy tạo nội dung phù hợp với loại trò chơi và độ khó đã chọn.
      Hãy định dạng kết quả để dễ đọc, sử dụng các tiêu đề và danh sách nếu cần.`;
      
      console.log("Sending prompt to Gemini:", gamePrompt);
      
      const result = await model.generateContent(gamePrompt);
      const response = await result.response;
      const text = response.text();
      
      onGenerate(text);
      
      toast({
        title: "Đã tạo trò chơi",
        description: `Trò chơi ${selectedGame?.name} đã được tạo thành công.`,
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

  const gameTypeIcons: Record<string, React.ReactNode> = {
    quiz: <GamepadIcon className="h-5 w-5 text-amber-500" />,
    flashcards: <GamepadIcon className="h-5 w-5 text-blue-500" />,
    matching: <GamepadIcon className="h-5 w-5 text-green-500" />,
    memory: <GamepadIcon className="h-5 w-5 text-purple-500" />,
    ordering: <GamepadIcon className="h-5 w-5 text-pink-500" />,
    wordsearch: <GamepadIcon className="h-5 w-5 text-orange-500" />,
    pictionary: <GamepadIcon className="h-5 w-5 text-teal-500" />,
    truefalse: <GamepadIcon className="h-5 w-5 text-red-500" />,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-6 shadow-lg border-primary/20 bg-background/80 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <SparklesIcon className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Tạo trò chơi với AI
          </h2>
          <p className="text-muted-foreground mt-2">
            Mô tả yêu cầu của bạn để AI tạo nội dung trò chơi phù hợp
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="gameType" className="text-base font-medium flex items-center gap-2">
                  {gameTypeIcons[gameType]} Loại trò chơi
                </Label>
                <Select 
                  value={gameType} 
                  onValueChange={setGameType}
                >
                  <SelectTrigger className="w-full mt-1 bg-background border-primary/20">
                    <SelectValue placeholder="Chọn loại trò chơi" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTypes.map(game => (
                      <SelectItem key={game.id} value={game.id} className="flex items-center">
                        <div className="flex items-center">
                          {gameTypeIcons[game.id]}
                          <span className="ml-2">{game.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="difficulty" className="text-base font-medium">Độ khó</Label>
                <Select 
                  value={difficulty} 
                  onValueChange={setDifficulty}
                >
                  <SelectTrigger className="w-full mt-1 bg-background border-primary/20">
                    <SelectValue placeholder="Chọn độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6 bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="font-medium text-primary flex items-center gap-2">
                <Wand2Icon className="h-4 w-4" /> Gợi ý nội dung
              </h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>• Xác định rõ chủ đề và phạm vi kiến thức</li>
                <li>• Chỉ định đối tượng người học (học sinh, sinh viên, ...)</li>
                <li>• Mô tả chi tiết yêu cầu về định dạng</li>
                <li>• Thêm ví dụ nếu có thể</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="text-base font-medium">Yêu cầu nội dung</Label>
              <Textarea
                id="prompt"
                placeholder="Nhập yêu cầu chi tiết để AI tạo nội dung trò chơi. Ví dụ: Tạo 10 câu hỏi trắc nghiệm về lịch sử Việt Nam thời kỳ phong kiến, mỗi câu có 4 lựa chọn."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={10}
                className="mt-1 w-full resize-none bg-background border-primary/20"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="border-primary/20"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isGenerating}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
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
        </div>
      </Card>
    </div>
  );
};

export default CustomGameForm;
