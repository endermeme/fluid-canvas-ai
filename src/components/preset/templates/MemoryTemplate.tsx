
import React from 'react';
import ActualMemoryTemplate from '../../quiz/preset-games/templates/MemoryTemplate';

interface MemoryTemplateProps {
  content: any;
  topic: string;
}

const MemoryTemplate: React.FC<MemoryTemplateProps> = ({ content, topic }) => {
  return <ActualMemoryTemplate content={content} topic={topic} />;
};

export default MemoryTemplate;
