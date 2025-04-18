
import { MiniGame, GameGenerationOptions } from './types';
import { parseGeminiResponse } from './responseParser';

export const tryGeminiGeneration = async (
  api: any | null,
  prompt: string,
  options: GameGenerationOptions = {}
): Promise<MiniGame | null> => {
  try {
    console.log("Starting game generation with prompt:", prompt);
    
    // This is a simplified implementation
    // In a real app, this would call an actual API
    const demoResponse = `
\`\`\`html
<div id="game-container">
  <h1>Interactive Game Demo</h1>
  <p>This is a placeholder for the game about: ${prompt}</p>
  <div id="game-area" class="game-area">
    <button id="start-button">Start Game</button>
    <div id="score-display">Score: <span id="score">0</span></div>
  </div>
</div>
\`\`\`

\`\`\`css
body {
  font-family: 'Arial', sans-serif;
  text-align: center;
  background-color: #f0f0f0;
}

.game-area {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
}

button:hover {
  background-color: #45a049;
}

#score-display {
  font-size: 18px;
  margin-top: 20px;
}
\`\`\`

\`\`\`js
document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start-button');
  const scoreDisplay = document.getElementById('score');
  let score = 0;
  
  startButton.addEventListener('click', function() {
    score += 10;
    scoreDisplay.textContent = score;
    alert('Game started! Score increased.');
  });
});
\`\`\`
`;

    // Parse the mock response
    const game = parseGeminiResponse(demoResponse, prompt);
    
    return {
      title: game.title || `Game about ${prompt}`,
      description: game.description,
      content: game.content
    };
  } catch (error) {
    console.error("Error generating game:", error);
    return null;
  }
};
