/**
 * Preset Game API Helper Functions
 * Các hàm hỗ trợ cho preset games (quiz, flashcards, memory, etc.)
 */

export const PRESET_GAME_API_TEMPLATE = `
// Preset Game API - Score Communication System
window.gameAPI = {
  // Báo cáo điểm số hiện tại cho preset games
  reportScore: function(score, totalQuestions) {
    try {
      window.parent.postMessage({
        type: 'PRESET_GAME_SCORE_UPDATE',
        data: {
          score: parseInt(score) || 0,
          totalQuestions: parseInt(totalQuestions) || 1,
          timestamp: Date.now(),
          gameType: 'preset'
        }
      }, '*');
    } catch (e) {
      console.log('Preset game score reported:', score);
    }
  },
  
  // Hoàn thành preset game với điểm số cuối cùng
  gameComplete: function(finalScore, timeSpent, extraData) {
    try {
      window.parent.postMessage({
        type: 'PRESET_GAME_COMPLETE',
        data: {
          score: parseInt(finalScore) || 0,
          completionTime: parseInt(timeSpent) || 0,
          extraData: extraData || {},
          timestamp: Date.now(),
          gameType: 'preset'
        }
      }, '*');
    } catch (e) {
      console.log('Preset game completed with score:', finalScore);
    }
  },
  
  // Cập nhật tiến trình preset game (0-100%)
  updateProgress: function(progress, currentLevel) {
    try {
      window.parent.postMessage({
        type: 'PRESET_GAME_PROGRESS_UPDATE',
        data: {
          progress: Math.min(Math.max(parseInt(progress) || 0, 0), 100),
          currentLevel: parseInt(currentLevel) || 1,
          timestamp: Date.now(),
          gameType: 'preset'
        }
      }, '*');
    } catch (e) {
      console.log('Preset game progress updated:', progress);
    }
  }
};

// Shortcuts cho preset games
window.reportScore = window.gameAPI.reportScore;
window.gameComplete = window.gameAPI.gameComplete;
window.updateProgress = window.gameAPI.updateProgress;
`;

export const QUIZ_GAME_TEMPLATE = `
// Quiz Game Template với Preset Score API
let currentScore = 0;
let totalQuestions = 0;
let startTime = Date.now();

function initQuizGame(questions) {
  totalQuestions = questions.length;
  currentScore = 0;
  startTime = Date.now();
  window.updateProgress(0, 1);
}

function answerQuestion(isCorrect, questionIndex) {
  if (isCorrect) {
    currentScore++;
  }
  
  // Báo cáo điểm hiện tại
  window.reportScore(currentScore, totalQuestions);
  
  // Cập nhật tiến trình
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  window.updateProgress(progress, questionIndex + 1);
  
  // Kiểm tra xem đã hoàn thành chưa
  if (questionIndex + 1 >= totalQuestions) {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    window.gameComplete(currentScore, timeSpent, { 
      totalQuestions: totalQuestions,
      accuracy: (currentScore / totalQuestions) * 100,
      gameType: 'quiz'
    });
  }
}
`;

export const FLASHCARD_GAME_TEMPLATE = `
// Flashcard Game Template với Preset Score API
let flashcardStartTime = Date.now();
let cardsStudied = 0;
let totalCards = 0;
let correctAnswers = 0;

function initFlashcardGame(cards) {
  flashcardStartTime = Date.now();
  cardsStudied = 0;
  totalCards = cards.length;
  correctAnswers = 0;
  window.updateProgress(0, 1);
}

function studyCard(isCorrect) {
  cardsStudied++;
  if (isCorrect) {
    correctAnswers++;
  }
  
  // Báo cáo tiến trình
  const progress = (cardsStudied / totalCards) * 100;
  window.updateProgress(progress, cardsStudied);
  window.reportScore(correctAnswers, totalCards);
  
  // Hoàn thành khi học xong tất cả thẻ
  if (cardsStudied >= totalCards) {
    const timeSpent = Math.floor((Date.now() - flashcardStartTime) / 1000);
    window.gameComplete(correctAnswers, timeSpent, {
      totalCards: totalCards,
      accuracy: (correctAnswers / totalCards) * 100,
      gameType: 'flashcards'
    });
  }
}
`;

