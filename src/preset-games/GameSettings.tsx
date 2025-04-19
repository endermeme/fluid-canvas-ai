
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { GameSettingsData, GameType } from '../types/game';
import { GraduationCap, Play } from 'lucide-react';

interface GameSettingsProps {
  topic: string;
  onTopicChange?: (topic: string) => void;
  onStart: (settings: GameSettingsData) => void;
  initialSettings?: GameSettingsData;
  onCancel?: () => void;
  inModal?: boolean;
  gameType?: GameType | null;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  topic,
  onTopicChange,
  onStart,
  initialSettings,
  onCancel,
  inModal = false,
  gameType
}) => {
  const [difficulty, setDifficulty] = useState<string>(initialSettings?.difficulty || 'medium');
  const [questionCount, setQuestionCount] = useState<number>(initialSettings?.questionCount || 10);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(initialSettings?.timePerQuestion || 30);
  const [category, setCategory] = useState<string>(initialSettings?.category || 'general');
  
  useEffect(() => {
    if (initialSettings) {
      setDifficulty(initialSettings.difficulty || 'medium');
      setQuestionCount(initialSettings.questionCount || 10);
      setTimePerQuestion(initialSettings.timePerQuestion || 30);
      setCategory(initialSettings.category || 'general');
    }
  }, [initialSettings]);

  const handleStart = () => {
    onStart({
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      questionCount,
      timePerQuestion,
      category,
      prompt: topic
    });
  };

  const renderContent = () => (
    <div className="space-y-6">
      {onTopicChange && (
        <div className="space-y-2">
          <Label htmlFor="topic">Chủ đề</Label>
          <Input
            id="topic"
            placeholder="Nhập chủ đề (VD: Lịch sử Việt Nam)"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Độ khó</Label>
          <Select
            value={difficulty}
            onValueChange={setDifficulty}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Chọn độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Dễ</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="hard">Khó</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Thể loại</Label>
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Chọn thể loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Tổng hợp</SelectItem>
              <SelectItem value="math">Toán học</SelectItem>
              <SelectItem value="science">Khoa học</SelectItem>
              <SelectItem value="history">Lịch sử</SelectItem>
              <SelectItem value="geography">Địa lý</SelectItem>
              <SelectItem value="language">Ngôn ngữ</SelectItem>
              <SelectItem value="arts">Nghệ thuật</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="questionCount">Số câu hỏi: {questionCount}</Label>
        <Slider
          id="questionCount"
          min={3}
          max={20}
          step={1}
          value={[questionCount]}
          onValueChange={(values) => setQuestionCount(values[0])}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timePerQuestion">Thời gian mỗi câu: {timePerQuestion} giây</Label>
        <Slider
          id="timePerQuestion"
          min={5}
          max={60}
          step={5}
          value={[timePerQuestion]}
          onValueChange={(values) => setTimePerQuestion(values[0])}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        
        <Button onClick={handleStart} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
          <Play className="h-4 w-4 mr-2" />
          Bắt đầu
        </Button>
      </div>
    </div>
  );

  if (inModal) {
    return renderContent();
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-background border-primary/20">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
          {gameType?.icon === 'graduation-cap' ? 
            <GraduationCap className="h-6 w-6 text-primary" /> : 
            <Play className="h-6 w-6 text-primary" />}
        </div>
        <div>
          <h2 className="text-xl font-bold">{gameType?.name || 'Tùy chỉnh trò chơi'}</h2>
          <p className="text-muted-foreground text-sm">{gameType?.description}</p>
        </div>
      </div>
      
      {renderContent()}
    </Card>
  );
};

export default GameSettings;
