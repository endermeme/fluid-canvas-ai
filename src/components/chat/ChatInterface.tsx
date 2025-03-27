
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    { 
      role: 'ai', 
      message: 'Hi there! I\'m your AI assistant. How can I help with your canvas today?', 
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage = { role: 'user' as const, message: message.trim(), timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    
    // Clear input field
    setMessage('');
    
    // Simulate AI response
    setIsLoading(true);
    
    // Simulate response delay
    setTimeout(() => {
      const responses = [
        "I've analyzed your canvas. Would you like me to suggest connections between your ideas?",
        "Based on your content, you might want to consider adding a section about implementation details.",
        "Your diagram looks great! I can help generate content for any of these blocks if you'd like.",
        "I notice you're working on a flow chart. Would you like me to suggest any missing steps?",
        "I can generate a code snippet based on the concepts you've outlined. Would that be helpful?",
      ];
      
      const aiMessage = {
        role: 'ai' as const, 
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Show a toast notification for new message
      toast({
        title: "New Message",
        description: "The AI assistant has responded to your query.",
        duration: 3000,
      });
    }, 1500);
  };
  
  // Handle enter key to send message
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
      {/* Chat header */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-secondary/20">
        <div className="flex items-center">
          <BrainCircuit size={20} className="text-primary mr-2" />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
      </div>
      
      {/* Conversation area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
      
      {/* Message input */}
      <div className="p-3 border-t border-border">
        <div className="relative">
          <textarea
            className="w-full p-2 pr-10 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm"
            placeholder="Ask the AI assistant..."
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
          <div className="flex items-center">
            <button className="p-1 rounded-full hover:bg-secondary/70 transition-colors">
              <Sparkles size={16} className="text-primary" />
            </button>
          </div>
          <div className="text-xs text-muted-foreground italic">
            Powered by CES AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
