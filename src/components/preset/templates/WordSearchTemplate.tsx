
import React from 'react';
import ActualWordSearchTemplate from '../../quiz/preset-games/templates/WordSearchTemplate';

interface WordSearchTemplateProps {
  content: any;
  topic: string;
}

const WordSearchTemplate: React.FC<WordSearchTemplateProps> = ({ content, topic }) => {
  return <ActualWordSearchTemplate content={content} topic={topic} />;
};

export default WordSearchTemplate;
