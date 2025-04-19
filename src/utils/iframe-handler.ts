
/**
 * Module quản lý và tối ưu hóa iframe
 */

/**
 * Thiết lập iframe với nội dung và xử lý các sự kiện
 */
export const setupIframe = (iframe: HTMLIFrameElement, content: string): void => {
  if (!iframe) return;
  
  // Thiết lập nội dung
  iframe.srcdoc = content;
  
  // Xử lý sự kiện load
  iframe.onload = () => {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDocument) {
      console.error('Cannot access iframe document');
      return;
    }

    // Chạy lại scripts để đảm bảo thực thi
    const scripts = iframeDocument.getElementsByTagName('script');
    Array.from(scripts).forEach(oldScript => {
      const newScript = iframeDocument.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  };
};

/**
 * Thêm các công cụ debug vào iframe
 */
export const injectDebugUtils = (content: string): string => {
  const debugScript = `
<script>
  window.onerror = function(msg, url, line, col, error) {
    console.error('Game error:', { msg, line, col });
    return true;
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Game initialized');
  });
</script>
</body>`;

  return content.replace('</body>', debugScript);
};

/**
 * Thêm responsive hooks vào iframe
 */
export const addResponsiveHooks = (content: string): string => {
  const resizeScript = `
<script>
  // Tự động điều chỉnh kích thước canvas
  function resizeCanvases() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const ratio = window.devicePixelRatio || 1;
      
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(ratio, ratio);
        }
      }
    });
  }
  
  window.addEventListener('resize', resizeCanvases);
  document.addEventListener('DOMContentLoaded', resizeCanvases);
</script>
</body>`;

  return content.replace('</body>', resizeScript);
};
