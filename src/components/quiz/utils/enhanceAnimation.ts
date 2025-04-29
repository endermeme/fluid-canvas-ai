
/**
 * Tiện ích nâng cao các animation trong iframe
 */

/**
 * Thêm các scripts và styles cần thiết để tăng cường animation trong iframe
 * @param originalHtml Nội dung HTML ban đầu
 * @returns Nội dung HTML đã được tăng cường
 */
export const enhanceAnimations = (originalHtml: string): string => {
  // Kiểm tra nếu HTML đã có các script animation
  const hasGSAPScript = originalHtml.includes('gsap');
  const hasAnimationScript = originalHtml.includes('animateElement') || originalHtml.includes('animation:');
  
  // Script tăng cường animation mà không ảnh hưởng đến các animation đã có
  const enhancementScript = `
    <script>
      // Utility to ensure animations run smoothly
      document.addEventListener('DOMContentLoaded', function() {
        // Notify parent that the game is loaded and ready for display
        if (window.parent) {
          window.parent.postMessage({ type: 'GAME_LOADED' }, '*');
        }
        
        // Force hardware acceleration for smoother animations
        document.body.style.transform = 'translateZ(0)';
        
        // Helper for adding animations to elements
        window.animateElement = function(selector, animationClass) {
          const elements = document.querySelectorAll(selector);
          if (elements) {
            for (const el of elements) {
              el.classList.add(animationClass);
            }
          }
        };
        
        // Fix for iOS Safari animation issues
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          const styleEl = document.createElement('style');
          styleEl.textContent = '* { -webkit-transform: translateZ(0); transform: translateZ(0); }';
          document.head.appendChild(styleEl);
        }

        // Add touch events for better mobile experience
        const touchify = function() {
          const clickableElements = document.querySelectorAll('button, a, [role="button"], [tabindex]');
          clickableElements.forEach(el => {
            if (!el._touchified) {
              el.addEventListener('touchstart', () => {
                el.classList.add('touch-active');
              }, {passive: true});
              
              el.addEventListener('touchend', () => {
                el.classList.remove('touch-active');
              }, {passive: true});
              
              el._touchified = true;
            }
          });
        };
        
        // Run touchify initially and when content changes
        touchify();
        const observer = new MutationObserver(touchify);
        observer.observe(document.body, { childList: true, subtree: true });
      });
    </script>
    
    <style>
      /* Animation utilities */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes slide-in {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      .fade-in { animation: fadeIn 0.5s forwards; }
      .pulse { animation: pulse 2s infinite; }
      .bounce { animation: bounce 2s infinite; }
      .spin { animation: spin 2s infinite linear; }
      .slide-in { animation: slide-in 0.5s forwards; }
      
      /* Touch feedback */
      .touch-active {
        opacity: 0.7;
        transform: scale(0.98);
        transition: opacity 0.2s, transform 0.2s;
      }

      /* Fix for smooth animations with CSS transitions */
      * {
        transition-duration: 0.3s;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        will-change: auto;
      }
      
      /* Fix animation performance */
      .animate-this {
        will-change: transform, opacity;
      }
    </style>
  `;
  
  // Tích hợp script vào HTML
  let enhancedHtml = originalHtml;
  if (!hasAnimationScript) {
    // Insert before closing head tag if possible
    if (enhancedHtml.includes('</head>')) {
      enhancedHtml = enhancedHtml.replace('</head>', enhancementScript + '</head>');
    } else if (enhancedHtml.includes('<body')) {
      // Or insert after opening body tag
      enhancedHtml = enhancedHtml.replace('<body', enhancementScript + '<body');
    } else {
      // Or append at the beginning for simple documents
      enhancedHtml = enhancementScript + enhancedHtml;
    }
  }
  
  return enhancedHtml;
};

/**
 * Tối ưu hiệu suất animation cho các game phức tạp
 * @param originalContent Nội dung game gốc
 * @returns Nội dung đã được tối ưu
 */
export const optimizeGameAnimations = (originalContent: string): string => {
  // Thêm các attribute cần thiết vào thẻ iframe
  let optimizedContent = originalContent
    .replace('<iframe', '<iframe allowfullscreen loading="eager" allow="autoplay; fullscreen; web-animations"')
    .replace('allow-scripts', 'allow-scripts allow-same-origin allow-presentation');
    
  // Thêm cải tiến animation
  optimizedContent = enhanceAnimations(optimizedContent);
  
  return optimizedContent;
};
