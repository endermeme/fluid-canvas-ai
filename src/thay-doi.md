
# Lịch sử thay đổi mã nguồn

## Ngày 21/04/2023
1. Cập nhật `GameHeader.tsx` - Thêm property extraButton để sửa lỗi TypeScript
2. Đã sửa lỗi định nghĩa biến `progress` bị lặp lại trong `FlashcardsTemplate.tsx`
3. Cập nhật GameHeader để bổ sung các tính năng onRefresh và onShare

## Ngày 20/04/2025
1. Sửa lỗi TypeScript trong `GameView.tsx` - Bổ sung các thuộc tính bắt buộc (progress, currentItem, totalItems) cho GameHeader

## Ngày 21/04/2025
1. Xóa và viết lại toàn bộ phần header và navigation trong GameView
2. Đơn giản hóa giao diện và chức năng điều hướng

## Ngày 22/04/2025
1. Sửa lỗi type trong GameView.tsx - Xóa prop onLoad từ GameContainer
2. Tạo lại GameHeader.tsx vì các template game vẫn cần sử dụng
3. Cập nhật đường dẫn import GameHeader trong các file template game
