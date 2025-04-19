
/**
 * Iframe handling utilities
 */

/**
 * Create and setup an iframe
 */
export const createIframe = (containerId: string, sandboxOptions: string[] = []): HTMLIFrameElement => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container with id "${containerId}" not found`);
  
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  
  // Default sandbox options for security
  const defaultSandboxOptions = [
    'allow-scripts',
    'allow-forms',
    'allow-modals',
    'allow-popups',
    'allow-same-origin'
  ];
  
  const finalSandboxOptions = [...defaultSandboxOptions, ...sandboxOptions];
  iframe.setAttribute('sandbox', finalSandboxOptions.join(' '));
  
  container.innerHTML = '';
  container.appendChild(iframe);
  
  return iframe;
};

/**
 * Set HTML content to an iframe
 */
export const setIframeContent = (iframe: HTMLIFrameElement, htmlContent: string): void => {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) throw new Error('Cannot access iframe document');
    
    doc.open();
    doc.write(htmlContent);
    doc.close();
  } catch (error) {
    console.error('Error setting iframe content:', error);
  }
};

/**
 * Reset iframe content
 */
export const resetIframe = (iframe: HTMLIFrameElement): void => {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    
    doc.open();
    doc.write('');
    doc.close();
  } catch (error) {
    console.error('Error resetting iframe:', error);
  }
};

/**
 * Inject debug utilities into iframe
 */
export const injectDebugUtils = (iframe: HTMLIFrameElement): void => {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    
    const script = doc.createElement('script');
    script.textContent = `
      // Override console methods to also log to parent window
      const originalConsole = { ...console };
      
      console.log = (...args) => {
        originalConsole.log(...args);
        window.parent.postMessage({ type: 'console', method: 'log', args }, '*');
      };
      
      console.error = (...args) => {
        originalConsole.error(...args);
        window.parent.postMessage({ type: 'console', method: 'error', args }, '*');
      };
      
      console.warn = (...args) => {
        originalConsole.warn(...args);
        window.parent.postMessage({ type: 'console', method: 'warn', args }, '*');
      };
      
      // Add error reporting
      window.addEventListener('error', (event) => {
        window.parent.postMessage({ 
          type: 'error', 
          message: event.message,
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.toString()
        }, '*');
      });
      
      // Report loaded state
      window.addEventListener('load', () => {
        window.parent.postMessage({ type: 'status', status: 'loaded' }, '*');
      });
    `;
    
    doc.head.appendChild(script);
  } catch (error) {
    console.error('Error injecting debug utils:', error);
  }
};

/**
 * Setup message listener for iframe communication
 */
export const setupIframeMessageListener = (
  callback: (message: any) => void
): () => void => {
  const listener = (event: MessageEvent) => {
    // Basic security check
    if (typeof event.data !== 'object' || !event.data.type) return;
    
    callback(event.data);
  };
  
  window.addEventListener('message', listener);
  
  // Return function to remove listener
  return () => window.removeEventListener('message', listener);
};
