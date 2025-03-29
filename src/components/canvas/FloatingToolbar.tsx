
import React, { useState } from 'react';
import { PlusCircle, Image, FileText, Code, Download, X, PenLine, Puzzle, Sparkles } from 'lucide-react';
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
            className="p-2 rounded-full hover:bg-sea-pale/70 transition-colors flex items-center space-x-1 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Add block"
          >
            {isMenuOpen ? (
              <>
                <X size={20} className="text-sea-dark group-hover:text-sea-bright transition-colors" />
                <span className="text-sm text-sea-dark group-hover:text-sea-bright transition-colors">Đóng</span>
              </>
            ) : (
              <>
                <PlusCircle size={20} className="text-sea-dark group-hover:text-sea-bright transition-colors" />
                <span className="text-sm text-sea-dark group-hover:text-sea-bright transition-colors">Thêm</span>
              </>
            )}
          </button>
          
          {/* Block Type Menu */}
          {isMenuOpen && (
            <div className="absolute bottom-12 left-0 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-1 min-w-40 flex flex-col space-y-1 border border-sea-pale animate-scale-in">
              <button
                className="flex items-center p-2 rounded hover:bg-sea-pale/50 transition-colors text-sm w-full text-left group"
                onClick={() => {
                  onAddBlock('text');
                  setIsMenuOpen(false);
                }}
              >
                <FileText size={16} className="mr-2 text-sea group-hover:text-sea-bright transition-colors" />
                <span className="text-sea-dark group-hover:text-sea-bright transition-colors">Khối Văn Bản</span>
              </button>
              <button
                className="flex items-center p-2 rounded hover:bg-sea-pale/50 transition-colors text-sm w-full text-left group"
                onClick={() => {
                  onAddBlock('image');
                  setIsMenuOpen(false);
                }}
              >
                <Image size={16} className="mr-2 text-sea group-hover:text-sea-bright transition-colors" />
                <span className="text-sea-dark group-hover:text-sea-bright transition-colors">Khối Hình Ảnh</span>
              </button>
              <button
                className="flex items-center p-2 rounded hover:bg-sea-pale/50 transition-colors text-sm w-full text-left group"
                onClick={() => {
                  onAddBlock('code');
                  setIsMenuOpen(false);
                }}
              >
                <Code size={16} className="mr-2 text-sea group-hover:text-sea-bright transition-colors" />
                <span className="text-sea-dark group-hover:text-sea-bright transition-colors">Khối Mã Lệnh</span>
                <Puzzle size={12} className="ml-1 text-sea-light/70 animate-pulse-soft" />
              </button>
            </div>
          )}
        </div>
        
        {/* Separator */}
        <div className="h-6 w-px bg-sea-pale/70"></div>
        
        {/* Export Button */}
        <button
          className="p-2 rounded-full hover:bg-sea-pale/70 transition-colors flex items-center space-x-1 group"
          onClick={onExport}
          aria-label="Export canvas"
        >
          <Download size={20} className="text-sea-dark group-hover:text-sea-bright transition-colors" />
          <span className="text-sm text-sea-dark group-hover:text-sea-bright transition-colors">Xuất</span>
          <Sparkles size={12} className="text-sea-light animate-pulse-soft" />
        </button>
      </div>
    </div>
  );
};

export default FloatingToolbar;
