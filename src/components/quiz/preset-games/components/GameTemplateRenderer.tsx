
import React from 'react';
import gameTemplates from '../templates';
import QuizTemplate from '../templates/QuizTemplate';
import FlashcardsTemplate from '../templates/FlashcardsTemplate';
import MatchingTemplate from '../templates/MatchingTemplate';
import MemoryTemplate from '../templates/MemoryTemplate';
import OrderingTemplate from '../templates/OrderingTemplate';
import WordSearchTemplate from '../templates/WordSearchTemplate';
import PictionaryTemplate from '../templates/PictionaryTemplate';
import TrueFalseTemplate from '../templates/TrueFalseTemplate';

interface GameTemplateRendererProps {
  gameType: string;
  gameContent: any;
  topic: string;
}

const GameTemplateRenderer: React.FC<GameTemplateRendererProps> = ({ 
  gameType, 
  gameContent, 
  topic 
}) => {
  // Render appropriate template based on game type
  switch(gameType) {
    case 'quiz':
      return <QuizTemplate content={gameContent} topic={topic} />;
    case 'flashcards':
      return <FlashcardsTemplate content={gameContent} topic={topic} />;
    case 'matching':
      return <MatchingTemplate content={gameContent} topic={topic} />;
    case 'memory':
      return <MemoryTemplate content={gameContent} topic={topic} />;
    case 'ordering':
      return <OrderingTemplate content={gameContent} topic={topic} />;
    case 'wordsearch':
      return <WordSearchTemplate content={gameContent} topic={topic} />;
    case 'pictionary':
      return <PictionaryTemplate content={gameContent} topic={topic} />;
    case 'truefalse':
      return <TrueFalseTemplate content={gameContent} topic={topic} />;
    default:
      const DefaultTemplate = gameTemplates[gameType] || QuizTemplate;
      return <DefaultTemplate content={gameContent} topic={topic} />;
  }
};

export default GameTemplateRenderer;
