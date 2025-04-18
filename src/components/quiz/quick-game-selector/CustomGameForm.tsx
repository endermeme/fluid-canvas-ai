
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PenTool, MessageSquare, Zap } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CustomGameFormProps {
  onCustomGameCreate: () => void;
  onGameRequest: (topic: string) => void;
}

const CustomGameForm: React.FC<CustomGameFormProps> = ({ 
  onCustomGameCreate, 
  onGameRequest 
}) => {
  const [topic, setTopic] = useState('');
  const { toast } = useToast();
  
  const handleQuickCreate = () => {
    if (!topic.trim()) {
      toast({
        title: "Vui lòng nhập chủ đề",
        description: "Hãy nhập chủ đề cho trò chơi trước khi tạo.",
        variant: "destructive"
      });
      return;
    }
    
    onGameRequest(topic);
  };
  
  return (
    <div className="w-full max-w-2xl mb-6 px-4">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-5 shadow-sm">
        <div className="flex items-center space-x-4 mb-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <PenTool size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium">Tạo trò chơi tùy chỉnh</h3>
        </div>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Nhập chủ đề để tạo trò chơi tương tác..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full resize-none focus:ring-primary/30 h-20"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleQuickCreate}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/90"
            >
              <Zap size={16} className="text-white" />
              <span>Tạo ngay</span>
            </Button>
            
            <Button
              onClick={onCustomGameCreate}
              variant="outline"
              className="flex items-center gap-1.5 text-primary border-primary/30"
            >
              <MessageSquare size={16} />
              <span>Chat với AI</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomGameForm;
