
/**
 * Mô-đun chứa các styles được thêm vào iframe để hỗ trợ trò chơi
 */

/**
 * Style cơ bản và tối ưu cho touch - tập trung vào full screen
 */
export const touchStyles = `
<style>
  /* Full screen base styles */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
    touch-action: manipulation;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #000;
  }
  
  /* Remove any default spacing */
  * {
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  /* Game container full screen */
  #gameContainer, .game-container, .game-area {
    width: 100vw !important;
    height: 100vh !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Canvas full screen */
  canvas {
    width: 100vw !important;
    height: 100vh !important;
    display: block !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    touch-action: none;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Touch optimization */
  .touch-device button,
  .touch-device [role="button"],
  .touch-device input[type="button"],
  .touch-device input[type="submit"],
  .touch-device .clickable {
    min-width: 44px;
    min-height: 44px;
    position: relative;
    z-index: 100;
  }
  
  /* UI overlays */
  .ui-overlay, .score, .controls {
    position: fixed !important;
    z-index: 1000 !important;
    pointer-events: auto;
  }
  
  /* Hide scrollbars */
  ::-webkit-scrollbar {
    display: none;
  }
  
  /* Loading indicator */
  #loading-indicator {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.3s;
  }
  #loading-indicator.hidden {
    opacity: 0;
    pointer-events: none;
  }
  
  /* Mobile specific */
  @media (max-width: 768px) {
    body {
      -webkit-overflow-scrolling: touch;
      -webkit-user-select: none;
      user-select: none;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    .no-touch button:hover,
    .no-touch [role="button"]:hover {
      cursor: pointer;
      opacity: 0.9;
    }
  }
</style>
`;
