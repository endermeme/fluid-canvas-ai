
/**
 * Base styles for all games
 */

export const generateBaseStyles = () => `
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    margin: 0;
    padding: 0;
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: Arial, sans-serif;
    touch-action: manipulation;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
  }
  
  #game-container {
    width: 100%;
    height: 100%;
    max-width: 800px;
    position: relative;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .game-element {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  button, 
  [role="button"],
  .clickable {
    min-width: 44px;
    min-height: 44px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: 500;
    transition: all 0.2s ease;
    user-select: none;
    -webkit-user-select: none;
  }

  @media (max-width: 768px) {
    button, 
    [role="button"],
    input[type="submit"],
    input[type="button"] {
      min-height: 38px;
      padding: 8px 16px;
    }
    
    input, 
    select, 
    textarea {
      font-size: 16px;
    }
  }
`;
