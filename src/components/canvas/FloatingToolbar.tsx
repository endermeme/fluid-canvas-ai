
import React, { useState } from 'react';
import { PlusCircle, Image, FileText, Code, Download, X } from 'lucide-react';
import { BlockType } from '@/lib/block-utils';

interface FloatingToolbarProps {
  onAddBlock: (type: BlockType, position?: { x: number; y: number }) => void;
  onExport: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onAddBlock,
  onExport
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className="glass-toolbar rounded-full shadow-lg px-1 py-1 flex items-center space-x-1">
        {/* Add Block Button/Menu */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-primary/10 transition-colors flex items-center space-x-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Add block"
          >
            {isMenuOpen ? (
              <>
                <X size={20} />
                <span className="text-sm">Close</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} />
                <span className="text-sm">Add</span>
              </>
            )}
          </button>
          
          {/* Block Type Menu */}
          {isMenuOpen && (
            <div className="absolute bottom-12 left-0 bg-popover rounded-lg shadow-lg p-1 min-w-40 flex flex-col space-y-1 border border-border animate-scale-in">
              <button
                className="flex items-center p-2 rounded hover:bg-secondary/70 transition-colors text-sm w-full text-left"
                onClick={() => {
                  onAddBlock('text');
                  setIsMenuOpen(false);
                }}
              >
                <FileText size={16} className="mr-2" />
                Text Block
              </button>
              <button
                className="flex items-center p-2 rounded hover:bg-secondary/70 transition-colors text-sm w-full text-left"
                onClick={() => {
                  onAddBlock('image');
                  setIsMenuOpen(false);
                }}
              >
                <Image size={16} className="mr-2" />
                Image Block
              </button>
              <button
                className="flex items-center p-2 rounded hover:bg-secondary/70 transition-colors text-sm w-full text-left"
                onClick={() => {
                  onAddBlock('code');
                  setIsMenuOpen(false);
                }}
              >
                <Code size={16} className="mr-2" />
                Code Block
              </button>
            </div>
          )}
        </div>
        
        {/* Separator */}
        <div className="h-6 w-px bg-border"></div>
        
        {/* Export Button */}
        <button
          className="p-2 rounded-full hover:bg-primary/10 transition-colors flex items-center space-x-1"
          onClick={onExport}
          aria-label="Export canvas"
        >
          <Download size={20} />
          <span className="text-sm">Export</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingToolbar;
