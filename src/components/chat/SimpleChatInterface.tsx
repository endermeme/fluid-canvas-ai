
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

interface SimpleChatInterfaceProps {
  onQuizRequest: (topic: string) => void;
  onClose: () => void;
}

const SimpleChatInterface: React.FC<SimpleChatInterfaceProps> = ({ 
  onQuizRequest, 
  onClose
}) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    { 
      role: 'ai', 
      message: 'Xin chào! Tôi là trợ lý AI giáo dục. Hãy nhập chủ đề học tập bạn muốn, tôi sẽ tạo minigame tương tác theo yêu cầu của bạn. Bạn có thể yêu cầu các trò chơi toán học, từ vựng, lịch sử, khoa học, hoặc bất kỳ chủ đề giáo dục nào!', 
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasMode, setCanvasMode] = useState(localStorage.getItem('canvas_mode') === 'true');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  useEffect(() => {
    // Save canvas mode setting to localStorage
    localStorage.setItem('canvas_mode', canvasMode.toString());
  }, [canvasMode]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage = { role: 'user' as const, message: message.trim(), timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    setTimeout(() => {
      let aiResponse = "Tôi đang tạo trò chơi học tập tương tác theo yêu cầu của bạn. Vui lòng đợi trong giây lát...";
      
      const aiMessage = {
        role: 'ai' as const, 
        message: aiResponse,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Pass the topic to the parent component
      onQuizRequest(message.trim());
      onClose();
    }, 500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const toggleCanvasMode = () => {
    setCanvasMode(!canvasMode);
    toast({
      title: `Chế độ Canvas ${!canvasMode ? 'BẬT' : 'TẮT'}`,
      description: !canvasMode 
        ? "Trò chơi sẽ được tạo với đồ họa canvas nâng cao." 
        : "Trò chơi sẽ được tạo với HTML tiêu chuẩn.",
      duration: 3000,
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center">
          <Brain size={20} className="text-primary mr-2" />
          <h3 className="font-medium">Trợ Lý Giáo Dục</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Canvas</span>
            <Switch 
              checked={canvasMode}
              onCheckedChange={toggleCanvasMode}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {conversation.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`p-3 max-w-[85%] rounded-lg ${
                  item.role === 'user' 
                    ? 'bg-primary/10 rounded-tr-none' 
                    : 'bg-secondary/70 rounded-tl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{item.message}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatTime(item.timestamp)}
              </span>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start">
              <div className="p-3 bg-secondary/70 rounded-lg rounded-tl-none flex items-center">
                <div className="typing-indicator">
                  <span style={{ '--dot-index': '0' } as React.CSSProperties}></span>
                  <span style={{ '--dot-index': '1' } as React.CSSProperties}></span>
                  <span style={{ '--dot-index': '2' } as React.CSSProperties}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-border">
        <div className="relative">
          <textarea
            className="w-full p-2 pr-10 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm"
            placeholder="Nhập chủ đề học tập để tạo trò chơi tương tác giáo dục..."
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute right-2 bottom-2 p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send size={16} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {canvasMode && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Canvas
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground italic">
            Powered by Gemini AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatInterface;
