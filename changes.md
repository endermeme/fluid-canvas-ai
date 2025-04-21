
# Quyết định & Lịch sử chỉnh sửa

## 2025-04-21: Thiết kế lại header các game preset, loại bỏ tên game
- Tạo mới: src/components/quiz/preset-games/PresetGameHeader.tsx (header preset mới, tối giản, chỉ còn các nút icon quay về, tạo mới, lịch sử, chia sẻ)
- Cập nhật: src/components/quiz/preset-games/templates/TrueFalseTemplate.tsx sử dụng PresetGameHeader, không còn tên game trên header
- Điều chỉnh lại các props cho đồng bộ

## 2025-04-21: Sửa lỗi thiếu files types
- Tạo mới: src/components/quiz/types.ts (định nghĩa các types chung cho module quiz)
- Tạo mới: src/components/quiz/generator/types.ts (định nghĩa các types cho MiniGame và GameGenerator)
- Tạo mới: src/components/quiz/generator/promptBuilder.ts (hàm xây dựng prompt cho API)
- Tạo mới: src/components/quiz/custom-games/utils/iframe-processor.ts (re-export từ iframe-utils.ts)

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

## 2025-04-20: Dọn dẹp file giao diện không cần thiết

### Files đã xóa:
- src/components/quiz/GameHeader.tsx  
- src/components/quiz/components/header-buttons/** (toàn bộ thư mục)
- src/components/quiz/components/GameViewHeader.tsx

Lý do: Tối ưu hóa cấu trúc project bằng cách loại bỏ các component giao diện trùng lặp và không cần thiết.

## 2025-04-20: Sửa lỗi import sau khi xóa file GameViewHeader.tsx

### Files được cập nhật:
- src/components/quiz/GameView.tsx

Chi tiết: Cập nhật import từ GameViewHeader (đã bị xóa) sang GameHeader mới và điều chỉnh lại props tương ứng.

## 2025-04-20: Tích hợp lưu trữ game với Supabase

### Files được cập nhật:
- src/components/quiz/GameView.tsx

Chi tiết:
- Thêm chức năng lưu game vào bảng games trong Supabase
- Cập nhật chức năng chia sẻ để sử dụng bảng games
- Thêm RLS policies cho bảng games
- Tối ưu hóa URL chia sẻ với slug từ tiêu đề game

## 2025-04-20: Update preset game API endpoint

### Files được cập nhật:
- src/components/quiz/preset-games/PresetGameManager.tsx

### Chi tiết thay đổi:
- Cập nhật endpoint API cho preset games để khớp với cấu trúc của custom games
- Sử dụng chung một format request/response
- Đơn giản hóa logic gọi API và xử lý response
- Cải thiện xử lý lỗi và loading states
- Thêm toast notifications để thông báo trạng thái

## 2025-04-20: Sửa lỗi Gemini API endpoint

### Files được cập nhật:
- src/components/quiz/preset-games/PresetGameManager.tsx

### Chi tiết thay đổi:
- Sửa lỗi 404 từ Gemini API
- Cập nhật từ `v1` sang `v1beta` để phù hợp với model gemini-2.5-pro-preview-03-25
- Đồng bộ cấu hình API với custom game generator
- Sử dụng các hằng số từ api-constants.ts
- Cập nhật cấu trúc request body để phù hợp với API mới
