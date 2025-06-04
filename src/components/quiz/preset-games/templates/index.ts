
import QuizTemplate from './QuizTemplate';
import FlashcardsTemplate from './FlashcardsTemplate';
import MatchingTemplate from './MatchingTemplate';
import MemoryTemplate from './MemoryTemplate';
import OrderingTemplate from './OrderingTemplate';
import WordSearchTemplate from './WordSearchTemplate';
import PictionaryTemplate from './PictionaryTemplate';
import TrueFalseTemplate from './TrueFalseTemplate';
import BalloonPopTemplate from './balloon-pop';
import SpinWheelTemplate from './spin-wheel';
import WhackMoleTemplate from './whack-mole';

// Export bộ các templates dưới dạng đối tượng
const gameTemplates = {
  quiz: QuizTemplate,
  flashcards: FlashcardsTemplate,
  matching: MatchingTemplate,
  memory: MemoryTemplate,
  ordering: OrderingTemplate,
  wordsearch: WordSearchTemplate,
  pictionary: PictionaryTemplate,
  truefalse: TrueFalseTemplate,
  balloonpop: BalloonPopTemplate,
  spinwheel: SpinWheelTemplate,
  whackmole: WhackMoleTemplate
};

export default gameTemplates;
