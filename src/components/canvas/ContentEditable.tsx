
import React, { useState, useRef, useEffect } from 'react';
import { generateAISuggestion } from '@/lib/block-utils';

interface ContentEditableProps {
  content: string;
  onChange: (newContent: string) => void;
  className?: string;
  placeholder?: string;
  showAISuggestions?: boolean;
}

const ContentEditable: React.FC<ContentEditableProps> = ({
  content,
  onChange,
  className = '',
  placeholder = 'Type something...',
  showAISuggestions = true,
}) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update editor content when content prop changes
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);
  
  // Generate AI suggestions when content changes
  useEffect(() => {
    if (!showAISuggestions) return;
    
    // Clear any existing timeout
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }
    
    // Only show suggestions if there's meaningful content
    if (content && content.length > 10) {
      suggestionTimeoutRef.current = setTimeout(() => {
        const newSuggestion = generateAISuggestion(content);
        if (newSuggestion) {
          setSuggestion(newSuggestion);
          setShowSuggestion(true);
        }
      }, 1500);
    } else {
      setShowSuggestion(false);
    }
    
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [content, showAISuggestions]);
  
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Accept AI suggestion with Tab key
    if (e.key === 'Tab' && showSuggestion) {
      e.preventDefault();
      // In a real implementation, this would inject the AI suggestion
      // For now, we'll just hide the suggestion
      setShowSuggestion(false);
    }
  };
  
  const acceptSuggestion = () => {
    setShowSuggestion(false);
    // Here you would implement the actual suggestion acceptance logic
    // For now, we just hide the suggestion
  };
  
  return (
    <div className="relative w-full">
      <div
        ref={editorRef}
        className={`editable-content outline-none ${className}`}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      {showSuggestion && (
        <div className="ai-suggestion mt-2 animate-float-in">
          {suggestion}
          <button 
            onClick={acceptSuggestion}
            className="ml-2 text-primary text-xs hover:underline"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentEditable;
