
# Quyết định và Thay đổi Custom Game

## 2025-05-27

### Sửa lỗi import debugToolsScript trong iframe-enhancer
- **File đã sửa**: `src/components/quiz/utils/iframe-enhancer.ts`
- **Loại thay đổi**: Sửa lỗi TypeScript
- **Mô tả**: Loại bỏ import `debugToolsScript` không tồn tại và cập nhật hàm `enhanceBody` để chỉ sử dụng các scripts đã có sẵn

### Sửa lỗi "redeclaration of let lastTap" trong iframe scripts
- **File đã sửa**: `src/components/quiz/utils/iframe-scripts.ts`
- **Loại thay đổi**: Sửa lỗi JavaScript runtime
- **Mô tả**: Khắc phục lỗi khai báo trùng lặp biến lastTap bằng cách:
  - Đặt biến lastTap trong scope cục bộ với tên `touchLastTap`
  - Sử dụng IIFE (Immediately Invoked Function Expression) để tránh xung đột global scope
  - Thêm check `window.touchHandlerInitialized` để tránh khởi tạo multiple lần
  - Cải thiện code structure và error handling
  - Tối ưu hóa loading indicator và animation styles

### Cập nhật API Key và chuyển sang Edge Function
- **Tạo mới**: `supabase/functions/generate-custom-game/index.ts`
  - Edge function bảo mật cho custom game
  - Sử dụng API key mới: AIzaSyAcCyfdmqeT9DNJZ4Qh-iNgw9hqXE5Epqw
  - Model: gemini-2.0-flash-exp
- **Sửa đổi**: `src/services/geminiService.ts`
  - Chuyển từ direct API call sang edge function
  - Bảo mật API key
  - Chỉ áp dụng cho custom game

### Tạo API Constants (Khắc phục lỗi build)
- **Tạo mới**: `src/constants/api-constants.ts`
  - Chứa GEMINI_API_KEY và cấu hình API
  - Khắc phục lỗi import trong PresetGameManager files

### Xóa hoàn toàn hệ thống tạo game Gemini cũ
- **Xóa**: `src/services/geminiService.ts` (loại bỏ logic Gemini cũ)
- **Sửa đổi**: `src/components/custom/GameController.tsx` (chỉ giữ giao diện)
- **Sửa đổi**: `src/components/custom/CustomGameForm.tsx` (chỉ giữ form)
- **Sửa đổi**: `src/pages/Quiz.tsx` (đơn giản hóa)

### Tái tạo hệ thống Custom Game với Gemini API mới
- **Tạo mới**: `src/services/geminiService.ts` 
  - Tích hợp @google/genai SDK
  - Xử lý markdown thành HTML
  - Validate HTML output
  - Detailed logging
- **Sửa đổi**: `src/components/custom/CustomGameForm.tsx`
  - Form đơn giản với 1 ô nhập
  - Preset prompts gợi ý
  - Mobile-friendly design
- **Sửa đổi**: `src/components/custom/GameController.tsx`
  - Tích hợp Gemini service
  - Error handling và loading states
  - Enhanced game view với iframe

### Dependencies đã thêm
- **@google/genai**: SDK chính thức cho Gemini AI

### Tính năng hiện tại
- Form nhập yêu cầu đơn giản
- 6 preset prompts cho game phổ biến
- Edge function bảo mật với API key mới
- API Gemini 2.0-flash-exp tạo HTML game hoàn chỉnh
- Hiển thị game trong iframe an toàn
- Error handling và loading states cải thiện
- Detailed console logging
- Khắc phục lỗi JavaScript runtime trong iframe
- Khắc phục lỗi TypeScript import
