
import QuizTemplate from './QuizTemplate';
import FlashcardsTemplate from './FlashcardsTemplate';
import MatchingTemplate from './MatchingTemplate';
import MemoryTemplate from './MemoryTemplate';
import OrderingTemplate from './OrderingTemplate';
import WordSearchTemplate from './WordSearchTemplate';
import PictionaryTemplate from './PictionaryTemplate';
import TrueFalseTemplate from './TrueFalseTemplate';
import BalloonPopTemplate from './BalloonPopTemplate';
import SpinWheelTemplate from './SpinWheelTemplate';
import CatchObjectsTemplate from './CatchObjectsTemplate';
import JigsawTemplate from './JigsawTemplate';
import SnakeQuizTemplate from './SnakeQuizTemplate';
import TetrisQuizTemplate from './TetrisQuizTemplate';

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
  catchobjects: CatchObjectsTemplate,
  jigsaw: JigsawTemplate,
  snakequiz: SnakeQuizTemplate,
  tetrisquiz: TetrisQuizTemplate
};

export default gameTemplates;
