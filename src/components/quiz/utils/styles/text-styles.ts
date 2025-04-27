
/**
 * Common text styles for all games
 */

export const generateTextStyles = () => `
  .game-text,
  .text-element,
  .question-text,
  .answer-text,
  .card-text,
  .instruction-text {
    text-align: center;
    font-family: Arial, sans-serif;
    line-height: 1.4;
    margin: 0;
    padding: 0;
  }

  .result-display {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    min-height: 60px;
    background-color: rgba(255,255,255,0.8);
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    .result-display {
      font-size: 1.2rem;
      padding: 8px 16px;
    }
  }
`;
