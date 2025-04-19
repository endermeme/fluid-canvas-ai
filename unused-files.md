# Danh sách file không sử dụng hoặc có thể xóa

Dưới đây là danh sách các file không còn được sử dụng hoặc có chức năng trùng lặp trong dự án:

## 1. File không được import hoặc sử dụng

| Đường dẫn | Lý do có thể xóa |
|-----------|-----------------|
| `src/components/quiz/generator/fallbackGenerator.ts` | Không được import trong bất kỳ file nào khác trong project. Hàm `createFallbackGame` không được gọi từ bất kỳ đâu. |
| `src/components/quiz/generator/responseParser.ts` | Hàm `parseGeminiResponse` không được import và sử dụng ở bất kỳ đâu. Chức năng parse đã được xử lý trong `geminiGenerator.ts` với hàm `sanitizeGameCode`. |

## 2. File trùng lặp chức năng

| Đường dẫn | Lý do trùng lặp | Thay thế bởi |
|-----------|----------------|-------------|
| `src/components/quiz/generator/AIGameGenerator.ts` | Làm nhiệm vụ tương tự như `geminiGenerator.ts` nhưng ít tính năng hơn. Cả hai đều sử dụng Gemini API nhưng `geminiGenerator.ts` có xử lý lỗi tốt hơn. | `src/components/quiz/generator/geminiGenerator.ts` |
| `src/components/quiz/quick-game-selector/index.tsx` | Trùng lặp với `src/components/quiz/QuickGameSelector.tsx`. Cả hai chứa code tương tự nhau. | `src/components/quiz/QuickGameSelector.tsx` |

## 3. File chứa code thừa hoặc không tối ưu

| Đường dẫn | Mô tả | Đề xuất |
|-----------|-------|--------|
| `src/components/quiz/utils/iframe-utils.ts` | Đã xóa phần xử lý lucky wheel, nhưng vẫn còn `fixInlineComments()` có thể sử dụng để xử lý comment. | Giữ lại và cải thiện tính năng xử lý comment. |
| `src/components/quiz/generator/customGamePrompt.ts` | Các hàm phụ trợ như `getGameInstructionsByType` và `getDifficultyInstructions` được khai báo nhưng không thấy được sử dụng ở nơi khác. | Hoặc sử dụng hoặc xóa các hàm không dùng đến. |

## 4. Các file ngoài dự án

| Đường dẫn | Mô tả |
|-----------|-------|
| `vong-quay/simple-parser.cjs` | Là file parse trong thư mục `vong-quay` bên ngoài `src`, không thuộc dự án chính. |
| `vong-quay/direct-html-parser.js` | Là file parse trong thư mục `vong-quay` bên ngoài `src`, không thuộc dự án chính. |

## 5. Gợi ý cải thiện cấu trúc dự án

1. **Hợp nhất các file generator**:
   - Hợp nhất `AIGameGenerator.ts` và `geminiGenerator.ts` thành một file/module duy nhất để dễ bảo trì
   - Có thể tạo ra một lớp `GameGenerator` trừu tượng và các lớp con tương ứng với từng loại generator

2. **Tổ chức lại các prompt builder**:
   - Tập trung xử lý prompt trong một thư mục riêng như `src/components/quiz/prompts/`
   - Tách các loại prompt khác nhau thành các file riêng, dễ quản lý

3. **Tối ưu hóa cấu trúc utility**:
   - Xem xét việc chuyển các hàm tiện ích từ `apiUtils.ts` vào thư mục `src/utils/`
   - Tạo các module chuyên biệt như `logging.ts`, `error-handling.ts`, vv.

> **Lưu ý quan trọng**: Trước khi xóa bất kỳ file nào, hãy kiểm tra kỹ các references để đảm bảo không ảnh hưởng đến hoạt động của ứng dụng. Có thể các file được import bằng dynamic import mà chúng ta không tìm thấy qua các công cụ phân tích mã nguồn. 