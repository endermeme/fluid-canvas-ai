
# Quyết định thiết kế và sửa đổi

## Ngày 2025-01-16

### Thay đổi giao diện nút quay lại trong PresetGameHeader
- **File đã sửa**: `src/components/quiz/preset-games/PresetGameHeader.tsx`
- **Loại thay đổi**: Cải thiện UI/UX
- **Mô tả**: Thiết kế nút quay lại thành dạng thẻ với biểu tượng cánh cửa thay vì nút ghost đơn giản
- **Lý do**: Tăng tính nhận diện và thẩm mỹ cho giao diện

### Đồng nhất background cho HomePage và PresetGamesPage
- **File đã sửa**: `src/pages/HomePage.tsx`, `src/components/quiz/preset-games/PresetGamesPage.tsx`
- **Loại thay đổi**: UI/UX - Đồng nhất thiết kế
- **Mô tả**: Copy background animation từ CustomGameForm sang HomePage và PresetGamesPage
- **Lý do**: Tạo sự nhất quán với background khoa học có quantum particles và science icons

### Cập nhật mô hình Gemini AI
- **File đã sửa**: `src/constants/api-constants.ts`
- **Loại thay đổi**: Cập nhật cấu hình AI
- **Mô tả**: Thay đổi mô hình từ `gemini-2.5-pro-preview-05-06` sang `gemini-2.5-flash-preview-05-20`
- **Lý do**: Sử dụng mô hình mới hơn và nhanh hơn cho cả custom game và preset game
