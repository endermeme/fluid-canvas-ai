
export const setupIframe = (iframe: HTMLIFrameElement, content: string): void => {
  if (!iframe) return;
  
  // Set content
  iframe.srcdoc = content;
  
  // Handle load event
  iframe.onload = () => {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDocument) {
      console.error('Cannot access iframe document');
      return;
    }

    // Rerun scripts to ensure execution
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
