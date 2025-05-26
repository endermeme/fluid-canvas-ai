
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

### Kế hoạch refactor tiếp theo
- Bước 5: Xóa hoàn toàn thư mục `quiz` và cập nhật tất cả imports còn lại
- Bước 6: Tối ưu hóa structure cuối cùng và kiểm tra toàn bộ hệ thống

### Lưu ý
- Giữ nguyên functionality, chỉ tái cấu trúc
- Tất cả imports đã được cập nhật cho UI components mới
- Structure hiện tại đã rõ ràng hơn với AI, preset, custom và ui riêng biệt
- Build errors đã được sửa, sẵn sàng cho bước 5
