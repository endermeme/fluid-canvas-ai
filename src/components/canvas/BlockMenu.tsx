
import React, { forwardRef } from 'react';
import { Block as BlockType } from '@/lib/block-utils';
import { Trash2, Copy, Link, MessageCircle, Clock } from 'lucide-react';

interface BlockMenuProps {
  block: BlockType;
  onDelete: () => void;
  onDuplicate: () => void;
  onClose: () => void;
}

const BlockMenu = forwardRef<HTMLDivElement, BlockMenuProps>(
  ({ block, onDelete, onDuplicate, onClose }, ref) => {
    return (
      <div 
        ref={ref}
        className="absolute right-2 top-6 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 block-menu border border-border flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 bg-secondary/50 border-b border-border">
          <h4 className="text-xs font-medium">Block Options</h4>
        </div>
        
        <button 
          className="flex items-center px-3 py-2 hover:bg-secondary/70 transition-colors text-sm w-full text-left"
          onClick={onDuplicate}
        >
          <Copy size={14} className="mr-2" />
          Duplicate
        </button>
        
        <button 
          className="flex items-center px-3 py-2 hover:bg-secondary/70 transition-colors text-sm w-full text-left"
        >
          <Link size={14} className="mr-2" />
          Copy Link
        </button>
        
        <button 
          className="flex items-center px-3 py-2 hover:bg-secondary/70 transition-colors text-sm w-full text-left"
        >
          <MessageCircle size={14} className="mr-2" />
          Add Comment
        </button>
        
        <button 
          className="flex items-center px-3 py-2 hover:bg-secondary/70 transition-colors text-sm w-full text-left"
        >
          <Clock size={14} className="mr-2" />
          View History
        </button>
        
        <div className="border-t border-border mt-1"></div>
        
        <button 
          className="flex items-center px-3 py-2 hover:bg-destructive/10 transition-colors text-destructive text-sm w-full text-left"
          onClick={onDelete}
        >
          <Trash2 size={14} className="mr-2" />
          Delete
        </button>
      </div>
    );
  }
);

BlockMenu.displayName = 'BlockMenu';

export default BlockMenu;
