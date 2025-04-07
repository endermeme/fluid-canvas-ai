
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gamePresetTemplates } from './gamePresetData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';

interface GamePresetsProps {
  onSelectPreset: (presetId: string, content: string) => void;
  onCancel: () => void;
}

const GamePresets: React.FC<GamePresetsProps> = ({ onSelectPreset, onCancel }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [customContent, setCustomContent] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const selectedPreset = selectedPresetId 
    ? gamePresetTemplates.find(preset => preset.id === selectedPresetId) 
    : null;

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    setCustomContent('');
  };

  const handleBack = () => {
    setSelectedPresetId(null);
    setCustomContent('');
  };

  const handleSubmit = () => {
    if (!selectedPresetId) return;
    
    if (!customContent.trim()) {
      toast({
        title: "Nội dung trống",
        description: "Vui lòng nhập nội dung cho trò chơi",
        variant: "destructive",
      });
      return;
    }
    
    onSelectPreset(selectedPresetId, customContent.trim());
  };

  const handleQuickChat = () => {
    navigate('/quiz');
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-6 bg-background/80">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Trợ Lý Tạo Trò Chơi Giáo Dục
          </h1>
          <p className="text-muted-foreground">
            Chọn mẫu trò chơi và nhập nội dung tùy chỉnh để AI tạo trò chơi tương tác
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!selectedPresetId ? (
            <motion.div
              key="preset-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {gamePresetTemplates.map((preset) => (
                <Card 
                  key={preset.id} 
                  className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                  onClick={() => handlePresetSelect(preset.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        {React.createElement(preset.icon, { size: 20 })}
                      </div>
                      <CardTitle className="text-lg">{preset.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{preset.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    {preset.questionCount} câu hỏi | {preset.timePerQuestion}s
                  </CardFooter>
                </Card>
              ))}

              <Card 
                className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-center items-center bg-gradient-to-b from-background to-secondary/5"
                onClick={handleQuickChat}
              >
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center h-full">
                  <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                    <MessageCircle size={24} />
                  </div>
                  <CardTitle className="text-lg mb-2">Chat Tùy Chỉnh</CardTitle>
                  <CardDescription className="text-center">
                    Tạo trò chơi bằng cách chat trực tiếp với AI
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={handleBack}
              >
                <ArrowLeft size={16} className="mr-2" /> Quay lại
              </Button>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {selectedPreset && React.createElement(selectedPreset.icon, { size: 20, className: "text-primary" })}
                    <CardTitle>
                      {selectedPreset?.name || "Mẫu trò chơi"}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {selectedPreset?.description || ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="content">Nội dung trò chơi</Label>
                      <Textarea
                        id="content"
                        placeholder="Nhập nội dung chi tiết cho trò chơi..."
                        value={customContent}
                        onChange={(e) => setCustomContent(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Ví dụ: Các câu hỏi về lịch sử Việt Nam thời kỳ đổi mới...
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Hủy
                  </Button>
                  <Button 
                    className="bg-primary"
                    onClick={handleSubmit}
                    disabled={!customContent.trim()}
                  >
                    <Send size={16} className="mr-2" /> Tạo trò chơi
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamePresets;
