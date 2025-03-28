import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlockType } from '@/lib/block-utils';
import axios from 'axios';

interface Message {
  role: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCreateBlock?: (type: BlockType, content: string) => void;
  onQuizRequest?: (topic: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCreateBlock, onQuizRequest }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    { 
      role: 'ai', 
      message: 'Hi there! I\'m your AI assistant. How can I help with your quiz today?', 
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage = { role: 'user' as const, message: message.trim(), timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    const lowerMessage = message.toLowerCase().trim();
    
    // Check if this is a quiz request - improved detection
    const isQuizRequest = 
      lowerMessage.includes('quiz') || 
      lowerMessage.includes('test') || 
      lowerMessage.includes('questions') ||
      lowerMessage.includes('trivia') ||
      lowerMessage.includes('trắc nghiệm') ||
      lowerMessage.includes('câu hỏi') ||
      lowerMessage.includes('tạo') ||
      lowerMessage.includes('generate');
      
    setTimeout(() => {
      let aiResponse = '';
      
      if (isQuizRequest || lowerMessage.length > 15) {
        aiResponse = "I'm generating a quiz based on your request. Please wait a moment...";
        
        // Extract topic from the message - use the entire message as topic
        const topic = message.trim();
        
        // Trigger quiz generation
        if (onQuizRequest) {
          onQuizRequest(topic);
        }
      } else if (lowerMessage.includes('create') || 
                lowerMessage.includes('add') || 
                lowerMessage.includes('make')) {
        // Handle other creation requests
        let blockType: BlockType = 'text';
        let content = '';
        
        if (lowerMessage.includes('code') || lowerMessage.includes('script') || lowerMessage.includes('programming')) {
          blockType = 'code';
          content = generateCodeContent(message);
          aiResponse = "I've created a code block for you based on your request.";
        } else if (lowerMessage.includes('image') || lowerMessage.includes('picture') || lowerMessage.includes('photo')) {
          blockType = 'image';
          content = 'https://source.unsplash.com/random/300x200';
          aiResponse = "I've added an image placeholder. In a real implementation, this would generate an actual image.";
        } else if (lowerMessage.includes('note') || lowerMessage.includes('sticky')) {
          blockType = 'sticky';
          content = extractContentFromMessage(message);
          aiResponse = "I've created a sticky note with your content.";
        } else {
          content = extractContentFromMessage(message);
          aiResponse = "I've created a text block with your content.";
        }
        
        if (onCreateBlock) {
          onCreateBlock(blockType, content);
        }
      } else {
        aiResponse = "Type any topic or content to generate a quiz about it. For example, 'Create a quiz about World War II' or 'Generate questions about renewable energy'.";
      }
      
      const aiMessage = {
        role: 'ai' as const, 
        message: aiResponse,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 500);
  };
  
  const extractTopicFromMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Try to extract the topic after keywords like "about", "on", "for"
    const topicMarkers = [' about ', ' on ', ' for ', ' regarding '];
    for (const marker of topicMarkers) {
      if (lowerMessage.includes(marker)) {
        return message.split(marker)[1].trim();
      }
    }
    
    // Remove quiz-related words to get the topic
    return message.replace(/quiz|create|make|generate|questions|test|trivia/gi, '').trim();
  };
  
  const extractContentFromMessage = (message: string): string => {
    const contentParts = message.split('with content');
    if (contentParts.length > 1) {
      return contentParts[1].trim().replace(/^['":]/, '').trim();
    }
    
    return message.replace(/create|add|make|generate|text|block|note|sticky/gi, '').trim();
  };
  
  const generateCodeContent = (message: string): string => {
    if (message.toLowerCase().includes('javascript') || message.toLowerCase().includes('js')) {
      return `// JavaScript example
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`;
    } else if (message.toLowerCase().includes('react')) {
      return `// React component example
import React from 'react';

const ExampleComponent = ({ title }) => {
  return (
    <div className="example">
      <h2>{title}</h2>
      <p>This is an example React component.</p>
    </div>
  );
};

export default ExampleComponent;`;
    } else {
      return `// Code example
function example() {
  // This is a placeholder code block
  // Replace with your actual code
  return "Hello from the AI assistant!";
}`;
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
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between bg-secondary/20">
        <div className="flex items-center">
          <BrainCircuit size={20} className="text-primary mr-2" />
          <h3 className="font-medium">AI Assistant</h3>
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
            placeholder="Ask about any topic to generate a quiz..."
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
