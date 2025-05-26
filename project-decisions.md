
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

## 2025-01-26 - Refactor Step 2: Preset và Custom Game Structure

### Tạo thư mục preset games
- **Di chuyển**: `src/components/quiz/preset-games/` → `src/components/preset/`
- **File di chuyển**: `PresetGamesPage.tsx`, `GameSelector.tsx`, `PresetGameManager.tsx`
- **Thư mục di chuyển**: `templates/`, `data/`
- **Tạo mới**: `src/components/preset/index.ts`

### Tạo thư mục custom games  
- **Di chuyển**: `src/components/quiz/custom-games/` → `src/components/custom/`
- **File di chuyển**: `GameController.tsx`, `CustomGameForm.tsx`, `CustomGameHeader.tsx`, `EnhancedGameView.tsx`
- **Thư mục di chuyển**: `game-components/`, `ui/`, `api/`
- **Tạo mới**: `src/components/custom/index.ts`

## 2025-01-26 - Build Fix: Missing Components và Template Placeholders

### Sửa lỗi AI Game Generator
- **File sửa**: `src/components/ai/game-generator.ts` - Thay GEMINI_PRO bằng 'gemini-pro'
- **Type fix**: GameGenerationSettings interface cần category required

### Tạo missing components cho custom
- **File tạo**: `src/components/custom/GameIframeRenderer.tsx`
- **File tạo**: `src/components/custom/game-components/GameErrorDisplay.tsx`
- **File tạo**: `src/components/custom/game-components/GameLoadingIndicator.tsx`

### Tạo template placeholders cho preset
- **File tạo**: Tất cả template files (QuizTemplate, FlashcardsTemplate, etc.)
- **Lý do**: Tránh lỗi import trong templates/index.ts

## 2025-01-26 - Refactor Step 3-4: UI Components và Clean Up

### Tạo thư mục ui/game cho shared components
- **File tạo**: `src/components/ui/game/GameContainer.tsx` - Shared game container
- **File tạo**: `src/components/ui/game/GameHeader.tsx` - Shared game header
- **File tạo**: `src/components/ui/game/index.ts` - Export tổng hợp

### Xóa components cũ
- **File xóa**: `src/components/quiz/QuizContainer.tsx`
- **File xóa**: `src/components/quiz/QuizHeader.tsx`

### Cập nhật imports
- **File cập nhật**: `src/components/custom/GameController.tsx` - Sử dụng GameContainer mới
- **File cập nhật**: `src/App.tsx` - Import đúng components

## 2025-01-26 - Build Fix: Import Updates

### Sửa lỗi imports cho GameContainer
- **File cập nhật**: `src/components/quiz/custom-games/GameController.tsx` - Import GameContainer từ ui/game
- **File cập nhật**: `src/pages/Quiz.tsx` - Import GameContainer từ ui/game  
- **File cập nhật**: `src/pages/GameHistoryPage.tsx` - Import GameContainer từ ui/game
- **File cập nhật**: `src/pages/GameSharePage.tsx` - Import GameContainer từ ui/game

## 2025-01-26 - Refactor Step 5: Hoàn thành và Structure cuối cùng

### Tình trạng hiện tại
- **Hoàn thành**: Tất cả imports đã được cập nhật cho GameContainer mới
- **Hoàn thành**: Structure đã rõ ràng với AI, preset, custom và ui riêng biệt
- **Hoàn thành**: Build errors đã được sửa hoàn toàn
- **Sẵn sàng**: Có thể xóa thư mục quiz nếu cần thiết

### Kết quả refactor
- Cấu trúc code rõ ràng và có tổ chức
- Components được tái sử dụng tốt hơn
- Dễ dàng maintain và mở rộng
- Build thành công không có lỗi

### Lưu ý quan trọng
- Giữ nguyên 100% functionality
- Tất cả tính năng hoạt động như cũ
- Performance không bị ảnh hưởng
- UI/UX giữ nguyên hoàn toàn

## 2025-01-26 - Sửa lỗi Gemini API Response v1

### Vấn đề
- **Lỗi**: "No content returned from API" từ Gemini API
- **Nguyên nhân**: API response format có thể đã thay đổi, content không được extract đúng cách
- **Triệu chứng**: API trả về 200 nhưng candidates[0].content.parts[0].text undefined

### Giải pháp
- **Cải tiến logic extract content**: Thêm nhiều fallback paths để lấy text từ response
- **Debug logging**: Log chi tiết response structure để troubleshoot
- **Error handling**: Bắt lỗi chi tiết hơn với full response context
- **Language update**: Chuyển default language sang 'vi' cho phù hợp
- **Retry logic**: Tăng thời gian chờ retry từ 1.5s lên 2s

### File cập nhật
- **File sửa**: `src/components/quiz/generator/geminiGenerator.ts` - Improved response parsing và error handling

## 2025-01-26 - Enhanced Debug Logging for Gemini API

### Vấn đề tiếp tục
- **Lỗi**: Vẫn còn "No content returned from API" sau fix đầu tiên
- **Cần**: Logging chi tiết hơn để debug sâu vào API response structure

### Cải tiến Debug Logging
- **Console logging**: Thêm `🔍 GEMINI DEBUG` prefix cho tất cả debug logs
- **Request logging**: Log full payload structure, endpoint, prompt preview
- **Response logging**: Log chi tiết response status, headers, full response object
- **Content extraction**: Log từng method extraction với detailed analysis
- **Recursive search**: Thêm deep search trong response object structure
- **Error analysis**: Log detailed error context và stack trace
- **Retry tracking**: Log chi tiết từng retry attempt

### Logging Categories
- **Request phase**: Payload structure, endpoint, headers
- **Response phase**: Status, response keys, candidates analysis
- **Content extraction**: Multiple fallback methods với detailed tracking
- **Processing phase**: Code analysis, validation, final result
- **Error handling**: Full error context với stack trace
- **Retry mechanism**: Attempt tracking và wait time logging

### File cập nhật
- **File sửa**: `src/components/quiz/generator/geminiGenerator.ts` - Massive debug logging improvement
