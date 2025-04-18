
const wheel = document.querySelector('.wheel');
const spinBtn = document.getElementById('spin-btn');
const resultDiv = document.getElementById('result');

const segments = [
  { text: '10 Điểm', color: '#f1c40f' },
  { text: 'Mất lượt', color: '#e74c3c' }, 
  { text: '20 Điểm', color: '#3498db' },
  { text: 'Thêm lượt', color: '#2ecc71' },
  { text: '50 Điểm', color: '#f39c12' },
  { text: 'Chúc MM Lần Sau', color: '#9b59b6' },
  { text: '100 Điểm', color: '#1abc9c' },
  { text: 'Thử Lại', color: '#7f8c8d' }
];

const numSegments = segments.length;
const segmentAngle = 360 / numSegments;
let currentRotation = 0;
let isSpinning = false;

function createSegments() {
  segments.forEach((segment, index) => {
    const segmentElement = document.createElement('div');
    segmentElement.classList.add('segment');
    
    const rotation = segmentAngle * index;
    const skewY = 90 - segmentAngle;
    
    segmentElement.style.transform = `rotate(${rotation}deg) skewY(-${skewY}deg)`;
    segmentElement.style.backgroundColor = segment.color;
    
    const span = document.createElement('span');
    span.textContent = segment.text;
    span.style.transform = `skewY(${skewY}deg) rotate(${segmentAngle / 2}deg)`;
    
    segmentElement.appendChild(span);
    wheel.appendChild(segmentElement);
  });
}

function spinWheel() {
  if (isSpinning) return;
  
  isSpinning = true;
  spinBtn.disabled = true;
  resultDiv.textContent = 'Đang quay...';
  
  const randomIndex = Math.floor(Math.random() * numSegments);
  const targetRotationMidpoint = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
  const randomExtraSpins = 5;
  const totalRotation = 360 * randomExtraSpins + targetRotationMidpoint;
  const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);
  const finalRotation = totalRotation + randomOffset;
  
  wheel.style.transition = 'transform 4s ease-out';
  wheel.style.transform = `rotate(${finalRotation}deg)`;
  
  currentRotation = finalRotation % 360;
}

wheel.addEventListener('transitionend', () => {
  if (!isSpinning) return;
  
  isSpinning = false;
  spinBtn.disabled = false;
  
  const normalizedRotation = currentRotation < 0 ? currentRotation + 360 : currentRotation;
  const pointerAngle = 270;
  const winningIndex = Math.floor(((360 - normalizedRotation + pointerAngle) % 360) / segmentAngle);
  const finalWinningIndex = (winningIndex + numSegments) % numSegments;
  const finalWinningSegment = segments[finalWinningIndex];
  
  resultDiv.textContent = `Chúc mừng! Bạn nhận được: ${finalWinningSegment.text}`;
}, false);

spinBtn.addEventListener('click', spinWheel);
createSegments();
