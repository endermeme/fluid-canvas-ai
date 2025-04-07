
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PuzzlePiece, BrainCircuit, Lightbulb, Dices, BookText, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { GamePresetType, PresetGameConfig } from './types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { gamePresets } from './gamePresetData';

const GamePresets = () => {
  const [selectedPreset, setSelectedPreset] = useState<GamePresetType | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePresetSelect = (preset: GamePresetType) => {
    setSelectedPreset(preset);
    setIsDialogOpen(true);
  };

  const handleGenerateGame = async () => {
    if (!selectedPreset) return;
    
    setIsProcessing(true);
    
    try {
      // Encode the game parameters for the URL
      const params = new URLSearchParams({
        preset: selectedPreset.id,
        content: customInput,
        autostart: 'true'
      });
      
      toast({
        title: "Đang tạo trò chơi",
        description: `Đang chuẩn bị ${selectedPreset.name}...`,
      });
      
      // Navigate to the quiz page with the preset parameters
      navigate(`/quiz?${params.toString()}`);
    } catch (error) {
      console.error("Error generating game:", error);
      toast({
        title: "Lỗi tạo trò chơi",
        description: "Không thể tạo trò chơi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'puzzle-piece': return <PuzzlePiece className="h-6 w-6" />;
      case 'brain-circuit': return <BrainCircuit className="h-6 w-6" />;
      case 'lightbulb': return <Lightbulb className="h-6 w-6" />;
      case 'dices': return <Dices className="h-6 w-6" />;
      case 'book-text': return <BookText className="h-6 w-6" />;
      default: return <MessageSquare className="h-6 w-6" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Game Presets</h1>
        <p className="text-muted-foreground">
          Chọn mẫu trò chơi và tạo nội dung của riêng bạn với AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamePresets.map((preset) => (
          <Card key={preset.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                {getPresetIcon(preset.icon)}
              </div>
              <CardTitle>{preset.name}</CardTitle>
              <CardDescription>{preset.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm">{preset.description}</p>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mt-2">
                  {preset.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePresetSelect(preset)}
              >
                Sử dụng Mẫu Này
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedPreset?.name || 'Customize Game'}</DialogTitle>
            <DialogDescription>
              {selectedPreset?.customizeInstruction || 'Enter your content for the game'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customInput">Nội dung của bạn</Label>
              <Textarea
                id="customInput"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={selectedPreset?.inputPlaceholder || "Nhập nội dung của bạn tại đây..."}
                className="h-40"
              />
              <p className="text-xs text-muted-foreground">
                {selectedPreset?.inputHelper || "AI sẽ tự động chuyển đổi nội dung của bạn thành câu hỏi game."}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button 
              onClick={handleGenerateGame} 
              disabled={customInput.trim().length < 5 || isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Tạo Game"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamePresets;
