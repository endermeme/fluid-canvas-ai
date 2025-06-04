
import React from 'react';
import { Card } from '@/components/ui/card';
import BlockArea from './BlockArea';

interface Block {
  id: string;
  content: string;
  correctPosition: number;
  color: string;
}

interface Sequence {
  id: number;
  question: string;
  blocks: Block[];
  explanation: string;
}

interface GameAreaProps {
  currentSequence: Sequence;
  availableBlocks: Block[];
  playerOrder: Block[];
  onMoveToStack: (block: Block) => void;
  onMoveToAvailable: (block: Block) => void;
}

const GameArea: React.FC<GameAreaProps> = ({
  currentSequence,
  availableBlocks,
  playerOrder,
  onMoveToStack,
  onMoveToAvailable
}) => {
  return (
    <div className="game-area">
      <Card className="question-card">
        <h3 className="question-title">{currentSequence.question}</h3>
        <p className="question-subtitle">Kéo thả các khối vào vùng xếp hạng bên dưới</p>
      </Card>

      <div className="play-area">
        <BlockArea
          title="Các khối có sẵn"
          blocks={availableBlocks}
          onBlockClick={onMoveToStack}
          isAvailableArea={true}
        />
        
        <BlockArea
          title="Thứ tự của bạn"
          blocks={playerOrder}
          onBlockClick={onMoveToAvailable}
          isAvailableArea={false}
        />
      </div>
    </div>
  );
};

export default GameArea;
