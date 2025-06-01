
# Tài nguyên dự án

## Cấu trúc thư mục

### Core components
- `src/components/quiz`: Chứa các components chính của ứng dụng game
  - `custom-games`: Components cho chức năng game tùy chỉnh
  - `preset-games`: Components cho các game có sẵn
  - `share`: Components liên quan đến chia sẻ game
  - `utils`: Các utility functions cho game
  - `components`: Các components dùng chung cho game
  - `hooks`: Các hooks tái sử dụng
  - `generator`: Các modules tạo game từ AI

### Utils
- `src/utils`: Các utility functions dùng chung cho toàn bộ ứng dụng
- `src/hooks`: Các custom hooks
- `src/integrations`: Các tích hợp với dịch vụ bên ngoài (Supabase)

## Các modules chính

1. **Custom Games**: Tạo và quản lý game tùy chỉnh
   - `GameController.tsx`: Điều khiển luồng tạo game
   - `CustomGameForm.tsx`: Form nhập liệu để tạo game
   - `EnhancedGameView.tsx`: Hiển thị game trong iframe

2. **Preset Games**: Các game có sẵn với template
   - `PresetGameManager.tsx`: Quản lý các game có sẵn
   - `GameSelector.tsx`: Lựa chọn loại game
   - Templates: Mẫu cho từng loại game

3. **Game Sharing**: Chia sẻ game
   - `GameDashboard.tsx`: Bảng điều khiển game
   - `TeacherDashboard.tsx`: Giao diện cho giáo viên

4. **Iframe Utils**: Xử lý iframe cho game
   - `iframe-utils.ts`: Tiện ích xử lý iframe
   - `iframe-enhancer.ts`: Nâng cao nội dung iframe
   - `iframe-scripts.ts`: Scripts cho iframe
   - `iframe-styles.ts`: Styles cho iframe

## Các file không cần thiết đã được xóa

1. **Generator Files**
   - `fallbackGenerator.ts`: Không được sử dụng
   - `responseParser.ts`: Chức năng đã được tích hợp vào geminiGenerator.ts

2. **Quick Game Selector**
   - `index.tsx`: Trùng lặp với QuickGameSelector.tsx
   - `CustomGameDialog.tsx`: Chức năng đã được thay thế bởi CustomGameForm.tsx

3. **Các file tài liệu không cần thiết**
   - `unused-files.md`: Đã được tích hợp vào changes.md
