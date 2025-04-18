const wheel = document.querySelector('.wheel');
const spinBtn = document.getElementById('spin-btn');
const resultDiv = document.getElementById('result');

// --- Cấu hình các phần thưởng ---
const segments = [
    { text: '10 Điểm', color: '#f1c40f' }, // Vàng
    { text: 'Mất lượt', color: '#e74c3c' }, // Đỏ
    { text: '20 Điểm', color: '#3498db' }, // Xanh dương
    { text: 'Thêm lượt', color: '#2ecc71' }, // Xanh lá
    { text: '50 Điểm', color: '#f39c12' }, // Cam
    { text: 'Chúc MM Lần Sau', color: '#9b59b6' }, // Tím
    { text: '100 Điểm', color: '#1abc9c' }, // Xanh ngọc
    { text: 'Thử Lại', color: '#7f8c8d' }  // Xám
];

const numSegments = segments.length;
const segmentAngle = 360 / numSegments;
let currentRotation = 0; // Lưu góc quay hiện tại để quay tiếp
let isSpinning = false;

// --- Tạo các phần tử segment ---
function createSegments() {
    segments.forEach((segment, index) => {
        const segmentElement = document.createElement('div');
        segmentElement.classList.add('segment');

        // Tính góc quay cho segment này (quay quanh tâm)
        const rotation = segmentAngle * index;

        // Tính góc nghiêng để tạo hình rẻ quạt
        // Góc nghiêng cần thiết để cạnh của segment thẳng hàng với tâm
        // Điều chỉnh skewY dựa trên segmentAngle
        const skewY = 90 - segmentAngle;

        segmentElement.style.transform = `rotate(${rotation}deg) skewY(-${skewY}deg)`;
        segmentElement.style.backgroundColor = segment.color;

        const span = document.createElement('span');
        span.textContent = segment.text;
        // Điều chỉnh xoay của chữ để nó gần như thẳng đứng hoặc hướng ra ngoài
        span.style.transform = `skewY(${skewY}deg) rotate(${segmentAngle / 2}deg)`;

        segmentElement.appendChild(span);
        wheel.appendChild(segmentElement);
    });
}

// --- Hàm quay vòng quay ---
function spinWheel() {
    if (isSpinning) return; // Không cho quay khi đang quay

    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.textContent = 'Đang quay...';

    // Chọn ngẫu nhiên một segment trúng thưởng
    const randomIndex = Math.floor(Math.random() * numSegments);
    const winningSegment = segments[randomIndex];

    // Tính toán góc quay đích
    // Mục tiêu: Đưa *giữa* segment trúng thưởng đến vị trí mũi tên (ví dụ: 270 độ hoặc -90 độ nếu mũi tên ở trên cùng)
    // Góc của điểm giữa segment trúng thưởng: (randomIndex + 0.5) * segmentAngle
    // Góc cần quay để mũi tên chỉ vào đó (quay ngược chiều kim đồng hồ):
    const targetRotationMidpoint = 360 - (randomIndex * segmentAngle + segmentAngle / 2);

    // Thêm nhiều vòng quay để tạo hiệu ứng (ví dụ: 5 vòng)
    const randomExtraSpins = 5; // Số vòng quay thêm
    const totalRotation = 360 * randomExtraSpins + targetRotationMidpoint;

    // Thêm một chút ngẫu nhiên nhỏ vào góc cuối cùng để không phải lúc nào cũng dừng chính giữa
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6); // Ngẫu nhiên trong khoảng +/- 30% chiều rộng segment
    const finalRotation = totalRotation + randomOffset;

    // Áp dụng góc quay mới, cộng dồn với góc quay hiện tại
    // Không cần cộng dồn nếu dùng absolute rotation như trên
    // currentRotation += finalRotation; // Nếu muốn cộng dồn góc

    wheel.style.transition = 'transform 4s ease-out'; // Đảm bảo transition được set trước khi quay
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    // Lưu lại góc quay cuối cùng (chuẩn hóa về 0-360) để xử lý lần quay tiếp theo nếu cần
    currentRotation = finalRotation % 360;
}

// --- Xử lý sau khi quay xong ---
wheel.addEventListener('transitionend', () => {
    if (!isSpinning) return; // Chỉ xử lý khi kết thúc lần quay thực sự

    isSpinning = false;
    spinBtn.disabled = false;

    // Chuẩn hóa góc quay về khoảng 0-360 độ
    const normalizedRotation = currentRotation < 0 ? currentRotation + 360 : currentRotation;

    // Xác định segment trúng thưởng dựa trên góc quay cuối cùng
    // Góc của mũi tên (ví dụ: 270 độ nếu ở trên cùng)
    const pointerAngle = 270;
    const winningIndex = Math.floor(((360 - normalizedRotation + pointerAngle) % 360) / segmentAngle);

    // Đảm bảo index không bị lỗi do làm tròn số float
    const finalWinningIndex = (winningIndex + numSegments) % numSegments;

    const finalWinningSegment = segments[finalWinningIndex];

    resultDiv.textContent = `Chúc mừng! Bạn nhận được: ${finalWinningSegment.text}`;

    // Optional: Reset transition để góc quay được cập nhật ngay lập tức mà không có animation
    // Điều này quan trọng nếu bạn muốn lần quay tiếp theo bắt đầu từ vị trí dừng hiện tại
    // wheel.style.transition = 'none';
    // wheel.style.transform = `rotate(${normalizedRotation}deg)`;
    // // Trigger reflow để trình duyệt áp dụng thay đổi ngay lập tức
    // wheel.offsetHeight;
    // // Đặt lại transition cho lần quay sau
    // wheel.style.transition = 'transform 4s ease-out';

    // Cập nhật lại currentRotation nếu cần dùng cho lần quay sau (nếu không reset)
    // currentRotation = normalizedRotation;

}, false);

// --- Gắn sự kiện click cho nút quay ---
spinBtn.addEventListener('click', spinWheel);

// --- Khởi tạo vòng quay ---
createSegments();

// --- Thêm Utility gọi về parent app theo yêu cầu từ CUSTOM_GAME_IMPLEMENTATION.md ---
function sendGameStats(stats) {
    if (window.parent && typeof window.parent.sendGameStats === 'function') {
        window.parent.sendGameStats(stats);
    }
    
    // Fallback nếu parent không có hàm sendGameStats
    if (window.sendGameStats && typeof window.sendGameStats === 'function') {
        window.sendGameStats(stats);
    }
    
    console.log('Game stats:', stats);
} 