
export const enhanceIframeContent = (content: string, title?: string): string => {
  // Define a variable for lastTap (needed for double tap prevention)
  const lastTapVariable = 'let lastTap = 0;';
  
  // Add device detection script and touch handling
  const deviceDetectionScript = `
    <script>
      // Device detection
      ${lastTapVariable}
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
      
      // Fix for iOS specific touch delay
      document.addEventListener('touchstart', function() {}, {passive: true});
      
      // Announce device capabilities to console for debugging
      console.log('Device capabilities:', {
        isTouchDevice,
        isMobile,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    </script>
  `;

  const touchStyles = `
    <style>
      /* Touch optimization */
      * {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box;
      }
      
      html, body {
        overscroll-behavior: none;
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
      
      .touch-device [role="button"],
      .touch-device button,
      .touch-device input[type="button"],
      .touch-device .clickable,
      .touch-device a {
        min-width: 44px;
        min-height: 44px;
        padding: 12px;
        margin: 4px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        touch-action: manipulation;
      }
      
      @media (hover: hover) and (pointer: fine) {
        /* Mouse-specific styles */
        .no-touch [role="button"]:hover,
        .no-touch button:hover,
        .no-touch input[type="button"]:hover,
        .no-touch .clickable:hover,
        .no-touch a:hover {
          opacity: 0.8;
        }
      }
      
      /* Prevent text selection during touch */
      [role="button"],
      button,
      .no-select,
      .clickable {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      
      /* Touch feedback */
      .touch-device [role="button"]:active,
      .touch-device button:active,
      .touch-device input[type="button"]:active,
      .touch-device .clickable:active {
        transform: scale(0.97);
        transition: transform 0.1s;
      }
      
      /* Orientation-specific adjustments */
      @media screen and (orientation: portrait) {
        .landscape-only {
          display: none !important;
        }
      }
      
      @media screen and (orientation: landscape) {
        .portrait-only {
          display: none !important;
        }
      }
      
      /* Responsive font sizes */
      html {
        font-size: calc(14px + 0.5vw);
      }
      
      /* Responsive container sizing */
      .game-container {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    </style>
  `;

  // Insert viewport meta tag for proper mobile rendering
  const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=cover">';

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
  } else if (!enhancedContent.includes('<title>')) {
    enhancedContent = enhancedContent.replace('</head>', `<title>Interactive Game</title></head>`);
  }

  // Add body class for enhancing touch handling if not already present
  if (!enhancedContent.includes('class="game-container"')) {
    enhancedContent = enhancedContent.replace('<body>', '<body class="game-container">');
  }

  return enhancedContent;
};
