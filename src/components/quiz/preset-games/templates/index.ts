
import QuizTemplate from './QuizTemplate';
import FlashcardsTemplate from './FlashcardsTemplate';
import MatchingTemplate from './MatchingTemplate';
import MemoryTemplate from './MemoryTemplate';
import OrderingTemplate from './OrderingTemplate';
import WordSearchTemplate from './WordSearchTemplate';
import PictionaryTemplate from './PictionaryTemplate';
import TrueFalseTemplate from './TrueFalseTemplate';

// Map game types to their templates
export const gameTemplates: Record<string, React.FC<any>> = {
  'quiz': QuizTemplate,
  'flashcards': FlashcardsTemplate,
  'matching': MatchingTemplate,
  'memory': MemoryTemplate,
  'ordering': OrderingTemplate,
  'wordsearch': WordSearchTemplate,
  'pictionary': PictionaryTemplate,
  'truefalse': TrueFalseTemplate,
};

export default gameTemplates;