export const MEMORY_GAME_TEMPLATE = `
// Memory Game Template với Preset Score API
let memoryStartTime = Date.now();
let attempts = 0;
let matches = 0;
let totalPairs = 0;

function initMemoryGame(pairs) {
  memoryStartTime = Date.now();
  attempts = 0;
  matches = 0;
  totalPairs = pairs;
  window.updateProgress(0, 1);
}

function makeMemoryAttempt(isMatch) {
  attempts++;
  if (isMatch) {
    matches++;
    const progress = (matches / totalPairs) * 100;
    window.updateProgress(progress, matches);
    
    if (matches >= totalPairs) {
      const timeSpent = Math.floor((Date.now() - memoryStartTime) / 1000);
      const efficiency = Math.max(100 - Math.floor(attempts / totalPairs), 10);
      window.gameComplete(efficiency, timeSpent, {
        matches: matches,
        attempts: attempts,
        accuracy: (matches / attempts) * 100,
        gameType: 'memory'
      });
    }
  }
}
`;

export const MATCHING_GAME_TEMPLATE = `
// Matching Game Template với Preset Score API
let matchingStartTime = Date.now();
let correctMatches = 0;
let totalItems = 0;
let wrongAttempts = 0;

function initMatchingGame(items) {
  matchingStartTime = Date.now();
  correctMatches = 0;
  totalItems = items.length;
  wrongAttempts = 0;
  window.updateProgress(0, 1);
}

function makeMatch(isCorrect) {
  if (isCorrect) {
    correctMatches++;
    const progress = (correctMatches / totalItems) * 100;
    window.updateProgress(progress, correctMatches);
    window.reportScore(correctMatches, totalItems);
    
    if (correctMatches >= totalItems) {
      const timeSpent = Math.floor((Date.now() - matchingStartTime) / 1000);
      const penalty = wrongAttempts * 5; // 5 points penalty per wrong attempt
      const finalScore = Math.max(correctMatches * 10 - penalty, 0);
      
      window.gameComplete(finalScore, timeSpent, {
        correctMatches: correctMatches,
        wrongAttempts: wrongAttempts,
        accuracy: (correctMatches / (correctMatches + wrongAttempts)) * 100,
        gameType: 'matching'
      });
    }
  } else {
    wrongAttempts++;
  }
}
`;

/**
 * Tạo script template cho preset game cụ thể
 */
export const generatePresetGameScript = (gameType: 'quiz' | 'flashcards' | 'memory' | 'matching' | 'wordsearch' | 'truefalse') => {
  const baseAPI = PRESET_GAME_API_TEMPLATE;
  
  switch (gameType) {
    case 'quiz':
      return baseAPI + QUIZ_GAME_TEMPLATE;
    case 'flashcards':
      return baseAPI + FLASHCARD_GAME_TEMPLATE;
    case 'memory':
      return baseAPI + MEMORY_GAME_TEMPLATE;
    case 'matching':
      return baseAPI + MATCHING_GAME_TEMPLATE;
    case 'wordsearch':
      return baseAPI + `
// Word Search Game Template
let wordSearchStartTime = Date.now();
let wordsFound = 0;
let totalWords = 0;

function initWordSearchGame(words) {
  wordSearchStartTime = Date.now();
  wordsFound = 0;
  totalWords = words.length;
  window.updateProgress(0, 1);
}

function findWord() {
  wordsFound++;
  const progress = (wordsFound / totalWords) * 100;
  window.updateProgress(progress, wordsFound);
  window.reportScore(wordsFound, totalWords);
  
  if (wordsFound >= totalWords) {
    const timeSpent = Math.floor((Date.now() - wordSearchStartTime) / 1000);
    window.gameComplete(wordsFound, timeSpent, {
      wordsFound: wordsFound,
      gameType: 'wordsearch'
    });
  }
}
`;
    case 'truefalse':
      return baseAPI + `
// True/False Game Template
let trueFalseStartTime = Date.now();
let trueFalseScore = 0;
let trueFalseTotal = 0;

function initTrueFalseGame(statements) {
  trueFalseStartTime = Date.now();
  trueFalseScore = 0;
  trueFalseTotal = statements.length;
  window.updateProgress(0, 1);
}

function answerTrueFalse(isCorrect, questionIndex) {
  if (isCorrect) {
    trueFalseScore++;
  }
  
  const progress = ((questionIndex + 1) / trueFalseTotal) * 100;
  window.updateProgress(progress, questionIndex + 1);
  window.reportScore(trueFalseScore, trueFalseTotal);
  
  if (questionIndex + 1 >= trueFalseTotal) {
    const timeSpent = Math.floor((Date.now() - trueFalseStartTime) / 1000);
    window.gameComplete(trueFalseScore, timeSpent, {
      accuracy: (trueFalseScore / trueFalseTotal) * 100,
      gameType: 'truefalse'
    });
  }
}
`;
    default:
      return baseAPI;
  }
};

export default {
  PRESET_GAME_API_TEMPLATE,
  QUIZ_GAME_TEMPLATE,
  FLASHCARD_GAME_TEMPLATE,
  MEMORY_GAME_TEMPLATE,
  MATCHING_GAME_TEMPLATE,
  generatePresetGameScript
};