# Lịch sử thay đổi mã nguồn

## 25/04/2024 - Xóa chế độ Canvas và đơn giản hóa giao diện tạo game

### Tệp đã chỉnh sửa:
- `src/components/quiz/custom-games/CustomGameForm.tsx`: Xóa toggle chế độ Canvas
- `src/components/quiz/generator/geminiGenerator.ts`: Xóa chế độ Canvas và type

### Chi tiết thay đổi:
1. Xóa chế độ Canvas:
   - Loại bỏ toggle chế độ Canvas khỏi form tạo game
   - Xóa các tham số liên quan đến Canvas trong generator
   - Đơn giản hóa logic tạo game

2. Tối ưu hóa generator:
   - Xóa các type không cần thiết
   - Đặt tiếng Việt làm ngôn ngữ mặc định
   - Cải thiện hiển thị thông báo
