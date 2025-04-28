
# Cấu trúc Project

## 🌐 Pages (/src/pages)
- `HomePage.tsx` - Trang chủ
- `Quiz.tsx` - Trang tạo và chơi quiz
- `GameSharePage.tsx` - Trang chia sẻ game
- `GameHistoryPage.tsx` - Trang lịch sử game

## 🧩 Components (/src/components)

### Quiz
- `/quiz/components/` - Components cơ bản của quiz
  - `GameContainer.tsx` - Container hiển thị game
  - `GameHeader.tsx` - Header của game 

- `/quiz/custom-games/` - Chức năng tạo game tùy chỉnh
  - `CustomGameForm.tsx` - Form tạo game
  - `GameController.tsx` - Điều khiển game
  - `EnhancedGameView.tsx` - Giao diện game nâng cao

- `/quiz/preset-games/` - Các game có sẵn
  - `templates/` - Mẫu các loại game
  - `GameSelector.tsx` - Chọn loại game
  - `PresetGameManager.tsx` - Quản lý game có sẵn

- `/quiz/share/` - Chức năng chia sẻ
  - `GameDashboard.tsx` - Bảng điều khiển game
  - `TeacherDashboard.tsx` - Bảng điều khiển giáo viên

- `/quiz/generator/` - Tạo game với AI
  - `geminiGenerator.ts` - Tạo game với Gemini AI
  - `promptBuilder.ts` - Xây dựng prompt

### UI (/src/components/ui)
- Các components UI cơ bản từ shadcn/ui

## 🎯 Hooks (/src/hooks)
- `useCanvasState.ts` - Quản lý state canvas
- `useDragAndDrop.ts` - Xử lý kéo thả
- `use-toast.ts` - Hiển thị thông báo
- `use-mobile.tsx` - Kiểm tra thiết bị di động

## 🛠 Utils (/src/utils)
- `gameParticipation.ts` - Xử lý tham gia game
- `gameExport.ts` - Xuất dữ liệu game
- `media-utils.ts` - Xử lý media
- `debug-utils.ts` - Công cụ debug

## ⚡ Integrations (/src/integrations)
- `/supabase/` - Tích hợp với Supabase
  - `client.ts` - Khởi tạo client
  - `types.ts` - Định nghĩa types

## 📝 Constants (/src/constants)
- `api-constants.ts` - Các hằng số API

## 📒 Tài liệu
- `changes.md` - Lịch sử thay đổi
- `project-structure.md` - Cấu trúc project (file này)
- `unused-files.md` - Danh sách file không sử dụng

