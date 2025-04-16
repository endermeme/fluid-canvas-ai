
# Cập Nhật Dự Án - Vấn Đề Định Dạng Code & Giải Pháp

## Vấn Đề Đã Xác Định

### 1. Định Dạng HTML Không Đúng
- **Mô tả**: Code HTML, CSS và JavaScript được trả về từ API Gemini không giữ được định dạng xuống dòng và thụt lề
- **Biểu hiện**: Tất cả mã hiển thị trên cùng một dòng, khó đọc và chỉnh sửa
- **Ảnh hưởng**: Khó đọc code, khó debug và khó chỉnh sửa

### 2. Trích Xuất Code Từ Markdown
- **Mô tả**: Hệ thống không trích xuất đúng các block code từ phản hồi markdown
- **Biểu hiện**: Code không được phân tách chính xác theo loại (HTML, CSS, JavaScript)
- **Ảnh hưởng**: Không thể tự động tạo các file riêng biệt cho mỗi loại code

### 3. Tách File Code
- **Mô tả**: Code HTML, CSS và JavaScript cần được tách thành các file riêng biệt
- **Biểu hiện**: Ban đầu tất cả code được lưu trong cùng một file HTML
- **Ảnh hưởng**: Khó bảo trì, quản lý và mở rộng code

## Vị Trí File Liên Quan

### 1. File Code Game
- **src/components/quiz/custom-games/lucky-wheel/index.html**: File HTML của game
- **src/components/quiz/custom-games/lucky-wheel/styles.css**: File CSS của game
- **src/components/quiz/custom-games/lucky-wheel/game.js**: File JavaScript của game

### 2. File Xử Lý Response
- **src/components/quiz/generator/responseParser.ts**: File xử lý và trích xuất code từ phản hồi AI
- **src/components/quiz/generator/geminiGenerator.ts**: File gọi API Gemini và xử lý phản hồi

### 3. File Khác
- **src/components/quiz/generator/apiUtils.ts**: Công cụ hỗ trợ làm việc với API
- **src/components/quiz/QuizGenerator.tsx**: Component chính để tạo game
- **src/pages/Quiz.tsx**: Trang giao diện tạo game

## Giải Pháp Đã Thực Hiện

### 1. Cải Thiện Xử Lý Phản Hồi Markdown
- Cập nhật `responseParser.ts` để nhận diện và trích xuất chính xác các block code markdown
- Thêm hàm `extractCodeFromMarkdown` để tách HTML, CSS, và JavaScript từ phản hồi markdown

### 2. Định Dạng Code
- Thêm các hàm format riêng cho JavaScript (`formatJavaScript`) và CSS (`formatCss`)
- Cải thiện `formatGameContent` để tạo nội dung HTML có cấu trúc đúng

### 3. Tách File
- Thực hiện tách code thành các file riêng biệt:
  - HTML trong `index.html`
  - CSS trong `styles.css`
  - JavaScript trong `game.js`
- Cập nhật `index.html` để load CSS và JavaScript từ các file riêng

## Cải Tiến Tiếp Theo

### 1. Refactor Các File Lớn
- Các file xử lý như `responseParser.ts` và `geminiGenerator.ts` nên được tách thành các module nhỏ hơn
- Tạo các tiện ích riêng biệt cho mỗi chức năng (trích xuất code, định dạng, v.v.)

### 2. Cải Thiện Định Dạng
- Thêm các tùy chọn định dạng nâng cao cho code (beautify, minify, v.v.)
- Hỗ trợ thêm định dạng code cho các ngôn ngữ khác

### 3. Tối Ưu Hóa Prompt Gemini
- Cập nhật prompt để yêu cầu Gemini trả về code đã định dạng đúng
- Thêm hướng dẫn cụ thể về cách trả về code trong các block markdown
