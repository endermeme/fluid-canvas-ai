
import React from 'react';

// Placeholder components until real implementations are created
const QuizTemplate: React.FC<any> = (props) => {
  return <div>Quiz Template (Placeholder)</div>;
};

const FlashcardsTemplate: React.FC<any> = (props) => {
  return <div>Flashcards Template (Placeholder)</div>;
};

const MatchingTemplate: React.FC<any> = (props) => {
  return <div>Matching Template (Placeholder)</div>;
};

const MemoryTemplate: React.FC<any> = (props) => {
  return <div>Memory Template (Placeholder)</div>;
};

const OrderingTemplate: React.FC<any> = (props) => {
  return <div>Ordering Template (Placeholder)</div>;
};

const WordSearchTemplate: React.FC<any> = (props) => {
  return <div>WordSearch Template (Placeholder)</div>;
};

const PictionaryTemplate: React.FC<any> = (props) => {
  return <div>Pictionary Template (Placeholder)</div>;
};

const TrueFalseTemplate: React.FC<any> = (props) => {
  return <div>TrueFalse Template (Placeholder)</div>;
};

// Map game types to template components
const gameTemplates: {[key: string]: React.ComponentType<any>} = {
  quiz: QuizTemplate,
  flashcards: FlashcardsTemplate,
  matching: MatchingTemplate,
  memory: MemoryTemplate,
  ordering: OrderingTemplate,
  wordsearch: WordSearchTemplate,
  pictionary: PictionaryTemplate,
  truefalse: TrueFalseTemplate
};

export default gameTemplates;
