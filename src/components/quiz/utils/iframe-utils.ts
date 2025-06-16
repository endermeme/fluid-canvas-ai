
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
    
    // Bước 2: Thêm error handling cho JavaScript
    const errorHandlingScript = `
<script>
// Error handling cho game
window.addEventListener('error', function(e) {
  console.error('Game Error:', e.error);
  // Không hiển thị alert để tránh làm phiền người dùng
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);
  e.preventDefault();
});

// Thông báo load hoàn thành
window.addEventListener('load', function() {
  try {
    window.parent.postMessage({ type: 'GAME_LOADED' }, '*');
  } catch (e) {
    console.log('Game loaded');
  }
});
</script>
`;
    
    // Bước 3: Thêm script vào cuối body nếu chưa có
    if (!enhancedContent.includes('window.parent.postMessage') && enhancedContent.includes('</body>')) {
      enhancedContent = enhancedContent.replace('</body>', `${errorHandlingScript}</body>`);
    } else if (!enhancedContent.includes('</body>')) {
      // Nếu không có thẻ body, thêm vào cuối
      enhancedContent += errorHandlingScript;
    }
    
    console.log('Xử lý HTML hoàn thành');
    return enhancedContent;
  } catch (error) {
    console.error('Lỗi khi xử lý iframe:', error);
    return content; // Luôn trả về nội dung gốc nếu có lỗi
  }
};
