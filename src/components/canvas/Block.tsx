
import React, { useState, useEffect, useRef } from 'react';
import { Block as BlockType } from '@/lib/block-utils';
import ContentEditable from './ContentEditable';
import { animateBlockCreation } from '@/lib/animations';
import { Menu, X, Move, Code, Image, StickyNote, Type, MoreHorizontal } from 'lucide-react';
import BlockMenu from './BlockMenu';

interface BlockProps {
  block: BlockType;
  isSelected: boolean;
  onSelect: (id: string, multiSelect?: boolean) => void;
  onUpdate: (id: string, updates: Partial<BlockType>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onStartDrag: (e: React.MouseEvent, id: string) => void;
}

const Block: React.FC<BlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onStartDrag,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showResizeHandles, setShowResizeHandles] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Apply entrance animation when component mounts
  useEffect(() => {
    if (blockRef.current) {
      animateBlockCreation(blockRef.current);
    }
  }, []);
  
  // Handle content change
  const handleContentChange = (newContent: string) => {
    onUpdate(block.id, { 
      content: newContent,
      updatedAt: new Date()
    });
  };
  
  // Handle outside clicks to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        blockRef.current &&
        !blockRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add touch press effect
  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // Render the appropriate content based on block type
  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <ContentEditable 
            content={block.content}
            onChange={handleContentChange}
            className="w-full h-full min-h-[60px]"
            placeholder="Type text here..."
          />
        );
      case 'code':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="text-xs text-muted-foreground mb-1 px-1 flex items-center">
              <Code size={12} className="mr-1" />
              <span>Code</span>
            </div>
            <ContentEditable 
              content={block.content}
              onChange={handleContentChange}
              className="font-mono text-sm bg-secondary/50 p-2 rounded w-full h-full overflow-auto"
              placeholder="// Type your code here"
              showAISuggestions={false}
            />
          </div>
        );
      case 'image':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="text-xs text-muted-foreground mb-1 px-1 flex items-center">
              <Image size={12} className="mr-1" />
              <span>Image</span>
            </div>
            {block.content ? (
              <img 
                src={block.content} 
                alt="Block content"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-secondary/50 rounded text-muted-foreground text-sm">
                Click to add an image
              </div>
            )}
          </div>
        );
      case 'sticky':
        return (
          <div className="w-full h-full flex flex-col bg-yellow-100 dark:bg-yellow-800/40">
            <div className="text-xs text-muted-foreground mb-1 px-1 flex items-center">
              <StickyNote size={12} className="mr-1" />
              <span>Note</span>
            </div>
            <ContentEditable 
              content={block.content}
              onChange={handleContentChange}
              className="w-full h-full"
              placeholder="Add a note..."
            />
          </div>
        );
      default:
        return <div>Unknown block type</div>;
    }
  };
  
  // Block header icons based on type
  const getBlockIcon = () => {
    switch (block.type) {
      case 'text': return <Type size={14} />;
      case 'code': return <Code size={14} />;
      case 'image': return <Image size={14} />;
      case 'sticky': return <StickyNote size={14} />;
      default: return <Menu size={14} />;
    }
  };
  
  // Render resize handles when selected
  const renderResizeHandles = () => {
    if (!showResizeHandles) return null;
    
    return (
      <>
        <div 
          className="block-resize-handle bottom-0 right-0 cursor-se-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            // Here you would implement resize logic
          }}
        />
      </>
    );
  };

  // Create ripple effect on click
  const createRippleEffect = (e: React.MouseEvent) => {
    const element = blockRef.current;
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    
    const x = e.clientX - rect.left - size/2;
    const y = e.clientY - rect.top - size/2;
    
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'absolute rounded-full bg-primary/20 pointer-events-none transform animate-ripple';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (element.contains(ripple)) {
        ripple.remove();
      }
    }, 600);
  };
  
  return (
    <div
      ref={blockRef}
      className={`canvas-block absolute ${isSelected ? 'block-selected shadow-lg' : 'shadow-md'} ${isPressed ? 'scale-[0.98]' : ''} transition-transform duration-150 relative overflow-hidden`}
      style={{
        left: `${block.position.x}px`,
        top: `${block.position.y}px`,
        width: `${block.position.width}px`,
        height: `${block.position.height}px`,
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={(e) => {
        onSelect(block.id, e.shiftKey);
        createRippleEffect(e);
        e.stopPropagation();
      }}
      onMouseEnter={() => setShowResizeHandles(true)}
      onMouseLeave={() => setShowResizeHandles(false)}
      onMouseDown={handleMouseDown}
    >
      {/* Block header with drag handle */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-2 cursor-move opacity-40 hover:opacity-100 transition-opacity duration-200 bg-background/50 backdrop-blur-sm"
        onMouseDown={(e) => onStartDrag(e, block.id)}
      >
        <div className="flex items-center space-x-1">
          {getBlockIcon()}
          <span className="text-xs text-muted-foreground ml-1">
            {new Date(block.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="flex items-center">
          <button
            className="p-1.5 rounded-full hover:bg-secondary/70 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
              createRippleEffect(e);
            }}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
      
      {/* Block content */}
      <div className="pt-8 h-full p-1">
        {renderBlockContent()}
      </div>
      
      {/* Block menu */}
      {showMenu && (
        <BlockMenu
          ref={menuRef}
          block={block}
          onDelete={() => onDelete(block.id)}
          onDuplicate={() => onDuplicate(block.id)}
          onClose={() => setShowMenu(false)}
        />
      )}
      
      {/* Resize handles */}
      {renderResizeHandles()}
    </div>
  );
};

export default Block;
