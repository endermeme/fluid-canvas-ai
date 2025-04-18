/**
 * File mẫu để hệ thống parse code từ API Gemini
 * Đây là định dạng kết hợp HTML, CSS và JS trong một file JavaScript
 */

// HTML content
const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vòng Quay May Mắn</title>
</head>
<body>
    <div class="wheel-container">
        <div class="pointer">▼</div> <!-- Hoặc dùng hình ảnh mũi tên -->
        <div class="wheel">
        </div>

        <button id="spin-btn">Quay!</button>
        <div id="result"></div>
    </div>
</body>
</html>
`;

// CSS content
const cssContent = `
body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
    overflow: hidden; /* Tránh scrollbar khi quay */
}

.wheel-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pointer {
    position: absolute;
    top: -30px; /* Điều chỉnh vị trí mũi tên */
    left: 50%;
    transform: translateX(-50%);
    font-size: 30px;
    color: #e74c3c; /* Màu đỏ */
    z-index: 10;
    /* Animation nhỏ cho mũi tên nếu muốn */
    /* animation: bounce 1s infinite ease-in-out; */
}

/* @keyframes bounce {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, -8px); }
} */

.wheel {
    position: relative;
    width: 350px; /* Kích thước vòng quay */
    height: 350px;
    border-radius: 50%;
    border: 8px solid #34495e; /* Viền ngoài */
    background-color: #ecf0f1; /* Màu nền dự phòng */
    overflow: hidden; /* Cắt bỏ phần thừa của các segment */
    transition: transform 4s ease-out; /* Thời gian và kiểu animation quay */
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.segment {
    position: absolute;
    width: 50%; /* Chiếm nửa vòng tròn */
    height: 50%; /* Chiếm nửa vòng tròn */
    top: 0;
    left: 50%;
    transform-origin: 0% 100%; /* Quay quanh tâm dưới bên trái của segment (tức là tâm vòng tròn) */
    display: flex;
    justify-content: center; /* Căn giữa nội dung theo chiều ngang */
    align-items: center; /* Căn giữa nội dung theo chiều dọc */
    box-sizing: border-box;
    padding-left: 30px; /* Đẩy text ra ngoài tâm */
    border-left: 2px solid rgba(0, 0, 0, 0.1); /* Đường kẻ phân chia mờ */
}

.segment span {
    display: block;
    transform: rotate(90deg); /* Xoay chữ cho dễ đọc */
    transform-origin: center center;
    color: #333;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    max-width: 80%; /* Giới hạn chiều rộng chữ */
    white-space: nowrap; /* Ngăn chữ xuống dòng */
    overflow: hidden;
    text-overflow: ellipsis; /* Thêm ... nếu chữ quá dài */
}

#spin-btn {
    margin-top: 25px;
    padding: 12px 25px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    background-color: #2980b9; /* Màu xanh dương */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
}

#spin-btn:hover {
    background-color: #3498db;
}

#spin-btn:active {
    transform: scale(0.95);
}

#spin-btn:disabled {
    background-color: #bdc3c7; /* Màu xám khi bị vô hiệu hóa */
    cursor: not-allowed;
}

#result {
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
    min-height: 25px; /* Đảm bảo không bị nhảy layout khi chưa có kết quả */
}
`;

// JavaScript content
const jsContent = `
document.addEventListener('DOMContentLoaded', function() {
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
            const skewY = 90 - segmentAngle;

            segmentElement.style.transform = \`rotate(\${rotation}deg) skewY(-\${skewY}deg)\`;
            segmentElement.style.backgroundColor = segment.color;

            const span = document.createElement('span');
            span.textContent = segment.text;
            // Điều chỉnh xoay của chữ để nó gần như thẳng đứng hoặc hướng ra ngoài
            span.style.transform = \`skewY(\${skewY}deg) rotate(\${segmentAngle / 2}deg)\`;

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

        // Tính toán góc quay đích
        const targetRotationMidpoint = 360 - (randomIndex * segmentAngle + segmentAngle / 2);

        // Thêm nhiều vòng quay để tạo hiệu ứng (ví dụ: 5 vòng)
        const randomExtraSpins = 5; // Số vòng quay thêm
        const totalRotation = 360 * randomExtraSpins + targetRotationMidpoint;

        // Thêm một chút ngẫu nhiên nhỏ vào góc cuối cùng
        const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);
        const finalRotation = totalRotation + randomOffset;

        wheel.style.transition = 'transform 4s ease-out';
        wheel.style.transform = \`rotate(\${finalRotation}deg)\`;

        // Lưu lại góc quay cuối cùng
        currentRotation = finalRotation % 360;
    }

    // --- Xử lý sau khi quay xong ---
    wheel.addEventListener('transitionend', () => {
        if (!isSpinning) return;

        isSpinning = false;
        spinBtn.disabled = false;

        // Chuẩn hóa góc quay về khoảng 0-360 độ
        const normalizedRotation = currentRotation < 0 ? currentRotation + 360 : currentRotation;

        // Xác định segment trúng thưởng dựa trên góc quay cuối cùng
        const pointerAngle = 270;
        const winningIndex = Math.floor(((360 - normalizedRotation + pointerAngle) % 360) / segmentAngle);
        const finalWinningIndex = (winningIndex + numSegments) % numSegments;
        const finalWinningSegment = segments[finalWinningIndex];

        resultDiv.textContent = \`Chúc mừng! Bạn nhận được: \${finalWinningSegment.text}\`;
        
        // Báo cáo kết quả theo định dạng gameStats
        if (window.sendGameStats) {
            window.sendGameStats({
                completed: true,
                score: finalWinningSegment.text.includes('Điểm') 
                    ? parseInt(finalWinningSegment.text) 
                    : 0,
                completedAt: new Date().toISOString()
            });
        }
    }, false);

    // --- Gắn sự kiện click cho nút quay ---
    spinBtn.addEventListener('click', spinWheel);

    // --- Khởi tạo vòng quay ---
    createSegments();
});
`;

// Export định dạng để hệ thống parse
module.exports = {
  htmlContent,
  cssContent,
  jsContent,
  gameStructure: {
    html: htmlContent,
    css: cssContent,
    javascript: jsContent,
    meta: {
      title: "Vòng Quay May Mắn",
      description: "Vòng quay may mắn với nhiều phần thưởng hấp dẫn",
      viewport: "width=device-width, initial-scale=1.0"
    }
  }
};

// Log ra console để dễ debug
console.log("HTML Content:", htmlContent);
console.log("CSS Content:", cssContent);
console.log("JS Content:", jsContent); 