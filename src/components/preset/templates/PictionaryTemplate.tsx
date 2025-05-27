
import React from 'react';
import ActualPictionaryTemplate from '../../quiz/preset-games/templates/PictionaryTemplate';

interface PictionaryTemplateProps {
  content: any;
  topic: string;
}

const PictionaryTemplate: React.FC<PictionaryTemplateProps> = ({ content, topic }) => {
  return <ActualPictionaryTemplate content={content} topic={topic} />;
};

export default PictionaryTemplate;
