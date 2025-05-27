
import React from 'react';
import ActualQuizTemplate from '../../quiz/preset-games/templates/QuizTemplate';

interface QuizTemplateProps {
  content: any;
  topic: string;
}

const QuizTemplate: React.FC<QuizTemplateProps> = ({ content, topic }) => {
  return <ActualQuizTemplate content={content} topic={topic} />;
};

export default QuizTemplate;
