
# Danh sách file không sử dụng hoặc có thể xóa

Dưới đây là danh sách các file không còn được sử dụng hoặc có chức năng trùng lặp trong dự án:

## 1. File không được import hoặc sử dụng ✅ Đã xóa

| Đường dẫn | Lý do có thể xóa | Trạng thái |
|-----------|-----------------|------------|
| `src/components/quiz/generator/fallbackGenerator.ts` | Không được import trong bất kỳ file nào khác trong project. Hàm `createFallbackGame` không được gọi từ bất kỳ đâu. | ✅ Đã xóa |
| `src/components/quiz/generator/responseParser.ts` | Hàm `parseGeminiResponse` không được import và sử dụng ở bất kỳ đâu. Chức năng parse đã được xử lý trong `geminiGenerator.ts` với hàm `sanitizeGameCode`. | ✅ Đã xóa |

## 2. File trùng lặp chức năng 

| Đường dẫn | Lý do trùng lặp | Thay thế bởi | Trạng thái |
|-----------|----------------|-------------|------------|
| `src/components/quiz/quick-game-selector/index.tsx` | Trùng lặp với `src/components/quiz/QuickGameSelector.tsx`. Cả hai chứa code tương tự nhau. | `src/components/quiz/QuickGameSelector.tsx` | ✅ Đã xóa |
| `src/components/quiz/quick-game-selector/CustomGameDialog.tsx` | Có thể không còn sử dụng sau khi đã có CustomGameForm trong thư mục custom-games | `src/components/quiz/custom-games/CustomGameForm.tsx` | 🔄 Cần xóa |

## 3. File có thể xóa hoặc cần tối ưu

| Đường dẫn | Mô tả | Đề xuất |
|-----------|-------|--------|
| `src/components/quiz/custom-games/CustomGameContainer.tsx` | File dài (215 dòng), có khả năng chức năng trùng lặp | Tách thành các component nhỏ hơn |
| `src/components/quiz/generator/geminiGenerator.ts` | File dài (243 dòng) | Tách thành các module nhỏ hơn |
| `src/components/quiz/custom-games/CustomGameForm.tsx` | File dài (242 dòng) | Tách thành các component nhỏ hơn |

## 4. File không còn cần thiết sau khi đã đơn giản hóa

| Đường dẫn | Lý do |
|-----------|--------|
| `src/components/quiz/custom-games/utils/js-processor.ts` | Chức năng xử lý JavaScript đã đơn giản hóa |
| `src/components/quiz/custom-games/utils/css-processor.ts` | Chức năng xử lý CSS đã đơn giản hóa |
| `src/components/quiz/custom-games/utils/html-processor.ts` | Chức năng xử lý HTML đã đơn giản hóa |

## 5. Gợi ý cải thiện cấu trúc dự án

1. **Tối ưu hóa cấu trúc thư mục**:
   - `/preset-games`: Giữ các template game có sẵn
   - `/custom-games`: Giữ chức năng tạo game tùy chỉnh
   - `/utils`: Di chuyển các utility function vào đây
   - `/hooks`: Tách các custom hooks vào thư mục riêng

2. **Giảm kích thước file**:
   - Mỗi component không nên quá 200 dòng
   - Tách các logic phức tạp thành custom hooks
   - Tách các UI component thành các file riêng

> **Lưu ý**: Hãy xem xét kỹ mối quan hệ giữa các file trước khi xóa để tránh ảnh hưởng đến chức năng của ứng dụng.

