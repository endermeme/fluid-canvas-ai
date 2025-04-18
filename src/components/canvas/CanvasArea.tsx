
import React from 'react';
import Block from './Block';
import { Block as BlockModel } from '@/lib/block-utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CanvasAreaProps {
  blocks: BlockModel[];
  selectedBlockIds: string[];
  onBlockSelect: (id: string, multiSelect?: boolean) => void;
  onBlockUpdate: (id: string, updates: Partial<BlockModel>) => void;
  onBlockDelete: (id: string) => void;
  onBlockDuplicate: (id: string) => void;
  onStartDrag: (e: React.MouseEvent, id: string) => void;
  onCanvasClick: () => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  blocks,
  selectedBlockIds,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockDuplicate,
  onStartDrag,
  onCanvasClick,
  canvasRef
}) => {
  return (
    <ScrollArea className="flex-1 w-full h-full">
      <div
        ref={canvasRef}
        className="canvas-grid bg-gradient-canvas"
        onClick={onCanvasClick}
      >
        <div className="relative w-[3000px] h-[2000px]">
          {blocks.map(block => (
            <Block
              key={block.id}
              block={block}
              isSelected={selectedBlockIds.includes(block.id)}
              onSelect={onBlockSelect}
              onUpdate={onBlockUpdate}
              onDelete={onBlockDelete}
              onDuplicate={onBlockDuplicate}
              onStartDrag={onStartDrag}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default CanvasArea;
