
import { useEffect } from 'react';
import { Block as BlockModel } from '@/lib/block-utils';
import { snapToGrid } from '@/lib/block-utils';

interface DragAndDropProps {
  isDragging: boolean;
  draggedBlockId: string | null;
  dragStartPos: { x: number; y: number };
  selectedBlockIds: string[];
  blocks: BlockModel[];
  setBlocks: React.Dispatch<React.SetStateAction<BlockModel[]>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setDraggedBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  setDragStartPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export const useDragAndDrop = ({
  isDragging,
  draggedBlockId,
  dragStartPos,
  selectedBlockIds,
  blocks,
  setBlocks,
  setIsDragging,
  setDraggedBlockId,
  setDragStartPos
}: DragAndDropProps) => {
  
  const handleStartDrag = (e: React.MouseEvent, id: string, selectBlock: (id: string, multiSelect?: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDraggedBlockId(id);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    
    if (!selectedBlockIds.includes(id)) {
      selectBlock(id, e.shiftKey);
    }
  };
  
  const handleDrag = (e: MouseEvent) => {
    if (!isDragging || !draggedBlockId) return;
    
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    
    setBlocks(blocks.map(block => {
      if (selectedBlockIds.includes(block.id)) {
        return {
          ...block,
          position: {
            ...block.position,
            x: block.position.x + dx,
            y: block.position.y + dy
          }
        };
      }
      return block;
    }));
    
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };
  
  const handleEndDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setDraggedBlockId(null);
    
    setBlocks(blocks.map(block => {
      if (selectedBlockIds.includes(block.id)) {
        return {
          ...block,
          position: {
            ...block.position,
            x: snapToGrid(block.position.x),
            y: snapToGrid(block.position.y)
          }
        };
      }
      return block;
    }));
  };
  
  useEffect(() => {
    if (isDragging) {
      // Use passive: false to be able to preventDefault on mobile
      const dragOptions = { passive: false };
      
      document.addEventListener('mousemove', handleDrag, dragOptions);
      document.addEventListener('mouseup', handleEndDrag);
      document.addEventListener('touchmove', handleDrag as any, dragOptions);
      document.addEventListener('touchend', handleEndDrag as any);
      
      // Prevent scrolling during drag
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleEndDrag);
        document.removeEventListener('touchmove', handleDrag as any);
        document.removeEventListener('touchend', handleEndDrag as any);
        document.body.style.overflow = '';
      };
    }
  }, [isDragging, draggedBlockId, dragStartPos, selectedBlockIds, blocks]);
  
  return {
    handleStartDrag
  };
};
