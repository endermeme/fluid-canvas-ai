
# Quyết định và Thay đổi Custom Game

## 2025-05-27

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
- Hiển thị game trong iframe
- Error handling và loading states
- Detailed console logging
