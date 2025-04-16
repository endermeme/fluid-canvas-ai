
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
const resultDisplay = document.getElementById('result-display');

const wheelOptions = [
  "Win $10", "Lose", "Win $5", "Extra Spin",
  "Win $2", "Lose", "Win $1", "Free Try"
];

const wheelColors = [
  "#e74c3c", "#3498db", "#2ecc71", "#f39c12",
  "#9b59b6", "#1abc9c", "#d35400", "#34495e"
];

let rotationAngle = 0;
let spinning = false;
let spinTimeout = null;

function init() {
  drawWheel();
  spinButton.addEventListener('click', handleSpin);
}

function drawWheel() {
  const wheelRadius = canvas.width / 2;
  const centerX = wheelRadius;
  const centerY = wheelRadius;
  const arc = Math.PI * 2 / wheelOptions.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < wheelOptions.length; i++) {
    const angle = i * arc + rotationAngle;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, wheelRadius, angle, angle + arc, false);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = wheelColors[i % wheelColors.length];
    ctx.fill();
    ctx.closePath();
    
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-serif';
    ctx.translate(
      centerX + Math.cos(angle + arc / 2) * wheelRadius / 2,
      centerY + Math.sin(angle + arc / 2) * wheelRadius / 2
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(wheelOptions[i], -ctx.measureText(wheelOptions[i]).width / 2, 0);
    ctx.restore();
  }

  // Draw pointer
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(centerX + wheelRadius + 10, centerY);
  ctx.lineTo(centerX + wheelRadius + 20, centerY - 10);
  ctx.lineTo(centerX + wheelRadius + 20, centerY + 10);
  ctx.closePath();
  ctx.fill();
}

function spinWheel(duration) {
  const start = performance.now();
  const animationSpeed = 0.01; // Adjust for smoother spin

  function animate(time) {
    const timeFraction = (time - start) / duration;
    
    if (timeFraction < 1) {
      rotationAngle += animationSpeed * (1 - timeFraction); //Ease out effect
      drawWheel();
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      rotationAngle %= (2 * Math.PI);
      drawWheel();
      determineResult();
    }
  }

  requestAnimationFrame(animate);
}

function handleSpin() {
  if (spinning) return;
  
  spinning = true;
  resultDisplay.textContent = "";
  spinButton.disabled = true;
  spinWheel(3000); // 3 seconds spin duration
}

function determineResult() {
  const winningAngle = rotationAngle % (2 * Math.PI);
  const arc = Math.PI * 2 / wheelOptions.length;
  let winningIndex = wheelOptions.length - 1 - Math.floor(winningAngle / arc);
  
  if (winningIndex < 0) winningIndex = 0;
  
  const result = wheelOptions[winningIndex];
  resultDisplay.textContent = "You landed on: " + result;
  spinButton.disabled = false;
}

init();
