
# Thay đổi trong dự án

## 23/04/2024 - Cập nhật PresetGameHeader

### Tệp đã chỉnh sửa:
- `src/components/quiz/preset-games/PresetGameHeader.tsx`: Thêm props `onShare` và `showShare` để hỗ trợ chức năng chia sẻ và hiển thị nút chia sẻ.

### Thay đổi chi tiết:
1. Thêm interface `PresetGameHeaderProps` với các thuộc tính:
   - `onShare?`: Hàm callback khi nhấn nút chia sẻ
   - `showShare?`: Boolean để ẩn/hiện nút chia sẻ (mặc định là true)
2. Thêm nút Share2 trong header để chia sẻ trò chơi
3. Nút chia sẻ chỉ hiển thị khi cả `showShare` là true và `onShare` được cung cấp

