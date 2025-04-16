
import React, { useEffect, useRef } from 'react';

const LuckyWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultTextRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const spinButton = document.getElementById('spinButton');
    const resultText = resultTextRef.current;
    
    let wheelRadius;
    let angle = 0;
    let spinSpeed = 0;
    let prizes = [
      "Small Gift", 
      "Try Again", 
      "Free Coffee", 
      "Discount 10%", 
      "Mystery Box", 
      "Discount 20%", 
      "Free Dessert", 
      "Big Prize!"
    ];
    let numPrizes = prizes.length;
    let isSpinning = false;
    
    function init() {
      wheelRadius = canvas.width / 2 - 20;
      drawWheel();
    }
    
    function drawWheel() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let centerX = canvas.width / 2;
      let centerY = canvas.height / 2;
      
      for (let i = 0; i < numPrizes; i++) {
        let startAngle = i * (2 * Math.PI / numPrizes) + angle;
        let endAngle = (i + 1) * (2 * Math.PI / numPrizes) + angle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
        ctx.closePath();
        
        // Color alternating
        ctx.fillStyle = i % 2 === 0 ? '#e0e0e0' : '#f8f8f8';
        ctx.fill();
        ctx.stroke();
        
        // Text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + (Math.PI / numPrizes));
        ctx.fillStyle = '#000';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(prizes[i], wheelRadius / 2, 10);
        ctx.restore();
      }
      
      // Draw pointer
      ctx.beginPath();
      ctx.moveTo(centerX + wheelRadius + 10, centerY);
      ctx.lineTo(centerX + wheelRadius + 20, centerY - 10);
      ctx.lineTo(centerX + wheelRadius + 20, centerY + 10);
      ctx.closePath();
      ctx.fillStyle = 'red';
      ctx.fill();
    }
    
    function update() {
      if (isSpinning) {
        angle += spinSpeed;
        spinSpeed *= 0.99; // Deceleration
        if (spinSpeed < 0.005) {
          spinSpeed = 0;
          isSpinning = false;
          determinePrize();
        }
      }
    }
    
    function render() {
      drawWheel();
    }
    
    function gameLoop() {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }
    
    function spinWheel() {
      if (!isSpinning) {
        spinSpeed = Math.random() * 0.3 + 0.15; // Random initial speed
        isSpinning = true;
        if (resultText) {
          resultText.textContent = "Spinning...";
        }
      }
    }
    
    function determinePrize() {
      let winningAngle = angle % (2 * Math.PI);
      let prizeIndex = Math.floor(numPrizes * (winningAngle / (2 * Math.PI)));
      prizeIndex = (numPrizes - prizeIndex - 1 + numPrizes) % numPrizes; // Adjusted for correct index
      
      if (resultText) {
        resultText.textContent = "You won: " + prizes[prizeIndex];
      }
    }
    
    // Add event listener to spin button
    if (spinButton) {
      spinButton.addEventListener('click', spinWheel);
    }
    
    init();
    gameLoop();
    
    // Cleanup function
    return () => {
      if (spinButton) {
        spinButton.removeEventListener('click', spinWheel);
      }
    };
  }, []);
  
  return (
    <div className="container">
      <h1>Vòng Quay May Mắn (Lucky Wheel)</h1>
      <h2>Spin to Win!</h2>
      
      <div className="game-area">
        <canvas 
          ref={canvasRef} 
          id="wheelCanvas" 
          width="400" 
          height="400"
          className="wheel-canvas"
        ></canvas>
        
        <div>
          <button id="spinButton">Spin the Wheel</button>
        </div>
        
        <div id="resultText" ref={resultTextRef} className="result-text">
          Click Spin to start!
        </div>
      </div>
      
      <style jsx>{`
        .container {
          width: 100%; 
          max-width: 800px; 
          margin: 0 auto; 
          font-family: sans-serif; 
          text-align: center;
        }
        
        .game-area {
          background-color: #f0f0f0; 
          padding: 20px; 
          border-radius: 8px; 
          margin-top: 20px;
        }
        
        #wheelCanvas {
          border: 1px solid #ccc; 
          margin-bottom: 20px;
        }
        
        #spinButton {
          padding: 10px 20px; 
          font-size: 16px; 
          background-color: #4CAF50; 
          color: white; 
          border: none; 
          border-radius: 5px; 
          cursor: pointer;
        }
        
        #spinButton:hover {
          background-color: #3e8e41;
        }
        
        #resultText {
          font-size: 18px; 
          margin-top: 10px;
        }
        
        @media (max-width: 600px) {
          #wheelCanvas {
            width: 300px; 
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default LuckyWheel;
