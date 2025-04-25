
# Thay đổi trong dự án

## 2025-04-25
- Sửa lỗi "Dialog is not defined" lần thứ 2: kiểm tra và đảm bảo tất cả các component sử dụng Dialog đều import chính xác
- Thêm import Dialog cho component GameSelector.tsx
- Sửa lỗi "Dialog is not defined" trong QuizContainer.tsx: thêm import Dialog và các component liên quan từ @/components/ui/dialog
- Tạo file ShareDialog.tsx để tách phần chia sẻ thành một component riêng biệt
- Sửa lỗi đường dẫn import trong GameContainer.tsx: thay đổi '../custom-games/utils/iframe-utils' thành '../utils/iframe-utils'
- Xóa gọi hàm setCanvasMode không tồn tại trong CustomGameForm.tsx
- Thêm prop onBack vào CustomGameHeader.tsx để khắc phục lỗi type trong EnhancedGameView.tsx

