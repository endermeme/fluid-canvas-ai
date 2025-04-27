
/**
 * Styles specific to wheel games
 */

export const generateWheelStyles = () => `
  .wheel-container {
    position: relative;
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .wheel {
    transform-origin: center;
    transition: transform 3s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  
  .wheel-segment {
    fill-opacity: 0.8;
    transition: fill-opacity 0.3s;
  }
  
  .wheel-segment:hover {
    fill-opacity: 1;
  }
  
  .segment-text {
    font-weight: bold;
    font-size: 14px;
    fill: #fff;
    pointer-events: none;
    text-anchor: middle;
    dominant-baseline: central;
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
  }
  
  .wheel-pointer {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    z-index: 10;
  }
  
  @media (max-width: 768px) {
    .wheel-container {
      width: 95%;
    }
    
    .segment-text {
      font-size: 12px;
    }
  }
`;
