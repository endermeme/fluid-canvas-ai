export const enhanceIframeContent = (content: string, title?: string): string => {
  // Add device detection script and touch handling
  const deviceDetectionScript = `
    <script>
      // Device detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      document.documentElement.classList.add(isTouchDevice ? 'touch-device' : 'no-touch');
      document.documentElement.classList.add(isMobile ? 'mobile' : 'desktop');
      
      // Prevent zoom on double tap
      document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          e.preventDefault();
        }
        lastTap = now;
      }, { passive: false });
      
      // Prevent unwanted scrolling/zooming
      document.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) {
          e.preventDefault();
        }
      }, { passive: false });
    </script>
  `;

  const touchStyles = `
    <style>
      /* Touch optimization */
      * {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      .touch-device [role="button"],
      .touch-device button,
      .touch-device input[type="button"],
      .touch-device .clickable {
        min-width: 44px;
        min-height: 44px;
        padding: 12px;
      }
      
      @media (hover: hover) and (pointer: fine) {
        /* Mouse-specific styles */
        .no-touch [role="button"]:hover,
        .no-touch button:hover {
          opacity: 0.8;
        }
      }
      
      /* Prevent text selection during touch */
      [role="button"],
      button,
      .no-select {
        user-select: none;
        -webkit-user-select: none;
      }
    </style>
  `;

  // Insert viewport meta tag for proper mobile rendering
  const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';

  // Insert the enhancements into the content
  let enhancedContent = content;
  
  if (!enhancedContent.includes('<head>')) {
    enhancedContent = enhancedContent.replace(/<html[^>]*>/, '$&<head><meta charset="UTF-8"></head>');
  }
  
  // Add viewport meta
  if (!enhancedContent.includes('viewport')) {
    enhancedContent = enhancedContent.replace('</head>', `${viewportMeta}</head>`);
  }
  
  // Add device detection and touch handling
  enhancedContent = enhancedContent.replace('</head>', `${touchStyles}${deviceDetectionScript}</head>`);

  // Update title if provided
  if (title && !enhancedContent.includes('<title>')) {
    enhancedContent = enhancedContent.replace('</head>', `<title>${title}</title></head>`);
  }

  return enhancedContent;
};
