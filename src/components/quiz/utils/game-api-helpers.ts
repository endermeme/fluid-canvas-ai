/**
 * Game API Helper Functions
 * Các hàm hỗ trợ tiêu chuẩn để tích hợp vào HTML games
 */

export const GAME_API_TEMPLATE = `
// Game API - Score Communication System
window.gameAPI = {
  // Báo cáo điểm số hiện tại
  reportScore: function(score, totalQuestions) {
    try {
      window.parent.postMessage({
        type: 'GAME_SCORE_UPDATE',
        data: {
          score: parseInt(score) || 0,
          totalQuestions: parseInt(totalQuestions) || 1,
          timestamp: Date.now()
        }
      }, '*');
    } catch (e) {
      console.log('Score reported:', score);
    }
  },
  
  // Hoàn thành game với điểm số cuối cùng
  gameComplete: function(finalScore, timeSpent, extraData) {
    try {
      window.parent.postMessage({
        type: 'GAME_COMPLETE',
        data: {
          score: parseInt(finalScore) || 0,
          completionTime: parseInt(timeSpent) || 0,
          extraData: extraData || {},
          timestamp: Date.now()
        }
      }, '*');
    } catch (e) {
      console.log('Game completed with score:', finalScore);
    }
  },
  
  // Cập nhật tiến trình game (0-100%)
  updateProgress: function(progress, currentLevel) {
    try {
      window.parent.postMessage({
        type: 'GAME_PROGRESS_UPDATE',
        data: {
          progress: Math.min(Math.max(parseInt(progress) || 0, 0), 100),
          currentLevel: parseInt(currentLevel) || 1,
          timestamp: Date.now()
        }
      }, '*');
    } catch (e) {
      console.log('Progress updated:', progress);
    }
  }
};

// Shortcuts cho dễ sử dụng
window.reportScore = window.gameAPI.reportScore;
window.gameComplete = window.gameAPI.gameComplete;
window.updateProgress = window.gameAPI.updateProgress;
`;

export const QUIZ_GAME_TEMPLATE = `
// Quiz Game Template với Score API
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
      accuracy: (currentScore / totalQuestions) * 100
    });
  }
}
`;

export const TIMED_GAME_TEMPLATE = `
// Timed Game Template với Score API
let gameStartTime = Date.now();
let currentScore = 0;
let gameLevel = 1;

function startTimedGame() {
  gameStartTime = Date.now();
  currentScore = 0;
  gameLevel = 1;
  window.updateProgress(0, 1);
}

function addScore(points) {
  currentScore += points;
  window.reportScore(currentScore, 100); // 100 là max score ví dụ
}

function levelUp() {
  gameLevel++;
  window.updateProgress((gameLevel * 20), gameLevel); // Ví dụ 5 levels
}

function endTimedGame() {
  const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
  window.gameComplete(currentScore, timeSpent, {
    level: gameLevel,
    avgScorePerSecond: currentScore / timeSpent
  });
}
`;

export const PUZZLE_GAME_TEMPLATE = `
// Puzzle Game Template với Score API
let puzzleStartTime = Date.now();
let movesCount = 0;
let hintsUsed = 0;

function startPuzzleGame() {
  puzzleStartTime = Date.now();
  movesCount = 0;
  hintsUsed = 0;
  window.updateProgress(0, 1);
}

function makeMove() {
  movesCount++;
  // Cập nhật progress dựa trên completion percentage
}

function useHint() {
  hintsUsed++;
}

function updatePuzzleProgress(completionPercent) {
  window.updateProgress(completionPercent, 1);
}

function solvePuzzle() {
  const timeSpent = Math.floor((Date.now() - puzzleStartTime) / 1000);
  const efficiency = Math.max(100 - movesCount - (hintsUsed * 5), 10);
  
  window.gameComplete(efficiency, timeSpent, {
    moves: movesCount,
    hints: hintsUsed,
    efficiency: efficiency
  });
}
`;

/**
 * Tạo script template cho loại game cụ thể
 */
export const generateGameScript = (gameType: 'quiz' | 'timed' | 'puzzle' | 'memory') => {
  const baseAPI = GAME_API_TEMPLATE;
  
  switch (gameType) {
    case 'quiz':
      return baseAPI + QUIZ_GAME_TEMPLATE;
    case 'timed':
      return baseAPI + TIMED_GAME_TEMPLATE;
    case 'puzzle':
      return baseAPI + PUZZLE_GAME_TEMPLATE;
    case 'memory':
      return baseAPI + `
// Memory Game Template
let memoryStartTime = Date.now();
let attempts = 0;
let matches = 0;
let totalPairs = 0;

function startMemoryGame(pairs) {
  memoryStartTime = Date.now();
  attempts = 0;
  matches = 0;
  totalPairs = pairs;
  window.updateProgress(0, 1);
}

function makeAttempt(isMatch) {
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
        accuracy: (matches / attempts) * 100
      });
    }
  }
}
`;
    default:
      return baseAPI;
  }
};

export default {
  GAME_API_TEMPLATE,
  QUIZ_GAME_TEMPLATE,
  TIMED_GAME_TEMPLATE,
  PUZZLE_GAME_TEMPLATE,
  generateGameScript
};