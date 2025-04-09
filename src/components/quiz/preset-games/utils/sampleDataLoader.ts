
// Import sample data for testing/development
import { quizSampleData } from '../data/quizSampleData';
import { flashcardsSampleData } from '../data/flashcardsSampleData';
import { matchingSampleData } from '../data/matchingSampleData';
import { memorySampleData } from '../data/memorySampleData';
import { orderingSampleData } from '../data/orderingSampleData';
import { wordSearchSampleData } from '../data/wordSearchSampleData';
import { pictionarySampleData } from '../data/pictionarySampleData';
import { trueFalseSampleData } from '../data/trueFalseSampleData';

// Function to load sample data based on game type
export const loadSampleData = (type: string): any => {
  switch(type) {
    case 'quiz':
      return quizSampleData;
    case 'flashcards':
      return flashcardsSampleData;
    case 'matching':
      return matchingSampleData;
    case 'memory':
      return memorySampleData;
    case 'ordering':
      return orderingSampleData;
    case 'wordsearch':
      return wordSearchSampleData;
    case 'pictionary':
      return pictionarySampleData;
    case 'truefalse':
      return trueFalseSampleData;
    default:
      return quizSampleData;
  }
};
