
import { v4 as uuidv4 } from 'uuid';

export type BlockType = 'text' | 'image' | 'code' | 'sticky';
export type BlockPosition = { x: number; y: number; width: number; height: number; };

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  position: BlockPosition;
  createdAt: Date;
  updatedAt: Date;
  connections?: string[];  // IDs of connected blocks
  comments?: Comment[];
  version: number;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  position: { x: number; y: number; };
}

// Create a new block of specified type
export const createBlock = (
  type: BlockType, 
  content: string = '', 
  position: Partial<BlockPosition> = {}
): Block => {
  const defaultSizes = {
    text: { width: 300, height: 100 },
    image: { width: 320, height: 240 },
    code: { width: 400, height: 200 },
    sticky: { width: 200, height: 200 },
  };
  
  const now = new Date();
  
  return {
    id: uuidv4(),
    type,
    content,
    position: {
      x: position.x || 100,
      y: position.y || 100,
      width: position.width || defaultSizes[type].width,
      height: position.height || defaultSizes[type].height,
    },
    createdAt: now,
    updatedAt: now,
    connections: [],
    comments: [],
    version: 1,
  };
};

// Clone a block (useful for duplication)
export const cloneBlock = (block: Block): Block => {
  return {
    ...block,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  };
};

// Check if two blocks are overlapping
export const areBlocksOverlapping = (block1: Block, block2: Block): boolean => {
  const a = block1.position;
  const b = block2.position;
  
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
};

// Get block by ID from blocks array
export const getBlockById = (blocks: Block[], id: string): Block | undefined => {
  return blocks.find(block => block.id === id);
};

// Snap position to grid
export const snapToGrid = (position: number, gridSize: number = 20): number => {
  return Math.round(position / gridSize) * gridSize;
};

// Generate AI suggestions based on block content (placeholder for actual AI integration)
export const generateAISuggestion = (blockContent: string): string => {
  if (!blockContent || blockContent.length < 5) return '';
  
  const suggestions = [
    "Consider expanding on this point...",
    "You might want to add more details here.",
    "This could connect well with your previous idea about...",
    "Would you like me to generate more content on this topic?",
    "This concept pairs well with visual examples.",
    "Have you considered the implications of this statement?",
  ];
  
  // In a real implementation, this would call an AI service
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};
