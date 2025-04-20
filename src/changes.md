# Lịch sử thay đổi mã nguồn

## 2025-04-20: Dọn dẹp và tổ chức lại cấu trúc thư mục
- Xóa thư mục demo và các file liên quan 
- Xóa các file không cần thiết trong quick-game-selector
- Di chuyển utility functions vào thư mục game tương ứng
- Đơn giản hóa cấu trúc project
- Cập nhật lại các đường dẫn import

### Files đã xóa:
- src/components/quiz/demo/**
- src/pages/IframeDemo.tsx
- src/app/iframe-demo/**
- public/iframe-test.html
- src/components/quiz/quick-game-selector/index.tsx
- src/components/quiz/quick-game-selector/CustomGameDialog.tsx
- src/utils/iframe-demo-utils.ts
- src/utils/iframe-utils.ts

### Files được tạo mới/di chuyển:
- src/components/quiz/custom-games/utils/iframe-processor.ts

### Chi tiết thay đổi:
- Di chuyển các utility functions vào thư mục tương ứng
- Cập nhật các import path trong các file liên quan
- Xóa route iframe-demo khỏi App.tsx
- Đơn giản hóa cấu trúc thư mục

## 2025-04-20: Cập nhật giao diện game và header
- Tạo component GameHeader.tsx mới để thống nhất header cho tất cả các game
- Cập nhật GameContainer.tsx để hiển thị game ở chế độ toàn màn hình và căn giữa
- Thêm các hiệu ứng blur và gradient cho header và container
- Cải thiện UI/UX với các animation mượt mà hơn

### Files được tạo mới:
- src/components/quiz/components/GameHeader.tsx

### Files được cập nhật:
- src/components/quiz/custom-games/GameContainer.tsx
