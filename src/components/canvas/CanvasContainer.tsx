
import React, { useRef } from 'react';
import FloatingToolbar from './FloatingToolbar';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import CanvasArea from './CanvasArea';
import { useToast } from '@/hooks/use-toast';

const CanvasContainer: React.FC = () => {
  const {
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
    clearSelection
  } = useCanvasState();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { handleStartDrag } = useDragAndDrop({
    isDragging,
    draggedBlockId,
    dragStartPos,
    selectedBlockIds,
    blocks,
    setBlocks,
    setIsDragging,
    setDraggedBlockId,
    setDragStartPos
  });
  
  const handleAddBlock = (type, position) => {
    addBlock(type, position, canvasRef.current?.getBoundingClientRect());
  };
  
  const handleExport = () => {
    toast({
      title: "Canvas Exported",
      description: "Your canvas has been exported as a PNG.",
      duration: 2000,
    });
    
    // In a real implementation, this would capture the canvas as an image
  };
  
  const onStartDrag = (e: React.MouseEvent, id: string) => {
    handleStartDrag(e, id, selectBlock);
  };
  
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <CanvasArea
        blocks={blocks}
        selectedBlockIds={selectedBlockIds}
        onBlockSelect={selectBlock}
        onBlockUpdate={updateBlock}
        onBlockDelete={deleteBlock}
        onBlockDuplicate={duplicateBlock}
        onStartDrag={onStartDrag}
        onCanvasClick={clearSelection}
        canvasRef={canvasRef}
      />
      
      <FloatingToolbar
        onAddBlock={handleAddBlock}
        onExport={handleExport}
      />
    </div>
  );
};

export default CanvasContainer;
