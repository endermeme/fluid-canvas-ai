
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, BrainCircuit, Image, FileText, Code } from 'lucide-react';
import { animateAIPanelSlideIn, animateAIPanelSlideOut } from '@/lib/animations';
import { Block, BlockType } from '@/lib/block-utils';
import { Switch } from '@/components/ui/switch';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertContent: (content: string, type: 'text' | 'code' | 'image') => void;
}

const AIPanel: React.FC<AIPanelProps> = ({
  isOpen,
  onClose,
  onInsertContent,
}) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([
    { role: 'ai', message: 'Hi there! I\'m your AI assistant. How can I help with your canvas today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedMode, setEnhancedMode] = useState(localStorage.getItem('ai_enhanced_mode') === 'true');
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Apply slide animations
  useEffect(() => {
    if (panelRef.current) {
      if (isOpen) {
        animateAIPanelSlideIn(panelRef.current);
      } else {
        animateAIPanelSlideOut(panelRef.current);
      }
    }
  }, [isOpen]);
  
  // Scroll to bottom when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Save enhanced mode setting
  useEffect(() => {
    localStorage.setItem('ai_enhanced_mode', enhancedMode.toString());
  }, [enhancedMode]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    setConversation([...conversation, { role: 'user', message }]);
    
    // Simulate AI response (this would be replaced with actual AI service call)
    setIsLoading(true);
    
    // Clear input field
    setMessage('');
    
    // Check if the message is a creation request
    const lowerMessage = message.toLowerCase().trim();
    const isCreationRequest = 
      lowerMessage.includes('create') || 
      lowerMessage.includes('add') || 
      lowerMessage.includes('make') ||
      lowerMessage.includes('generate');
    
    // Simulate response delay
    setTimeout(() => {
      let aiResponse;
      
      if (isCreationRequest) {
        // Determine what type of content to insert based on the message
        let contentType: 'text' | 'code' | 'image' = 'text';
        let content = '';
        
        if (lowerMessage.includes('code') || lowerMessage.includes('script')) {
          contentType = 'code';
          content = `// Generated from: "${message}"\n\nfunction example() {\n  console.log("Hello from AI!");\n}`;
          aiResponse = `I've created a code block based on your request.${enhancedMode ? ' Using enhanced mode for better quality.' : ''}`;
        } else if (lowerMessage.includes('image') || lowerMessage.includes('picture')) {
          contentType = 'image';
          content = 'https://source.unsplash.com/random/300x200';
          aiResponse = `I've added an image for you.${enhancedMode ? ' Using enhanced mode for better quality.' : ''}`;
        } else {
          contentType = 'text';
          content = `Content generated from: "${message}"`;
          aiResponse = `I've created a text block for you.${enhancedMode ? ' Using enhanced mode for better quality.' : ''}`;
        }
        
        // Insert the content into the canvas
        onInsertContent(content, contentType);
      } else {
        const responses = [
          "I've analyzed your canvas. Would you like me to suggest connections between your ideas?",
          "Based on your content, you might want to consider adding a section about implementation details.",
          "Your diagram looks great! I can help generate content for any of these blocks if you'd like.",
          "I notice you're working on a flow chart. Would you like me to suggest any missing steps?",
          "I can generate a code snippet based on the concepts you've outlined. Would that be helpful?",
        ];
        
        aiResponse = responses[Math.floor(Math.random() * responses.length)];
        if (enhancedMode) {
          aiResponse += " (Enhanced mode is active for better responses)";
        }
      }
      
      setConversation(prev => [
        ...prev, 
        { 
          role: 'ai', 
          message: aiResponse
        }
      ]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Message bubble styles based on role
  const getMessageStyles = (role: 'user' | 'ai') => {
    return role === 'user' 
      ? 'bg-primary/10 ml-12 rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
      : 'bg-secondary/70 mr-12 rounded-tl-lg rounded-tr-lg rounded-br-lg';
  };
  
  // Toggle enhanced mode
  const toggleEnhancedMode = () => {
    setEnhancedMode(!enhancedMode);
  };
  
  // Create quick insert buttons for blocks
  const renderQuickInsertButtons = () => (
    <div className="grid grid-cols-3 gap-2 mt-3">
      <button 
        className="p-2 bg-secondary/50 hover:bg-secondary rounded text-xs flex flex-col items-center"
        onClick={() => onInsertContent("Add your text here...", 'text')}
      >
        <FileText size={16} className="mb-1" />
        Text
      </button>
      <button 
        className="p-2 bg-secondary/50 hover:bg-secondary rounded text-xs flex flex-col items-center"
        onClick={() => onInsertContent("console.log('Hello World');", 'code')}
      >
        <Code size={16} className="mb-1" />
        Code
      </button>
      <button 
        className="p-2 bg-secondary/50 hover:bg-secondary rounded text-xs flex flex-col items-center"
        onClick={() => onInsertContent("https://source.unsplash.com/random/400x300", 'image')}
      >
        <Image size={16} className="mb-1" />
        Image
      </button>
    </div>
  );
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={panelRef}
      className="fixed top-0 right-0 bottom-0 w-80 glass-panel z-40 flex flex-col overflow-hidden"
    >
      {/* Panel header */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center">
          <BrainCircuit size={20} className="text-primary mr-2" />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <button 
          className="p-1 rounded-full hover:bg-secondary/70 transition-colors"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Enhanced mode toggle */}
      <div className="p-2 border-b border-border flex items-center justify-between bg-secondary/5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm">Enhanced Mode</span>
        </div>
        <Switch 
          checked={enhancedMode}
          onCheckedChange={toggleEnhancedMode}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      
      {/* Quick insert buttons */}
      <div className="p-2 border-b border-border">
        <div className="text-xs text-muted-foreground mb-1">Quick Insert</div>
        {renderQuickInsertButtons()}
      </div>
      
      {/* Conversation area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {conversation.map((item, index) => (
          <div key={index} className={`p-3 ${getMessageStyles(item.role)}`}>
            <p className="text-sm whitespace-pre-wrap">{item.message}</p>
          </div>
        ))}
        
        {isLoading && (
          <div className="p-3 bg-secondary/70 mr-12 rounded-tl-lg rounded-tr-lg rounded-br-lg flex items-center">
            <div className="typing-indicator">
              <span style={{ '--dot-index': '0' } as React.CSSProperties}></span>
              <span style={{ '--dot-index': '1' } as React.CSSProperties}></span>
              <span style={{ '--dot-index': '2' } as React.CSSProperties}></span>
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
      </div>
    </div>
  );
};

export default AIPanel;
