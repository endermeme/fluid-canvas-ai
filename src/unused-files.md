
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
| `src/components/quiz/generator/AIGameGenerator.ts` | Làm nhiệm vụ tương tự như `geminiGenerator.ts` nhưng ít tính năng hơn. Cả hai đều sử dụng Gemini API nhưng `geminiGenerator.ts` có xử lý lỗi tốt hơn. | `src/components/quiz/generator/geminiGenerator.ts` | ✅ Đã hợp nhất |
| `src/components/quiz/quick-game-selector/index.tsx` | Trùng lặp với `src/components/quiz/QuickGameSelector.tsx`. Cả hai chứa code tương tự nhau. | `src/components/quiz/QuickGameSelector.tsx` | ✅ Đã xóa |
| `src/components/quiz/quick-game-selector/CustomGameForm.tsx` | Trùng lặp chức năng với `src/components/quiz/custom-games/CustomGameForm.tsx`. | `src/components/quiz/custom-games/CustomGameForm.tsx` | ✅ Đã xóa |

## 3. File có thể xóa hoặc không tối ưu

| Đường dẫn | Mô tả | Đề xuất |
|-----------|-------|--------|
| `src/components/quiz/quick-game-selector/CustomGameDialog.tsx` | Có thể không còn sử dụng sau khi đã có CustomGameForm trong thư mục custom-games | Xem xét xóa nếu không có import trong project |
| `src/components/quiz/custom-games/CustomGameContainer.tsx` | File dài (215 dòng), có khả năng chức năng trùng lặp với các component khác | Tách thành các component nhỏ hơn |

## 4. Các file ngoài dự án

| Đường dẫn | Mô tả |
|-----------|-------|
| `vong-quay/simple-parser.cjs` | Là file parse trong thư mục `vong-quay` bên ngoài `src`, không thuộc dự án chính. |
| `vong-quay/direct-html-parser.js` | Là file parse trong thư mục `vong-quay` bên ngoài `src`, không thuộc dự án chính. |

## 5. Gợi ý cải thiện cấu trúc dự án

1. **Refactor các file dài**:
   - `src/components/quiz/generator/geminiGenerator.ts` (243 dòng) - nên tách thành các module nhỏ hơn
   - `src/components/quiz/custom-games/CustomGameContainer.tsx` (215 dòng) - nên tách thành các component nhỏ hơn
   - `src/components/quiz/QuizGenerator.tsx` (240 dòng) - nên chia thành các hooks hoặc component nhỏ hơn
   - `src/components/quiz/custom-games/CustomGameForm.tsx` (242 dòng) - nên tách thành các component nhỏ hơn
   - `src/components/quiz/QuickGameSelector.tsx` (215 dòng) - nên tách thành các component nhỏ hơn

2. **Xem xét tách các file với nhiều chức năng**:
   - Tách logic tạo game thành các module riêng biệt
   - Tách logic hiển thị thành các component UI riêng biệt
   - Tạo các hook tùy chỉnh cho các chức năng phức tạp

> **Lưu ý quan trọng**: Trước khi xóa bất kỳ file nào, hãy kiểm tra kỹ các references để đảm bảo không ảnh hưởng đến hoạt động của ứng dụng. Các file trong mục "Đã xóa" đã được kiểm tra và xác nhận là an toàn để xóa.
