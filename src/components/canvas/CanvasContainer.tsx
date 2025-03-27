import React, { useState, useEffect, useRef } from 'react';
import Block from './Block';
import FloatingToolbar from './FloatingToolbar';
import { createBlock, BlockType, Block as BlockModel, snapToGrid } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const CanvasContainer: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockModel[]>([]);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedBlocks = localStorage.getItem('canvas-blocks');
    if (savedBlocks) {
      try {
        setBlocks(JSON.parse(savedBlocks));
      } catch (e) {
        console.error('Failed to load blocks', e);
      }
    }
  }, []);
  
  useEffect(() => {
    if (blocks.length > 0) {
      localStorage.setItem('canvas-blocks', JSON.stringify(blocks));
    }
  }, [blocks]);
  
  const addBlock = (type: BlockType, position?: { x: number; y: number }) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const defaultPos = {
      x: (canvasRect?.width ?? 600) / 2 - 150,
      y: (canvasRect?.height ?? 400) / 2 - 50
    };
    
    const newPos = position || defaultPos;
    
    const newBlock = createBlock(type, '', {
      x: snapToGrid(newPos.x),
      y: snapToGrid(newPos.y)
    });
    
    setBlocks([...blocks, newBlock]);
    setSelectedBlockIds([newBlock.id]);
    
    toast({
      title: "Block Added",
      description: `New ${type} block created.`,
      duration: 2000,
    });
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
      description: "The block has been removed.",
      duration: 2000,
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
      description: "A copy of the block has been created.",
      duration: 2000,
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
  
  const handleCanvasClick = () => {
    setSelectedBlockIds([]);
  };
  
  const handleStartDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDraggedBlockId(id);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    
    if (!selectedBlockIds.includes(id)) {
      selectBlock(id, e.shiftKey);
    }
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleEndDrag);
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
  
  const handleEndDrag = () => {
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
    
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleEndDrag);
  };
  
  const handleExport = () => {
    toast({
      title: "Canvas Exported",
      description: "Your canvas has been exported as a PNG.",
      duration: 2000,
    });
    
    // In a real implementation, this would capture the canvas as an image
  };
  
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1 w-full h-full">
        <div
          ref={canvasRef}
          className="canvas-grid bg-gradient-canvas"
          onClick={handleCanvasClick}
        >
          <div className="relative w-[3000px] h-[2000px]">
            {blocks.map(block => (
              <Block
                key={block.id}
                block={block}
                isSelected={selectedBlockIds.includes(block.id)}
                onSelect={selectBlock}
                onUpdate={updateBlock}
                onDelete={deleteBlock}
                onDuplicate={duplicateBlock}
                onStartDrag={handleStartDrag}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      
      <FloatingToolbar
        onAddBlock={addBlock}
        onExport={handleExport}
      />
    </div>
  );
};

export default CanvasContainer;
