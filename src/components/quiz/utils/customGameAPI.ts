/**
 * Custom Game API Helper Functions
 * Các hàm hỗ trợ cho custom HTML games
 */

export const CUSTOM_GAME_API_TEMPLATE = `
// Custom Game API - Score Communication System
window.gameAPI = {
  // Báo cáo điểm số hiện tại cho custom games
  reportScore: function(score, totalQuestions) {
    try {
      window.parent.postMessage({
        type: 'CUSTOM_GAME_SCORE_UPDATE',
        data: {
          score: parseInt(score) || 0,
          totalQuestions: parseInt(totalQuestions) || 1,
          timestamp: Date.now(),
          gameType: 'custom'
        }
      }, '*');
    } catch (e) {
      console.log('Custom game score reported:', score);
    }
  },
  
  // Hoàn thành custom game với điểm số cuối cùng
  gameComplete: function(finalScore, timeSpent, extraData) {
    try {
      window.parent.postMessage({
        type: 'CUSTOM_GAME_COMPLETE',
        data: {
          score: parseInt(finalScore) || 0,
          completionTime: parseInt(timeSpent) || 0,
          extraData: extraData || {},
          timestamp: Date.now(),
          gameType: 'custom'
        }
      }, '*');
    } catch (e) {
      console.log('Custom game completed with score:', finalScore);
    }
  },
  
  // Cập nhật tiến trình custom game (0-100%)
  updateProgress: function(progress, currentLevel) {
    try {
      window.parent.postMessage({
        type: 'CUSTOM_GAME_PROGRESS_UPDATE',
        data: {
          progress: Math.min(Math.max(parseInt(progress) || 0, 0), 100),
          currentLevel: parseInt(currentLevel) || 1,
          timestamp: Date.now(),
          gameType: 'custom'
        }
      }, '*');
    } catch (e) {
      console.log('Custom game progress updated:', progress);
    }
  },
  
  // Custom game specific - Save progress to localStorage
  saveProgress: function(progressData) {
    try {
      localStorage.setItem('customGameProgress', JSON.stringify(progressData));
      window.parent.postMessage({
        type: 'CUSTOM_GAME_PROGRESS_SAVED',
        data: progressData
      }, '*');
    } catch (e) {
      console.log('Custom game progress saved locally');
    }
  },
  
  // Custom game specific - Load progress from localStorage
  loadProgress: function() {
    try {
      const saved = localStorage.getItem('customGameProgress');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }
};

// Shortcuts cho custom games
window.reportScore = window.gameAPI.reportScore;
window.gameComplete = window.gameAPI.gameComplete;
window.updateProgress = window.gameAPI.updateProgress;
window.saveProgress = window.gameAPI.saveProgress;
window.loadProgress = window.gameAPI.loadProgress;
`;

export const CUSTOM_HTML_GAME_TEMPLATE = `
// Custom HTML Game Template với Score API
let customGameStartTime = Date.now();
let customScore = 0;
let customLevel = 1;

function initCustomGame() {
  customGameStartTime = Date.now();
  customScore = 0;
  customLevel = 1;
  
  // Load previous progress if available
  const savedProgress = window.loadProgress();
  if (savedProgress) {
    customScore = savedProgress.score || 0;
    customLevel = savedProgress.level || 1;
  }
  
  window.updateProgress(0, customLevel);
}

function updateCustomScore(points) {
  customScore += points;
  window.reportScore(customScore, 100); // Arbitrary max score
  
  // Auto-save progress
  window.saveProgress({
    score: customScore,
    level: customLevel,
    timestamp: Date.now()
  });
}

function completeCustomGame() {
  const timeSpent = Math.floor((Date.now() - customGameStartTime) / 1000);
  window.gameComplete(customScore, timeSpent, {
    level: customLevel,
    gameType: 'custom-html'
  });
}
`;

export const INTERACTIVE_STORY_TEMPLATE = `
// Interactive Story Template for Custom Games
let storyProgress = 0;
let storyChoices = [];
let storyStartTime = Date.now();

function startStory(totalChapters) {
  storyStartTime = Date.now();
  storyProgress = 0;
  storyChoices = [];
  window.updateProgress(0, 1);
}

function makeChoice(choiceId, choiceText) {
  storyChoices.push({
    id: choiceId,
    text: choiceText,
    timestamp: Date.now()
  });
  
  storyProgress++;
  window.updateProgress((storyProgress * 10), storyProgress); // Assuming 10 chapters
}

function completeStory() {
  const timeSpent = Math.floor((Date.now() - storyStartTime) / 1000);
  const engagementScore = Math.min(storyChoices.length * 10, 100);
  
  window.gameComplete(engagementScore, timeSpent, {
    choices: storyChoices,
    chapters: storyProgress,
    engagement: engagementScore
  });
}
`;

/**
 * Tạo script template cho custom game cụ thể
 */
export const generateCustomGameScript = (gameType: 'html' | 'interactive' | 'creative') => {
  const baseAPI = CUSTOM_GAME_API_TEMPLATE;
  
  switch (gameType) {
    case 'html':
      return baseAPI + CUSTOM_HTML_GAME_TEMPLATE;
    case 'interactive':
      return baseAPI + INTERACTIVE_STORY_TEMPLATE;
    case 'creative':
      return baseAPI + `
// Creative Game Template
let creativeStartTime = Date.now();
let creativeActions = 0;
let creativity = 0;

function startCreativeGame() {
  creativeStartTime = Date.now();
  creativeActions = 0;
  creativity = 0;
  window.updateProgress(0, 1);
}

function performCreativeAction(actionType) {
  creativeActions++;
  creativity += Math.random() * 10; // Random creativity boost
  
  const progress = Math.min((creativeActions * 5), 100);
  window.updateProgress(progress, Math.floor(creativeActions / 10) + 1);
}

function finishCreativeGame() {
  const timeSpent = Math.floor((Date.now() - creativeStartTime) / 1000);
  const finalScore = Math.floor(creativity);
  
  window.gameComplete(finalScore, timeSpent, {
    actions: creativeActions,
    creativity: creativity,
    type: 'creative'
  });
}
`;
    default:
      return baseAPI;
  }
};

export default {
  CUSTOM_GAME_API_TEMPLATE,
  CUSTOM_HTML_GAME_TEMPLATE,
  INTERACTIVE_STORY_TEMPLATE,
  generateCustomGameScript
};