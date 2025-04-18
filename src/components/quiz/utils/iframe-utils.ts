
/**
 * Enhances the content for iframe embedding
 */
export function enhanceIframeContent(content: string, title?: string): string {
  if (!content) return '';
  
  let enhancedContent = content;
  
  // Add message handling to the content
  if (!enhancedContent.includes('window.parent.postMessage')) {
    const scriptToAdd = `
      <script>
        // Add communication with parent frame
        function sendMessageToParent(type, data) {
          try {
            window.parent.postMessage({
              type: type,
              payload: data
            }, '*');
          } catch (e) {
            console.error('Failed to send message to parent:', e);
          }
        }
        
        // Report game stats to parent
        function reportGameStats(stats) {
          sendMessageToParent('gameStats', stats);
        }
        
        // Listen for messages from parent
        window.addEventListener('message', function(event) {
          if (event.data && event.data.type === 'command') {
            console.log('Received command from parent:', event.data.payload);
            // Handle commands from parent frame
          }
        });
      </script>
    `;
    
    enhancedContent = enhancedContent.replace('</body>', `${scriptToAdd}</body>`);
  }
  
  // Set title if provided
  if (title && !enhancedContent.includes('<title>')) {
    enhancedContent = enhancedContent.replace('<head>', `<head><title>${title}</title>`);
  }
  
  return enhancedContent;
}
