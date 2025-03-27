
import React, { useEffect, useRef } from 'react';
import { 
  PlusCircle, 
  Image, 
  Code, 
  StickyNote, 
  Type, 
  Sparkles, 
  Download, 
  Link, 
  ArrowUpRight
} from 'lucide-react';
import { animateToolbarAppear } from '@/lib/animations';
import { BlockType } from '@/lib/block-utils';

interface FloatingToolbarProps {
  onAddBlock: (type: BlockType) => void;
  onAIGenerate: () => void;
  onExport: () => void;
  position?: { x: number; y: number; };
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onAddBlock,
  onAIGenerate,
  onExport,
  position,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showBlockOptions, setShowBlockOptions] = React.useState(false);
  
  // Apply entrance animation
  useEffect(() => {
    if (toolbarRef.current) {
      animateToolbarAppear(toolbarRef.current);
    }
  }, []);
  
  // Toolbar positioning
  const toolbarStyle = position 
    ? { top: `${position.y}px`, left: `${position.x}px` } 
    : { top: '1rem', left: '50%', transform: 'translateX(-50%)' };
  
  return (
    <div
      ref={toolbarRef}
      className="fixed glass-toolbar rounded-full px-2 py-1.5 z-30 flex items-center space-x-1.5"
      style={toolbarStyle}
    >
      <div className="relative">
        <button 
          className="toolbar-icon-button"
          onClick={() => setShowBlockOptions(!showBlockOptions)}
        >
          <PlusCircle size={18} />
        </button>
        
        {/* Block type dropdown */}
        {showBlockOptions && (
          <div className="absolute top-full left-0 mt-2 p-1 glass-toolbar rounded-lg flex flex-col space-y-1 animate-float-in">
            <button 
              className="toolbar-icon-button flex items-center p-2 justify-start w-32"
              onClick={() => {
                onAddBlock('text');
                setShowBlockOptions(false);
              }}
            >
              <Type size={16} className="mr-2" />
              <span className="text-sm">Text</span>
            </button>
            
            <button 
              className="toolbar-icon-button flex items-center p-2 justify-start w-32"
              onClick={() => {
                onAddBlock('image');
                setShowBlockOptions(false);
              }}
            >
              <Image size={16} className="mr-2" />
              <span className="text-sm">Image</span>
            </button>
            
            <button 
              className="toolbar-icon-button flex items-center p-2 justify-start w-32"
              onClick={() => {
                onAddBlock('code');
                setShowBlockOptions(false);
              }}
            >
              <Code size={16} className="mr-2" />
              <span className="text-sm">Code</span>
            </button>
            
            <button 
              className="toolbar-icon-button flex items-center p-2 justify-start w-32"
              onClick={() => {
                onAddBlock('sticky');
                setShowBlockOptions(false);
              }}
            >
              <StickyNote size={16} className="mr-2" />
              <span className="text-sm">Note</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Separator */}
      <div className="w-px h-6 bg-border/50"></div>
      
      {/* AI Generate */}
      <button className="toolbar-icon-button group relative" onClick={onAIGenerate}>
        <Sparkles size={18} className="text-primary" />
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Generate
        </span>
      </button>
      
      {/* Connect Blocks */}
      <button className="toolbar-icon-button group relative">
        <Link size={18} />
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Connect Blocks
        </span>
      </button>
      
      {/* Export */}
      <button className="toolbar-icon-button group relative" onClick={onExport}>
        <Download size={18} />
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Export
        </span>
      </button>
      
      {/* Share */}
      <button className="toolbar-icon-button group relative">
        <ArrowUpRight size={18} />
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Share
        </span>
      </button>
    </div>
  );
};

export default FloatingToolbar;
