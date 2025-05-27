
import React from 'react';
import ActualTrueFalseTemplate from '../../quiz/preset-games/templates/TrueFalseTemplate';

interface TrueFalseTemplateProps {
  content: any;
  topic: string;
}

const TrueFalseTemplate: React.FC<TrueFalseTemplateProps> = ({ content, topic }) => {
  return <ActualTrueFalseTemplate content={content} topic={topic} />;
};

export default TrueFalseTemplate;
