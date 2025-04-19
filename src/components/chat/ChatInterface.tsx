import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, Star, GraduationCap, History, BookmarkCheck, PenTool, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockType } from '@/lib/block-utils';
import { useNavigate } from 'react-router-dom';
import HistoryPanel from '@/components/history/HistoryPanel';
import { Switch } from '@/components/ui/switch';
import { AIGameGenerator } from '@/components/quiz/generator/geminiGenerator';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCreateBlock?: (type: BlockType, content: string) => void;
  onQuizRequest?: (topic: string) => void;
  onToggleSidebar?: () => void;
  onCloseChatInterface?: () => void;
  isSidebarOpen?: boolean;
}

const API_KEY = 'AIzaSyB-X13dE3qKEURW8DxLmK56Vx3lZ1c8IfA';
const gameGenerator = AIGameGenerator.getInstance();

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onCreateBlock, 
  onQuizRequest, 
  onToggleSidebar,
  isSidebarOpen = true
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
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [canvasMode, setCanvasMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  useEffect(() => {
    localStorage.setItem('canvas_mode', 'true');
    gameGenerator.setCanvasMode(true);
  }, []);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage = { role: 'user' as const, message: message.trim(), timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    setTimeout(() => {
      let aiResponse = "Tôi đang tạo trò chơi học tập tương tác theo yêu cầu của bạn. Vui lòng đợi trong giây lát...";
      
      if (canvasMode) {
        aiResponse += " (Chế độ Canvas đã bật!)";
      }
      
      gameGenerator.setCanvasMode(canvasMode);
      
      const topic = message.trim();
      
      const aiMessage = {
        role: 'ai' as const, 
        message: aiResponse,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      if (window.location.pathname.includes('/quiz')) {
        if (onQuizRequest) {
          onQuizRequest(topic);
        }
      } else {
        navigate(`/quiz?topic=${encodeURIComponent(topic)}&autostart=true&canvas=${canvasMode}`);
      }
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

  const handleToggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  const handleGameSelect = (game: any) => {
    if (window.location.pathname.includes('/quiz')) {
      navigate(`/quiz/shared/${game.id}`);
    }
  };
  
  const toggleCanvasMode = () => {
    setCanvasMode(true);
    gameGenerator.setCanvasMode(true);
    
    toast({
      title: `Chế độ Canvas luôn BẬT`,
      description: "Trò chơi sẽ được tạo với đồ họa canvas nâng cao.",
      duration: 3000,
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center">
          <GraduationCap size={20} className="text-primary mr-2" />
          <h3 className="font-medium">Trợ Lý Giáo Dục</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryPanel(true)}
            className="p-1.5 rounded-md hover:bg-secondary/40 transition-colors"
            title="Lịch sử game"
          >
            <History size={18} className="text-primary" />
          </button>
          <button
            onClick={handleToggleSidebar}
            className="p-1.5 rounded-md hover:bg-secondary/40 transition-colors"
            title={isSidebarOpen ? "Thu gọn" : "Mở rộng"}
          >
            {isSidebarOpen ? (
              <BookmarkCheck size={18} className="text-primary" />
            ) : (
              <BookmarkCheck size={18} className="text-primary/50" />
            )}
          </button>
        </div>
      </div>
      
      <div className="p-2 border-b border-border flex items-center justify-between bg-secondary/5">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-primary" />
          <span className="text-sm">Chế độ Canvas</span>
        </div>
        <Switch 
          checked={true}
          onCheckedChange={toggleCanvasMode}
          className="data-[state=checked]:bg-primary"
          disabled={true}
        />
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
            Powered by CES AI
          </div>
        </div>
      </div>

      <HistoryPanel 
        isOpen={showHistoryPanel}
        onClose={() => setShowHistoryPanel(false)}
        onSelectGame={handleGameSelect}
      />
    </div>
  );
};

export default ChatInterface;
