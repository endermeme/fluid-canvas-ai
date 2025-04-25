
# Danh sách file không sử dụng hoặc có thể xóa

Dưới đây là danh sách các file không còn được sử dụng hoặc có chức năng trùng lặp trong dự án:

## 1. File không được import hoặc sử dụng ✅ Đã xóa

| Đường dẫn | Lý do có thể xóa | Trạng thái |
|-----------|-----------------|------------|
| `src/components/quiz/generator/fallbackGenerator.ts` | Không được import trong bất kỳ file nào khác trong project. Hàm `createFallbackGame` không được gọi từ bất kỳ đâu. | ✅ Đã xóa |
| `src/components/quiz/generator/responseParser.ts` | Hàm `parseGeminiResponse` không được import và sử dụng ở bất kỳ đâu. Chức năng parse đã được xử lý trong `geminiGenerator.ts` với hàm `sanitizeGameCode`. | ✅ Đã xóa |
| `src/components/quiz/generator/imageGenerator.ts` | Đã không còn sử dụng sau khi đơn giản hóa quy trình tạo game. | ✅ Đã xóa |
| `src/components/quiz/generator/imageInstructions.ts` | Đã không còn sử dụng sau khi đơn giản hóa quy trình tạo game. | ✅ Đã xóa |

## 2. File trùng lặp chức năng 

| Đường dẫn | Lý do trùng lặp | Thay thế bởi | Trạng thái |
|-----------|----------------|-------------|------------|
| `src/components/quiz/quick-game-selector/index.tsx` | Trùng lặp với `src/components/quiz/QuickGameSelector.tsx`. Cả hai chứa code tương tự nhau. | `src/components/quiz/QuickGameSelector.tsx` | ✅ Đã xóa |
| `src/components/quiz/quick-game-selector/CustomGameDialog.tsx` | Có thể không còn sử dụng sau khi đã có CustomGameForm trong thư mục custom-games | `src/components/quiz/custom-games/CustomGameForm.tsx` | 🔄 Cần xóa |
| `src/components/quiz/generator/AIGameGenerator.ts` | Làm nhiệm vụ tương tự như `geminiGenerator.ts` nhưng ít tính năng hơn. Cả hai đều sử dụng Gemini API. | `src/components/quiz/generator/geminiGenerator.ts` | 🔄 Cần xóa |

## 3. File có thể xóa hoặc cần tối ưu

| Đường dẫn | Mô tả | Đề xuất |
|-----------|-------|--------|
| `src/components/quiz/custom-games/CustomGameContainer.tsx` | File dài (215 dòng), có khả năng chức năng trùng lặp | Tách thành các component nhỏ hơn |
| `src/components/quiz/generator/geminiGenerator.ts` | File dài (225 dòng) | Tách thành các module nhỏ hơn |
| `src/components/quiz/custom-games/CustomGameForm.tsx` | File dài (242 dòng) | Tách thành các component nhỏ hơn |

## 4. File không còn cần thiết sau khi đã đơn giản hóa

| Đường dẫn | Lý do | Trạng thái |
|-----------|--------|------------|
| `src/components/quiz/custom-games/utils/js-processor.ts` | Chức năng xử lý JavaScript đã đơn giản hóa | 🔄 Cần xóa |
| `src/components/quiz/custom-games/utils/css-processor.ts` | Chức năng xử lý CSS đã đơn giản hóa | 🔄 Cần xóa |
| `src/components/quiz/custom-games/utils/html-processor.ts` | Chức năng xử lý HTML đã đơn giản hóa | 🔄 Cần xóa |

## 5. File có lỗi đường dẫn import

| Đường dẫn | Lỗi | Đề xuất |
|-----------|-----|--------|
| `src/components/quiz/custom-games/GameContainer.tsx` | Import từ `./utils/iframe-processor` không tồn tại | Sửa import thành `./utils/iframe-utils` |
| `src/components/quiz/custom-games/utils/iframe-utils.ts` | File chỉ re-export từ thư mục gốc | Xóa và import trực tiếp từ nguồn gốc |

## 6. Gợi ý cải thiện cấu trúc dự án

1. **Tối ưu hóa cấu trúc thư mục**:
   - `/preset-games`: Giữ các template game có sẵn
   - `/custom-games`: Giữ chức năng tạo game tùy chỉnh
   - `/utils`: Di chuyển các utility function vào đây
   - `/hooks`: Tách các custom hooks vào thư mục riêng

2. **Giảm kích thước file**:
   - Tách `geminiGenerator.ts` thành:
     - `generators/prompts.ts`: Xử lý tạo prompts
     - `generators/sanitizer.ts`: Xử lý làm sạch code
     - `generators/api.ts`: Xử lý kết nối API

3. **Tách các component dài**:
   - Tách CustomGameForm.tsx thành:
     - FormHeader.tsx: Phần header của form
     - TopicSelect.tsx: Phần chọn chủ đề
     - GameOptions.tsx: Phần tùy chọn game

> **Lưu ý**: Hãy xem xét kỹ mối quan hệ giữa các file trước khi xóa để tránh ảnh hưởng đến chức năng của ứng dụng.
