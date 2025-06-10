
import { GameSettingsData } from '../../types';

export const loadSampleData = async (
  type: string, 
  initialTopic: string, 
  settings: GameSettingsData,
  setLoading: (loading: boolean) => void,
  setGameContent: (content: any) => void,
  setError: (error: string) => void
) => {
  const newGames = ['groupsort', 'spinwheel', 'completesentence', 'anagram', 'openbox', 'speakingcards', 'neuronpaths'];
  
  if (newGames.includes(type) || type === 'pictionary') {
    setError(`Không có dữ liệu mẫu cho game ${type}. Vui lòng sử dụng AI để tạo nội dung.`);
    setLoading(false);
    return;
  }

  try {
    const module = await import(`../data/${type}SampleData.ts`);
    let data = null;

    if (type === 'wordsearch' && initialTopic) {
      const lowerTopic = initialTopic.toLowerCase();
      if (lowerTopic.includes('easy') || lowerTopic.includes('simple')) {
        data = module.easyWordSearchData || module.default || module[`${type}SampleData`];
      } else if (lowerTopic.includes('hard') || lowerTopic.includes('difficult')) {
        data = module.hardWordSearchData || module.default || module[`${type}SampleData`];
      } else {
        data = module.default || module[`${type}SampleData`];
      }
    } else {
      data = module.default || module[`${type}SampleData`];
    }

    if (data) {
      if (!data.settings) {
        data.settings = {};
      }

      switch(type) {
        case 'quiz':
          data.settings.timePerQuestion = settings.timePerQuestion;
          data.settings.totalTime = settings.totalTime || settings.questionCount * settings.timePerQuestion;
          data.settings.bonusTimePerCorrect = settings.bonusTime || 5;
          break;
        case 'flashcards':
          data.settings.flipTime = settings.timePerQuestion;
          data.settings.totalTime = settings.totalTime || 180;
          break;
        case 'matching':
        case 'memory':
          data.settings.timeLimit = settings.totalTime || 120;
          break;
        case 'ordering':
          data.settings.timeLimit = settings.totalTime || 180;
          data.settings.bonusTimePerCorrect = settings.bonusTime || 10;
          break;
        case 'wordsearch':
          data.settings.timeLimit = settings.totalTime || 300;
          data.settings.bonusTimePerWord = settings.bonusTime || 15;
          break;
        case 'pictionary':
          data.settings.timePerQuestion = settings.timePerQuestion;
          data.settings.totalTime = settings.totalTime || settings.questionCount * settings.timePerQuestion;
          break;
        case 'truefalse':
          data.settings.timePerQuestion = settings.timePerQuestion;
          data.settings.totalTime = settings.totalTime || settings.questionCount * settings.timePerQuestion;
          data.settings.bonusTimePerCorrect = settings.bonusTime || 3;
          break;
      }
    }

    setLoading(false);
    setGameContent(data);
  } catch (err) {
    console.error(`Error loading sample data for ${type}:`, err);
    setError(`Không thể tải dữ liệu mẫu cho ${type}. Vui lòng thử lại.`);
    setLoading(false);
  }
};
