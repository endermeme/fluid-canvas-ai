
import FlashcardsTemplate from './FlashcardsTemplate';
import MatchingTemplate from './MatchingTemplate';
import MemoryTemplate from './MemoryTemplate';
import OrderingTemplate from './OrderingTemplate';
import PictionaryTemplate from './PictionaryTemplate';
import QuizTemplate from './QuizTemplate';
import TrueFalseTemplate from './TrueFalseTemplate';
import WordSearchTemplate from './WordSearchTemplate';

// Create an object with all templates
const gameTemplates = {
  'quiz': QuizTemplate,
  'flashcards': FlashcardsTemplate,
  'matching': MatchingTemplate,
  'memory': MemoryTemplate,
  'ordering': OrderingTemplate,
  'wordsearch': WordSearchTemplate,
  'pictionary': PictionaryTemplate,
  'truefalse': TrueFalseTemplate
};

export default gameTemplates;

export {
  FlashcardsTemplate,
  MatchingTemplate,
  MemoryTemplate,
  OrderingTemplate,
  PictionaryTemplate,
  QuizTemplate,
  TrueFalseTemplate,
  WordSearchTemplate
};
