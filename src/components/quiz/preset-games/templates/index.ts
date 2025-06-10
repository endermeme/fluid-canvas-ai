
import QuizTemplate from './QuizTemplate';
import FlashcardsTemplate from './FlashcardsTemplate';
import MatchingTemplate from './MatchingTemplate';
import MemoryTemplate from './MemoryTemplate';
import OrderingTemplate from './OrderingTemplate';
import WordSearchTemplate from './WordSearchTemplate';
import PictionaryTemplate from './PictionaryTemplate';
import TrueFalseTemplate from './TrueFalseTemplate';
import GroupSortTemplate from './GroupSortTemplate';
import SpinWheelTemplate from './SpinWheelTemplate';
import CompleteSentenceTemplate from './CompleteSentenceTemplate';
import AnagramTemplate from './AnagramTemplate';
import OpenBoxTemplate from './OpenBoxTemplate';
import SpeakingCardsTemplate from './SpeakingCardsTemplate';
import PatternRecognitionTemplate from './PatternRecognitionTemplate';

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
  groupsort: GroupSortTemplate,
  spinwheel: SpinWheelTemplate,
  completesentence: CompleteSentenceTemplate,
  anagram: AnagramTemplate,
  openbox: OpenBoxTemplate,
  speakingcards: SpeakingCardsTemplate,
  patternrecognition: PatternRecognitionTemplate,
};

export default gameTemplates;
