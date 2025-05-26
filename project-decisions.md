
# Project Decisions Log

## 2025-01-26 - Major Refactor: AI Components Structure

### Tạo thư mục AI riêng biệt
- **File tạo**: `src/components/ai/game-generator.ts` - Core AI game generation logic
- **File tạo**: `src/components/ai/prompt-manager.ts` - Quản lý prompts cho AI
- **File tạo**: `src/components/ai/response-processor.ts` - Xử lý response từ AI
- **File tạo**: `src/components/ai/index.ts` - Export tổng hợp

### Cải tiến AI Game Generator
- Sử dụng Singleton pattern cho AIGameGenerator
- Tách biệt logic prompt building
- Thêm response processing để clean HTML output
- Hỗ trợ mobile optimization tự động
- Error handling tốt hơn

### Kế hoạch refactor tiếp theo
- Sẽ tạo thư mục `preset` và `custom` cho game components
- Tạo thư mục `ui` cho shared UI components
- Xóa các thư mục không cần thiết

### Lưu ý
- Giữ nguyên functionality, chỉ tái cấu trúc
- Tất cả imports sẽ được cập nhật ở các lần refactor tiếp theo
