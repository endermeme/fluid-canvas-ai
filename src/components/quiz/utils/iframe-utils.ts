
import { processImages, fixJavaScriptErrors } from './iframe-enhancer';

/**
 * Nâng cấp nội dung iframe - cải thiện với error handling
 * @param content Nội dung HTML gốc
 * @param title Tiêu đề cho trò chơi (không sử dụng)
 * @returns Nội dung HTML đã được nâng cấp
 */
export const enhanceIframeContent = async (content: string, title?: string): Promise<string> => {
  try {
    console.log('Đang xử lý nội dung HTML...');
    
    // Bước 1: Sửa các lỗi JavaScript phổ biến
    let enhancedContent = fixJavaScriptErrors(content);
    
    // Bước 2: Thêm error handling và score communication API
    const enhancementScript = `
<script>
// Error handling cho game
window.addEventListener('error', function(e) {
  console.error('Game Error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);
  e.preventDefault();
});

// Score Communication API
window.gameAPI = {
  // Báo cáo điểm số
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
  
  // Hoàn thành game
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
  
  // Cập nhật tiến trình
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
  },
  
  // Lỗi game
  reportError: function(errorMessage, errorCode) {
    try {
      window.parent.postMessage({
        type: 'GAME_ERROR',
        data: {
          message: errorMessage || 'Unknown error',
          code: errorCode || 'GENERIC_ERROR',
          timestamp: Date.now()
        }
      }, '*');
    } catch (e) {
      console.error('Game Error:', errorMessage);
    }
  }
};

// Thêm shortcuts cho dễ sử dụng
window.reportScore = window.gameAPI.reportScore;
window.gameComplete = window.gameAPI.gameComplete;
window.updateProgress = window.gameAPI.updateProgress;
window.reportError = window.gameAPI.reportError;

// Thông báo load hoàn thành
window.addEventListener('load', function() {
  try {
    window.parent.postMessage({ type: 'GAME_LOADED' }, '*');
  } catch (e) {
    console.log('Game loaded');
  }
});

// Kiểm tra và sửa các lỗi cú pháp cơ bản
document.addEventListener('DOMContentLoaded', function() {
  // Đảm bảo canvas được khởi tạo đúng cách
  const canvas = document.querySelector('canvas');
  if (canvas && !window.context) {
    try {
      window.context = canvas.getContext('2d');
    } catch (e) {
      console.warn('Không thể khởi tạo canvas context:', e);
    }
  }
});
</script>
`;
    
    // Bước 3: Thêm script vào cuối body nếu chưa có
    if (!enhancedContent.includes('window.parent.postMessage') && enhancedContent.includes('</body>')) {
      enhancedContent = enhancedContent.replace('</body>', `${enhancementScript}</body>`);
    } else if (!enhancedContent.includes('</body>')) {
      // Nếu không có thẻ body, thêm vào cuối
      enhancedContent += enhancementScript;
    }
    
    console.log('Xử lý HTML hoàn thành');
    return enhancedContent;
  } catch (error) {
    console.error('Lỗi khi xử lý iframe:', error);
    return content; // Luôn trả về nội dung gốc nếu có lỗi
  }
};
