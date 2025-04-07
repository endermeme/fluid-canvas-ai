
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GameSettingsData } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { tryContentGeneration } from '../generator/geminiGenerator';
import QuizTemplate from './templates/QuizTemplate';
import MatchingTemplate from './templates/MatchingTemplate';
import MemoryTemplate from './templates/MemoryTemplate';
import FlashcardsTemplate from './templates/FlashcardsTemplate';
import OrderingTemplate from './templates/OrderingTemplate';
import WordSearchTemplate from './templates/WordSearchTemplate';
import GameLoading from '../GameLoading';
import GameError from '../GameError';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Sparkles, Upload } from 'lucide-react';

// API Key
const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';

interface PresetGameManagerProps {
  gameType: string;
  initialTopic?: string;
  onBack: () => void;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({ 
  gameType, 
  initialTopic = '',
  onBack 
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameContent, setGameContent] = useState<any | null>(null);
  const [showInputDialog, setShowInputDialog] = useState(!initialTopic);
  const [customContent, setCustomContent] = useState('');
  const [activeTab, setActiveTab] = useState('topic');
  const { toast } = useToast();

  const getGameTitle = () => {
    switch(gameType) {
      case 'quiz': return 'Trắc Nghiệm';
      case 'matching': return 'Ghép Cặp';
      case 'memory': return 'Trò Chơi Ghi Nhớ';
      case 'flashcards': return 'Thẻ Học Tập';
      case 'ordering': return 'Sắp Xếp Thứ Tự';
      case 'wordsearch': return 'Tìm Từ';
      default: return 'Trò Chơi Học Tập';
    }
  };

  const handleSubmitTopic = async () => {
    if (!topic.trim()) {
      toast({
        title: "Chủ đề trống",
        description: "Vui lòng nhập chủ đề để tạo nội dung",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowInputDialog(false);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const content = await tryContentGeneration(
        model,
        topic,
        gameType,
        {
          difficulty: 'medium',
          questionCount: 10,
          timePerQuestion: 30,
          category: 'general'
        }
      );

      if (content) {
        setGameContent(content);
        toast({
          title: "Đã tạo nội dung thành công",
          description: `Nội dung ${getGameTitle()} về "${topic}" đã sẵn sàng`,
        });
      } else {
        throw new Error('Không thể tạo nội dung');
      }
    } catch (err) {
      console.error('Lỗi khi tạo nội dung:', err);
      setError('Không thể tạo nội dung. Vui lòng thử lại hoặc nhập nội dung tùy chỉnh.');
      toast({
        title: "Lỗi tạo nội dung",
        description: "Có lỗi xảy ra. Vui lòng thử lại hoặc sử dụng nội dung tùy chỉnh.",
        variant: "destructive"
      });
      setShowInputDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCustomContent = () => {
    try {
      // Try to parse the custom content as JSON
      const parsedContent = JSON.parse(customContent);
      setGameContent(parsedContent);
      setShowInputDialog(false);
      toast({
        title: "Đã áp dụng nội dung tùy chỉnh",
        description: "Nội dung tùy chỉnh của bạn đã được áp dụng vào trò chơi"
      });
    } catch (err) {
      toast({
        title: "Lỗi cú pháp JSON",
        description: "Nội dung tùy chỉnh không phải là JSON hợp lệ. Vui lòng kiểm tra lại.",
        variant: "destructive"
      });
    }
  };

  const renderGameTemplate = () => {
    if (!gameContent) return null;

    switch(gameType) {
      case 'quiz':
        return <QuizTemplate content={gameContent} topic={topic} />;
      case 'matching':
        return <MatchingTemplate content={gameContent} topic={topic} />;
      case 'memory':
        return <MemoryTemplate content={gameContent} topic={topic} />;
      case 'flashcards':
        return <FlashcardsTemplate content={gameContent} topic={topic} />;
      case 'ordering':
        return <OrderingTemplate content={gameContent} topic={topic} />;
      case 'wordsearch':
        return <WordSearchTemplate content={gameContent} topic={topic} />;
      default:
        return <div className="p-8 text-center">Game template not found</div>;
    }
  };

  const getCustomContentPlaceholder = () => {
    switch(gameType) {
      case 'quiz':
        return `[
  {
    "question": "Câu hỏi của bạn?",
    "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
    "correctAnswer": 0,
    "explanation": "Giải thích đáp án"
  },
  {
    "question": "Câu hỏi thứ hai?",
    "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
    "correctAnswer": 1,
    "explanation": "Giải thích đáp án"
  }
]`;
      case 'matching':
        return `[
  {
    "term": "Thuật ngữ 1",
    "definition": "Định nghĩa 1",
    "hint": "Gợi ý 1"
  },
  {
    "term": "Thuật ngữ 2",
    "definition": "Định nghĩa 2",
    "hint": "Gợi ý 2"
  }
]`;
      default:
        return '// Nhập nội dung JSON tương ứng với loại trò chơi';
    }
  };

  if (isLoading) {
    return <GameLoading topic={topic} />;
  }

  if (error && !showInputDialog) {
    return <GameError errorMessage={error} onRetry={() => setShowInputDialog(true)} topic={topic} />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4 flex justify-between items-center bg-background/80 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </Button>
        <h1 className="text-xl font-semibold">{getGameTitle()}: {topic || "Trò chơi mới"}</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowInputDialog(true)}
          className="flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Thay đổi nội dung</span>
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {gameContent ? renderGameTemplate() : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Chưa có nội dung</h2>
              <p className="text-gray-500 mb-4">Vui lòng nhập chủ đề hoặc nội dung tùy chỉnh để bắt đầu</p>
              <Button onClick={() => setShowInputDialog(true)}>
                Tạo nội dung
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showInputDialog} onOpenChange={setShowInputDialog}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tạo nội dung cho {getGameTitle()}</DialogTitle>
            <DialogDescription>
              Nhập chủ đề để AI tạo nội dung hoặc nhập nội dung tùy chỉnh của bạn
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="topic">Sử dụng AI</TabsTrigger>
              <TabsTrigger value="custom">Nội dung tùy chỉnh</TabsTrigger>
            </TabsList>
            
            <TabsContent value="topic" className="mt-4">
              <div className="space-y-4">
                <Input
                  placeholder="Nhập chủ đề (VD: Lịch sử Việt Nam, Toán học cơ bản...)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  AI sẽ tạo nội dung dựa trên chủ đề bạn cung cấp
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-4">
              <div className="space-y-4">
                <Textarea
                  placeholder={getCustomContentPlaceholder()}
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-sm text-gray-500">
                  Nhập nội dung tùy chỉnh theo định dạng JSON phù hợp với trò chơi
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInputDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={activeTab === 'topic' ? handleSubmitTopic : handleSubmitCustomContent}
              disabled={(activeTab === 'topic' && !topic.trim()) || (activeTab === 'custom' && !customContent.trim())}
            >
              {activeTab === 'topic' ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Tạo với AI
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Áp dụng
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PresetGameManager;
