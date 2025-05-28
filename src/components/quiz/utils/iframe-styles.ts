
/**
 * Mô-đun chứa các styles được thêm vào iframe để hỗ trợ trò chơi
 */

/**
 * Style cơ bản và tối ưu cho game - tập trung vào full screen
 */
export const touchStyles = `
<style>
  /* Reset và full screen cơ bản */
  *, *::before, *::after {
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }
  
  html, body {
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
    touch-action: manipulation !important;
    font-family: Arial, sans-serif !important;
    background: #000 !important;
    position: relative !important;
  }
  
  /* Game container full screen */
  #gameArea, .game-area, .game-container {
    width: 100vw !important;
    height: 100vh !important;
    position: relative !important;
    top: 0 !important;
    left: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }
  
  /* Touch optimization */
  .touch-device button,
  .touch-device [role="button"],
  .touch-device input[type="button"],
  .touch-device input[type="submit"],
  .touch-device .clickable {
    min-width: 44px !important;
    min-height: 44px !important;
    position: relative;
    z-index: 100;
    cursor: pointer;
  }
  
  /* UI overlays */
  .ui-overlay, .score, .controls {
    position: fixed !important;
    z-index: 1000 !important;
    pointer-events: auto !important;
  }
  
  /* Hide scrollbars */
  ::-webkit-scrollbar {
    display: none !important;
  }
  
  /* Mobile specific */
  @media (max-width: 768px) {
    body {
      -webkit-overflow-scrolling: touch !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }
    
    .touch-device {
      -webkit-tap-highlight-color: transparent !important;
    }
  }

  /* Desktop hover effects */
  @media (hover: hover) and (pointer: fine) {
    .no-touch button:hover,
    .no-touch [role="button"]:hover {
      cursor: pointer !important;
      opacity: 0.9 !important;
    }
  }
  
  /* Prevent text selection during game */
  * {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
</style>
`;
