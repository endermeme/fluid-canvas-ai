
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Brain } from 'lucide-react';

interface CustomGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
  setTopic: (topic: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const CustomGameDialog: React.FC<CustomGameDialogProps> = ({
  open,
  onOpenChange,
  topic,
  setTopic,
  onSubmit,
  isSubmitting
}) => {
  const [progress, setProgress] = useState(0);
  
  React.useEffect(() => {
    if (isSubmitting) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer);
            return prev;
          }
          return prev + 5;
        });
      }, 400);
      
      return () => {
        clearInterval(timer);
        setProgress(0);
      };
    }
  }, [isSubmitting]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            Tạo Minigame Tùy Chỉnh
          </DialogTitle>
        </DialogHeader>
        
        {isSubmitting ? (
          <div className="py-6 space-y-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="font-medium text-lg">Đang tạo minigame của bạn</h3>
              <p className="text-sm text-muted-foreground">
                Đang xử lý yêu cầu của bạn về chủ đề "{topic}"
              </p>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Đang thiết kế trò chơi</span>
                <span>{progress}%</span>
              </div>
            </div>
            
            <div className="mt-4 bg-primary/5 rounded-lg p-3 text-xs">
              <p className="text-muted-foreground">
                {progress < 30 ? "Đang phân tích chủ đề..." : 
                 progress < 60 ? "Đang thiết kế nội dung trò chơi..." : 
                 "Đang hoàn thiện giao diện trò chơi..."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Mô tả chi tiết trò chơi bạn muốn tạo..."
              className="min-h-[150px] text-base resize-none border-primary/20 bg-background/50 focus-visible:ring-primary/30"
              autoFocus
            />
            <div className="bg-primary/5 rounded-lg p-3 text-xs">
              <p className="text-muted-foreground">
                Hãy mô tả chi tiết về loại trò chơi, chủ đề, mức độ khó và những yêu cầu đặc biệt của bạn.
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
            disabled={isSubmitting}
          >
            Hủy Bỏ
          </Button>
          <Button 
            type="button" 
            onClick={onSubmit} 
            disabled={!topic.trim() || isSubmitting}
            className={`${isSubmitting ? "opacity-70" : ""} bg-gradient-to-r from-primary to-primary/80 hover:opacity-90`}
          >
            {isSubmitting ? "Đang Tạo..." : "Tạo Minigame"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomGameDialog;
