
import React from 'react';

// Placeholder components until real implementations are created
const QuizTemplate = (props: any) => <div>Quiz Template (Placeholder)</div>;
const FlashcardsTemplate = (props: any) => <div>Flashcards Template (Placeholder)</div>;
const MatchingTemplate = (props: any) => <div>Matching Template (Placeholder)</div>;
const MemoryTemplate = (props: any) => <div>Memory Template (Placeholder)</div>;
const OrderingTemplate = (props: any) => <div>Ordering Template (Placeholder)</div>;
const WordSearchTemplate = (props: any) => <div>WordSearch Template (Placeholder)</div>;
const PictionaryTemplate = (props: any) => <div>Pictionary Template (Placeholder)</div>;
const TrueFalseTemplate = (props: any) => <div>TrueFalse Template (Placeholder)</div>;

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
