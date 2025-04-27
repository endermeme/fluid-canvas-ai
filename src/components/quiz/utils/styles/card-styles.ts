
/**
 * Styles for card-based games
 */

export const generateCardStyles = () => `
  .card {
    perspective: 1000px;
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }

  .card-front,
  .card-back {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .word-wrap {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
`;
