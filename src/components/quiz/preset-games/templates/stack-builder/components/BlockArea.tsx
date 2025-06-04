
import React from 'react';

interface Block {
  id: string;
  content: string;
  correctPosition: number;
  color: string;
}

interface BlockAreaProps {
  title: string;
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  isAvailableArea: boolean;
}

const BlockArea: React.FC<BlockAreaProps> = ({
  title,
  blocks,
  onBlockClick,
  isAvailableArea
}) => {
  return (
    <div className="block-area">
      <h4 className="area-title">{title}</h4>
      <div className={`blocks-container ${isAvailableArea ? 'available' : 'stack'}`}>
        {isAvailableArea ? (
          <div className="available-grid">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="game-block available-block"
                style={{ backgroundColor: block.color }}
                onClick={() => onBlockClick(block)}
              >
                {block.content}
              </div>
            ))}
          </div>
        ) : (
          <div className="stack-container">
            {blocks.map((block, index) => (
              <div
                key={`${block.id}-${index}`}
                className="game-block stack-block"
                style={{ backgroundColor: block.color }}
                onClick={() => onBlockClick(block)}
              >
                <span className="block-index">{index + 1}.</span>
                <span className="block-content">{block.content}</span>
              </div>
            ))}
            {blocks.length === 0 && (
              <div className="empty-stack">
                Kéo các khối vào đây để sắp xếp
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockArea;
