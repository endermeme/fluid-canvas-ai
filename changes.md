# Lịch sử thay đổi mã nguồn

## 24/04/2024 - Cập nhật logic hiển thị nút chia sẻ trong PresetGameHeader

### Tệp đã chỉnh sửa:
- `src/components/quiz/preset-games/PresetGameHeader.tsx`: Thêm prop isGameCreated để kiểm soát hiển thị nút chia sẻ
- `src/components/quiz/preset-games/PresetGameManager.tsx`: Cập nhật việc truyền props cho PresetGameHeader

### Thay đổi chi tiết:
1. Thêm prop `isGameCreated` vào PresetGameHeader để kiểm soát việc hiển thị nút chia sẻ
2. Chỉ hiển thị nút chia sẻ khi:
   - Game đã được tạo thành công (có gameContent)
   - Không ở trạng thái setting hoặc loading
   - Không có lỗi xảy ra
3. Cải thiện logic hiển thị để rõ ràng và nhất quán hơn

## 23/04/2024 - Cập nhật PresetGameHeader

### Tệp đã chỉnh sửa:
- `src/components/quiz/preset-games/PresetGameHeader.tsx`: Thêm props `onShare` và `showShare` để hỗ trợ chức năng chia sẻ và hiển thị nút chia sẻ.

### Thay đổi chi tiết:
1. Thêm interface `PresetGameHeaderProps` với các thuộc tính:
   - `onShare?`: Hàm callback khi nhấn nút chia sẻ
   - `showShare?`: Boolean để ẩn/hiện nút chia sẻ (mặc định là true)
2. Thêm nút Share2 trong header để chia sẻ trò chơi
3. Nút chia sẻ chỉ hiển thị khi cả `showShare` là true và `onShare` được cung cấp

## 24/04/2024 - Cập nhật PresetGameManager

### Tệp đã chỉnh sửa:
- `src/components/quiz/preset-games/PresetGameManager.tsx`: Cập nhật để sử dụng đúng nút chia sẻ từ PresetGameHeader.

### Thay đổi chi tiết:
1. Thêm PresetGameHeader vào mỗi trạng thái giao diện trong PresetGameManager
2. Truyền đúng props `onShare` và `showShare` từ PresetGameManager sang PresetGameHeader
3. Chỉ hiển thị nút chia sẻ khi có game content
