
import { useState, useEffect } from 'react';
import { Block as BlockModel, BlockType, createBlock, snapToGrid } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';

export const useCanvasState = () => {
  const [blocks, setBlocks] = useState<BlockModel[]>([]);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load blocks from localStorage on mount, filter out any text boxes if they exist
  useEffect(() => {
    const savedBlocks = localStorage.getItem('canvas-blocks');
    if (savedBlocks) {
      try {
        // Filter out any blocks that match the text box in the screenshot
        const parsedBlocks = JSON.parse(savedBlocks);
        const filteredBlocks = parsedBlocks.filter((block: BlockModel) => {
          // Remove the specific text block from the screenshot (with timestamp 14:40)
          return !(block.type === 'text' && block.content.includes('14:40'));
        });
        setBlocks(filteredBlocks);
      } catch (e) {
        console.error('Failed to load blocks', e);
      }
    }
  }, []);
  
  // Save blocks to localStorage when they change
  useEffect(() => {
    if (blocks.length > 0) {
      localStorage.setItem('canvas-blocks', JSON.stringify(blocks));
    }
  }, [blocks]);
  
  const addBlock = (type: BlockType, position?: { x: number; y: number }, canvasRect?: DOMRect, content?: string) => {
    const defaultPos = {
      x: (canvasRect?.width ?? 600) / 2 - 150,
      y: (canvasRect?.height ?? 400) / 2 - 50
    };
    
    const newPos = position || defaultPos;
    
    const newBlock = createBlock(type, content || '', {
      x: snapToGrid(newPos.x),
      y: snapToGrid(newPos.y)
    });
    
    setBlocks([...blocks, newBlock]);
    setSelectedBlockIds([newBlock.id]);
    
    toast({
      title: "Block Added",
      description: `New ${type} block created.`
    });

    return newBlock.id; // Return the ID so we can reference it later if needed
  };
  
  const updateBlock = (id: string, updates: Partial<BlockModel>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };
  
  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    setSelectedBlockIds(selectedBlockIds.filter(blockId => blockId !== id));
    
    toast({
      title: "Block Deleted",
      description: "The block has been removed."
    });
  };
  
  const duplicateBlock = (id: string) => {
    const blockToDuplicate = blocks.find(block => block.id === id);
    if (!blockToDuplicate) return;
    
    const duplicatedBlock = {
      ...blockToDuplicate,
      id: Math.random().toString(36).substr(2, 9),
      position: {
        ...blockToDuplicate.position,
        x: blockToDuplicate.position.x + 20,
        y: blockToDuplicate.position.y + 20
      }
    };
    
    setBlocks([...blocks, duplicatedBlock]);
    setSelectedBlockIds([duplicatedBlock.id]);
    
    toast({
      title: "Block Duplicated",
      description: "A copy of the block has been created."
    });
  };
  
  const selectBlock = (id: string, multiSelect = false) => {
    if (multiSelect) {
      if (selectedBlockIds.includes(id)) {
        setSelectedBlockIds(selectedBlockIds.filter(blockId => blockId !== id));
      } else {
        setSelectedBlockIds([...selectedBlockIds, id]);
      }
    } else {
      setSelectedBlockIds([id]);
    }
  };
  
  const clearSelection = () => {
    setSelectedBlockIds([]);
  };
  
  // Add a function to manually clear all blocks from local storage
  const clearAllBlocks = () => {
    setBlocks([]);
    localStorage.removeItem('canvas-blocks');
    toast({
      title: "Canvas Cleared",
      description: "All blocks have been removed from the canvas."
    });
  };
  
  return {
    blocks,
    selectedBlockIds,
    isDragging,
    dragStartPos,
    draggedBlockId,
    setIsDragging,
    setDragStartPos,
    setDraggedBlockId,
    setBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    selectBlock,
    clearSelection,
    clearAllBlocks
  };
};
