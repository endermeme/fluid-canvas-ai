
import React from 'react';
import ActualMatchingTemplate from '../../quiz/preset-games/templates/MatchingTemplate';

interface MatchingTemplateProps {
  content: any;
  topic: string;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({ content, topic }) => {
  return <ActualMatchingTemplate content={content} topic={topic} />;
};

export default MatchingTemplate;
