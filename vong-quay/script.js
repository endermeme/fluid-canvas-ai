
// Danh sách các mục trên vòng quay
const items = [
    "Giải nhất", 
    "Giải nhì", 
    "Giải ba", 
    "May mắn", 
    "Tiếp tục", 
    "Thử lại", 
    "Quà đặc biệt", 
    "Chúc may mắn"
];

// Màu sắc cho các phân đoạn
const colors = [
    "#f44336", "#e91e63", "#9c27b0", "#673ab7", 
    "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4"
];

// Lấy các phần tử DOM
const wheel = document.querySelector('.wheel');
const spinBtn = document.getElementById('spin-btn');
const result = document.getElementById('result');

// Tạo các phân đoạn cho vòng quay
function createWheel() {
    const totalItems = items.length;
    const anglePerItem = 360 / totalItems;
    const offsetAngle = anglePerItem / 2;

    for (let i = 0; i < totalItems; i++) {
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.transform = `rotate(${i * anglePerItem + offsetAngle}deg)`;
        segment.style.backgroundColor = colors[i % colors.length];

        const text = document.createElement('span');
        text.textContent = items[i];
        segment.appendChild(text);

        wheel.appendChild(segment);
    }
}

// Tạo vòng quay khi trang tải xong
window.addEventListener('DOMContentLoaded', createWheel);

// Biến lưu trạng thái đang quay
let isSpinning = false;

// Xử lý sự kiện khi nhấn nút quay
spinBtn.addEventListener('click', () => {
    if (isSpinning) return; // Ngăn người dùng quay khi đang quay
    
    isSpinning = true;
    spinBtn.disabled = true;
    result.textContent = '';
    
    // Số vòng quay (3-5 vòng) + góc ngẫu nhiên
    const totalRotation = 1080 + Math.floor(Math.random() * 1080);
    
    // Thiết lập animation quay
    wheel.style.transition = 'transform 4s ease-out';
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    // Xác định kết quả sau khi quay xong
    setTimeout(() => {
        // Tính toán phân đoạn trúng
        const finalRotation = totalRotation % 360;
        const anglePerItem = 360 / items.length;
        let selectedIndex = Math.floor(finalRotation / anglePerItem);
        selectedIndex = (items.length - selectedIndex) % items.length;
        
        // Hiển thị kết quả
        result.textContent = `Kết quả: ${items[selectedIndex]}`;
        
        // Reset trạng thái
        isSpinning = false;
        spinBtn.disabled = false;

        // Gửi sự kiện hoàn thành (nếu cần)
        const event = new CustomEvent('game-completed', {
            detail: { score: 100, result: items[selectedIndex] }
        });
        document.dispatchEvent(event);
    }, 4000); // Thời gian quay = 4 giây
});
