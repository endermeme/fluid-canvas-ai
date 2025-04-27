
/**
 * General helper functions for all game types
 */

export const gameHelpers = {
  // Display result with animation
  displayResult: function(result: any) {
    try {
      const resultText = typeof result === 'object' ? 
        (result.label || result.value || result.text || JSON.stringify(result)) : 
        result.toString();
      
      const resultDisplay = document.querySelector('.result-display') || 
                           document.querySelector('#result') ||
                           document.querySelector('[data-result]');
      
      if (resultDisplay instanceof HTMLElement) {
        resultDisplay.textContent = resultText;
        resultDisplay.style.animation = 'none';
        setTimeout(() => {
          resultDisplay.style.animation = 'scale-in 0.5s forwards';
        }, 10);
      } else {
        const newResultDisplay = document.createElement('div');
        newResultDisplay.className = 'result-display';
        newResultDisplay.textContent = resultText;
        newResultDisplay.style.animation = 'scale-in 0.5s forwards';
        
        const container = document.querySelector('#game-container') || document.body;
        container.appendChild(newResultDisplay);
      }
      
      console.log('Displaying result:', resultText);
      return true;
    } catch (err) {
      console.error('Error displaying result:', err);
      return false;
    }
  }
};
