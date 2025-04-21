
# Lịch sử thay đổi mã nguồn

## 2025-04-21: Fix lỗi build và thiếu dependencies (react-beautiful-dnd)
- Cài đặt react-beautiful-dnd và @types/react-beautiful-dnd
- Sửa lỗi `setGamePairs` không được khai báo trong MemoryTemplate.tsx
- Cập nhật file changes.md để ghi lại các sửa đổi

### Files đã sửa:
- src/components/quiz/preset-games/templates/MemoryTemplate.tsx
- src/changes.md
- package.json (dependencies)

### Lý do:
- Fix lỗi build không thành công do thiếu dependencies và biến không khai báo

## 2025-04-21: Fix lỗi dữ liệu, tối ưu UI Header cho 4 game preset cuối + mobile
- Update GameHeader.tsx (responsive UI, gọn đẹp cho mobile)
- Sửa lại logic xử lý dữ liệu & loading UI cho:
  - OrderingTemplate.tsx
  - MemoryTemplate.tsx
  - FlashcardsTemplate.tsx
  - TrueFalseTemplate.tsx
- Thông báo hợp lý khi không có dữ liệu trò chơi
- Sửa responsive header tránh vỡ UI khi thu nhỏ/màn hình mobile

### Files đã sửa:
- src/components/quiz/preset-games/components/headers/GameHeader.tsx
- src/components/quiz/preset-games/templates/OrderingTemplate.tsx
- src/components/quiz/preset-games/templates/MemoryTemplate.tsx
- src/components/quiz/preset-games/templates/FlashcardsTemplate.tsx
- src/components/quiz/preset-games/templates/TrueFalseTemplate.tsx
- src/changes.md

### Lý do:
- Fix triệt để lỗi "không có dữ liệu trò chơi" ở 4 game cuối.
- Tối ưu trải nghiệm, giao diện header trên thiết bị di động.
- Loading/Empty UI rõ ràng cho người dùng.
