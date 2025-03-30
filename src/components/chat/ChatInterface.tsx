
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockType } from '@/lib/block-utils';
import { GameOptions } from '@/components/quiz/GameOptionsSelector';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCreateBlock?: (type: BlockType, content: string) => void;
  onQuizRequest?: (topic: string, options?: GameOptions) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCreateBlock, onQuizRequest }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    { 
      role: 'ai', 
      message: 'Xin chào! Tôi là trợ lý AI. Hãy nhập chủ đề bạn muốn, tôi sẽ tạo trò chơi xếp hình tương tác với chủ đề của bạn. Ví dụ: "Thành phố Hà Nội", "Động vật hoang dã", "Vũ trụ kỳ diệu"...', 
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom of messages whenever conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage = { role: 'user' as const, message: message.trim(), timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    
    const topic = message.trim();
    setMessage('');
    setIsLoading(true);
    
    // Create AI response immediately to improve UX
    const aiResponseMessage = { 
      role: 'ai' as const, 
      message: "Đang tạo trò chơi xếp hình tương tác với chủ đề của bạn. Xin vui lòng đợi trong giây lát...",
      timestamp: new Date()
    };
    setConversation(prev => [...prev, aiResponseMessage]);
    
    // Use a small timeout to ensure the UI updates before potentially heavy processing
    setTimeout(() => {
      if (onQuizRequest) {
        try {
          // Pass topic to parent component to generate quiz with Gemini
          console.log("Chuyển chủ đề để tạo trò chơi:", topic);
          
          // Create default options to ensure the game is created with proper parameters
          const options: GameOptions = {
            contentType: 'entertainment',
            difficulty: 'medium',
            ageGroup: 'all',
            customContent: '',
            customFile: null,
            questionCount: 5,
            timePerQuestion: 30
          };
          
          onQuizRequest(topic, options);
        } catch (error) {
          console.error("Lỗi khi tạo trò chơi:", error);
          
          // Update the last AI message to show the error
          setConversation(prev => [
            ...prev.slice(0, -1), 
            { 
              role: 'ai', 
              message: "Có lỗi xảy ra khi tạo trò chơi. Vui lòng thử lại với chủ đề khác.", 
              timestamp: new Date() 
            }
          ]);
          
          toast({
            title: "Lỗi",
            description: "Không thể tạo trò chơi với chủ đề này. Vui lòng thử lại.",
            variant: "destructive",
          });
        }
      } else {
        // If no quiz request handler is provided
        setConversation(prev => [
          ...prev.slice(0, -1), 
          { 
            role: 'ai', 
            message: "Không thể kết nối với trình tạo trò chơi. Vui lòng tải lại trang và thử lại.", 
            timestamp: new Date() 
          }
        ]);
      }
      
      setIsLoading(false);
    }, 100);
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
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between bg-secondary/20">
        <div className="flex items-center">
          <Image size={20} className="text-primary mr-2" />
          <h3 className="font-medium">Trợ Lý Xếp Hình</h3>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Sparkles size={12} className="mr-1 text-primary" />
          <span>Gemini AI</span>
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
                <p className="text-sm">{item.message}</p>
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
            placeholder="Nhập chủ đề cho trò chơi xếp hình (ví dụ: biển xanh, núi rừng, vũ trụ...)"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={`absolute right-2 bottom-2 p-1.5 rounded-full transition-colors ${
              !message.trim() || isLoading 
                ? 'text-muted-foreground' 
                : 'text-primary hover:bg-primary/10'
            }`}
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
          >
            <Send size={16} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <button className="p-1 rounded-full hover:bg-secondary/70 transition-colors">
              <Sparkles size={16} className="text-primary" />
            </button>
          </div>
          <div className="text-xs text-muted-foreground italic flex items-center">
            <BrainCircuit size={12} className="mr-1" />
            Powered by Gemini AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
