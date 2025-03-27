
import React, { useState, useEffect, useRef } from 'react';
import Block from './Block';
import FloatingToolbar from './FloatingToolbar';
import { createBlock, BlockType, Block as BlockModel, snapToGrid } from '@/lib/block-utils';
import { useToast } from '@/hooks/use-toast';

const CanvasContainer: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockModel[]>([]);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load saved blocks from localStorage (in a real app, this would be from a database)
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
  
  // Save blocks to localStorage when they change
  useEffect(() => {
    if (blocks.length > 0) {
      localStorage.setItem('canvas-blocks', JSON.stringify(blocks));
    }
  }, [blocks]);
  
  // Add a new block to the canvas
  const addBlock = (type: BlockType, position?: { x: number; y: number }) => {
    // Center the new block in the viewport if no position provided
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const defaultPos = {
      x: (canvasRect?.width ?? 600) / 2 - 150,
      y: (canvasRect?.height ?? 400) / 2 - 50
    };
    
    const newPos = position || defaultPos;
    
    // Create the new block
    const newBlock = createBlock(type, '', {
      x: snapToGrid(newPos.x),
      y: snapToGrid(newPos.y)
    });
    
    // Add it to the blocks array
    setBlocks([...blocks, newBlock]);
    
    // Select the new block
    setSelectedBlockIds([newBlock.id]);
    
    // Show a toast notification
    toast({
      title: "Block Added",
      description: `New ${type} block created.`,
      duration: 2000,
    });
  };
  
  // Update a block
  const updateBlock = (id: string, updates: Partial<BlockModel>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };
  
  // Delete a block
  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    setSelectedBlockIds(selectedBlockIds.filter(blockId => blockId !== id));
    
    toast({
      title: "Block Deleted",
      description: "The block has been removed.",
      duration: 2000,
    });
  };
  
  // Duplicate a block
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
  
  // Select a block
  const selectBlock = (id: string, multiSelect = false) => {
    if (multiSelect) {
      // If already selected, deselect it
      if (selectedBlockIds.includes(id)) {
        setSelectedBlockIds(selectedBlockIds.filter(blockId => blockId !== id));
      } else {
        // Add to selection
        setSelectedBlockIds([...selectedBlockIds, id]);
      }
    } else {
      // Select only this block
      setSelectedBlockIds([id]);
    }
  };
  
  // Clear selection when clicking on the canvas
  const handleCanvasClick = () => {
    setSelectedBlockIds([]);
  };
  
  // Start dragging a block
  const handleStartDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDraggedBlockId(id);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    
    // Also select the block if it's not already selected
    if (!selectedBlockIds.includes(id)) {
      selectBlock(id, e.shiftKey);
    }
    
    // Add event listeners for mouse move and up
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleEndDrag);
  };
  
  // Handle dragging
  const handleDrag = (e: MouseEvent) => {
    if (!isDragging || !draggedBlockId) return;
    
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    
    // Move all selected blocks
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
    
    // Update drag start position
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };
  
  // End dragging
  const handleEndDrag = () => {
    setIsDragging(false);
    setDraggedBlockId(null);
    
    // Snap all selected blocks to grid
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
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleEndDrag);
  };
  
  // Handle export
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
      {/* Main canvas */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-auto canvas-grid bg-gradient-canvas"
        onClick={handleCanvasClick}
      >
        <div className="relative w-[3000px] h-[2000px]">
          {/* Render all blocks */}
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
      
      {/* Floating toolbar */}
      <FloatingToolbar
        onAddBlock={addBlock}
        onExport={handleExport}
      />
    </div>
  );
};

export default CanvasContainer;
