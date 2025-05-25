
# Quyết định và Thay đổi dự án

## Ngày 25/05/2025 - Tái tổ chức cấu trúc thư mục

### Thay đổi:
- **App.tsx**: Cập nhật import TeacherDashboard từ `@/components/shared/`
- **Quiz.tsx**: Cập nhật imports từ `@/components/shared/` và `@/components/custom/`
- **GameHistoryPage.tsx**: Cập nhật import QuizContainer từ `@/components/shared/`
- **GameSharePage.tsx**: Cập nhật imports QuizContainer và EnhancedGameView
- **GameController.tsx**: Sửa import QuizContainer
- **AI types**: Sửa GameApiResponse type để bao gồm metrics
- **Gemini Client**: Cập nhật response type

### Files được tạo mới:
- QuizContainer trong shared/
- GameLoading trong shared/
- CustomGameForm trong custom/
- EnhancedGameView trong custom/
- TeacherDashboard trong shared/
- GameSettings trong shared/
- PresetGameManager trong preset/

### Loại thay đổi: Sửa lỗi import và type definitions
