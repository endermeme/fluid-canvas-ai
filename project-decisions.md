
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

### Kế hoạch refactor tiếp theo
- Bước 3: Tạo thư mục `ui` cho shared UI components
- Bước 4: Xóa thư mục `quiz` cũ và cập nhật imports
- Bước 5: Tối ưu hóa structure cuối cùng

### Lưu ý
- Giữ nguyên functionality, chỉ tái cấu trúc
- Tất cả imports sẽ được cập nhật ở các lần refactor tiếp theo
