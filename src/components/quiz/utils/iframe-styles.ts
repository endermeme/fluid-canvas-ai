
/**
 * Mô-đun chứa các styles được thêm vào iframe để hỗ trợ trò chơi
 */

/**
 * Style cơ bản và tối ưu cho touch
 */
export const touchStyles = `
<style>
  /* Base styles */
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    touch-action: manipulation;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
  }
  
  /* Touch optimization */
  * {
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
  }
  
  /* Better buttons for touch */
  .touch-device button,
  .touch-device [role="button"],
  .touch-device input[type="button"],
  .touch-device input[type="submit"],
  .touch-device .clickable {
    min-width: 44px;
    min-height: 44px;
  }
  
  /* Better canvas scaling */
  canvas {
    touch-action: none;
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
  
  /* Loading indicator styles */
  #loading-indicator {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.8);
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
  
  @media (hover: hover) and (pointer: fine) {
    /* Mouse-specific styles */
    .no-touch button:hover,
    .no-touch [role="button"]:hover {
      cursor: pointer;
      opacity: 0.9;
    }
  }

  /* Debugging styles */
  .debug-info {
    position: fixed;
    top: 0;
    right: 0;
    background: rgba(0,0,0,0.7);
    color: #fff;
    font-size: 12px;
    padding: 5px;
    max-width: 300px;
    max-height: 150px;
    overflow: auto;
    z-index: 9999;
    font-family: monospace;
  }

  /* Ensure all the content is rendered properly */
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #ffffff;
  }
</style>
`;
