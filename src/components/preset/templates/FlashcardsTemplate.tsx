
import React from 'react';
import ActualFlashcardsTemplate from '../../quiz/preset-games/templates/FlashcardsTemplate';

interface FlashcardsTemplateProps {
  content: any;
  topic: string;
}

const FlashcardsTemplate: React.FC<FlashcardsTemplateProps> = ({ content, topic }) => {
  return <ActualFlashcardsTemplate content={content} topic={topic} />;
};

export default FlashcardsTemplate;
