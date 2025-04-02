
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, Star, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockType } from '@/lib/block-utils';
import { useNavigate } from 'react-router-dom';
import OpenAIKeyModal from '@/components/quiz/OpenAIKeyModal';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCreateBlock?: (type: BlockType, content: string) => void;
  onQuizRequest?: (topic: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onCreateBlock, 
  onQuizRequest
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
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage = { role: 'user' as const, message: message.trim(), timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    setTimeout(() => {
      let aiResponse = "Tôi đang tạo trò chơi học tập tương tác theo yêu cầu của bạn. Vui lòng đợi trong giây lát...";
      
      // Sử dụng toàn bộ nội dung tin nhắn làm chủ đề
      const topic = message.trim();
      
      const aiMessage = {
        role: 'ai' as const, 
        message: aiResponse,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Directly navigate to quiz page with the topic (skip settings)
      if (window.location.pathname.includes('/quiz')) {
        // We're already on the quiz page, just notify the parent
        if (onQuizRequest) {
          onQuizRequest(topic);
        }
      } else {
        // Navigate to quiz page with the topic
        navigate(`/quiz?topic=${encodeURIComponent(topic)}&autostart=true`);
      }
    }, 500);
  };

  const handleSaveOpenAIKey = (key: string) => {
    if (key) {
      localStorage.setItem('openai_api_key', key);
      toast({
        title: "API Key Đã Lưu",
        description: "OpenAI API key của bạn đã được lưu thành công.",
      });
    }
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
    <div className="flex flex-col h-full w-full">
      {/* Header - Fixed height */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-secondary/20 shrink-0">
        <div className="flex items-center">
          <GraduationCap size={20} className="text-primary mr-2" />
          <h3 className="font-medium">Trợ Lý Giáo Dục</h3>
        </div>
      </div>
      
      {/* Messages area - Flexible height */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
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
      </div>
      
      {/* Input area - Fixed height */}
      <div className="p-3 border-t border-border bg-background shrink-0">
        <div className="relative">
          <Textarea
            className="w-full p-2 pr-10 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm min-h-[70px]"
            placeholder="Nhập chủ đề học tập để tạo trò chơi tương tác giáo dục..."
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
          <div className="flex items-center">
            <button 
              className="p-1 rounded-full hover:bg-secondary/70 transition-colors"
              onClick={() => setShowOpenAIKeyModal(true)}
            >
              <Star size={16} className="text-primary" />
            </button>
          </div>
          <div className="text-xs text-muted-foreground italic">
            Powered by Giáo Dục AI
          </div>
        </div>
      </div>

      <OpenAIKeyModal 
        isOpen={showOpenAIKeyModal}
        onClose={() => setShowOpenAIKeyModal(false)}
        onSave={handleSaveOpenAIKey}
        currentKey={localStorage.getItem('openai_api_key')}
      />
    </div>
  );
};

export default ChatInterface;
