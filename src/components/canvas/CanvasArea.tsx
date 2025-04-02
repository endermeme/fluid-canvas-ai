
import React, { useEffect, useRef } from 'react';
import Block from './Block';
import { Block as BlockModel } from '@/lib/block-utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  
  // Add tap effect for canvas
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === canvasAreaRef.current) {
      // Create ripple effect on canvas with enhanced visibility
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.width = '80px'; // Tăng kích thước
      ripple.style.height = '80px'; // Tăng kích thước
      ripple.style.backgroundColor = 'rgba(25, 118, 210, 0.4)'; // Màu xanh đậm hơn
      ripple.style.transform = 'scale(0)';
      ripple.style.left = `${e.clientX - 40}px`;
      ripple.style.top = `${e.clientY - 40}px`;
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple 0.8s linear'; // Kéo dài hiệu ứng
      
      canvasRef.current?.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 800); // Kéo dài thời gian hiển thị
      
      onCanvasClick();
    }
  };
  
  // Enhance touch response
  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (canvas) {
      // Fix for TypeScript - avoid using vendor prefixed properties directly
      canvas.style.setProperty('-webkit-tap-highlight-color', 'transparent');
      
      if (isMobile) {
        // Better touch handling for mobile
        canvas.style.touchAction = 'manipulation';
      }
      
      // Thêm màu nền nhẹ để thấy sự thay đổi
      canvas.style.backgroundColor = 'rgba(240, 245, 255, 0.5)';
      canvas.style.transition = 'background-color 0.3s ease';
    }
  }, [canvasRef, isMobile]);

  return (
    <ScrollArea className="flex-1 w-full h-full">
      <div
        ref={canvasRef}
        className="canvas-grid bg-gradient-canvas relative"
        onClick={handleCanvasClick}
      >
        <div 
          ref={canvasAreaRef}
          className="relative w-[3000px] h-[2000px]"
        >
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
