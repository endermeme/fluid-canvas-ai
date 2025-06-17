import { processImages } from './iframe-enhancer';

/**
 * Nâng cấp nội dung iframe - đơn giản hóa hoàn toàn
 * @param content Nội dung HTML gốc
 * @param title Tiêu đề cho trò chơi (không sử dụng)
 * @returns Nội dung HTML đã được nâng cấp
 */
export const enhanceIframeContent = async (content: string, title?: string): Promise<string> => {
  try {
    // Chỉ thêm thông báo load hoàn thành nếu chưa có
    if (!content.includes('window.parent.postMessage') && content.includes('</body>')) {
      const notifyScript = `
<script>
  window.addEventListener('load', function() {
    window.parent.postMessage({ type: 'GAME_LOADED' }, '*');
  });
</script>
`;
      return content.replace('</body>', `${notifyScript}</body>`);
    }
    
    return content;
  } catch (error) {
    console.error('Lỗi khi xử lý iframe:', error);
    return content; // Luôn trả về nội dung gốc nếu có lỗi
  }
};
