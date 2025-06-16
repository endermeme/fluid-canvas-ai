# Quyết định thiết kế và sửa đổi

## Ngày 2025-01-16

### Khắc phục lỗi JavaScript trong Custom Game - Cải thiện phát hiện hàm thiếu
- **File đã sửa**: `src/components/quiz/utils/iframe-enhancer.ts`, `src/components/quiz/utils/iframe-utils.ts`
- **Loại thay đổi**: Bug fix - JavaScript error handling
- **Mô tả**: 
  - Cải thiện logic phát hiện hàm thiếu trong `fixJavaScriptErrors()` để tránh tạo stub cho các phương thức built-in
  - Thêm danh sách đầy đủ các phương thức JavaScript, DOM API, Canvas API built-in
  - Kiểm tra tên hàm hợp lệ với regex để tránh lỗi cú pháp "function statement requires a name"
  - Chỉ tạo stub functions cho các hàm thực sự cần thiết như drawObstacles, drawCars, updateGame, resetGame
  - Thêm kiểm tra an toàn cho canvas context trong error handling script
- **Lý do**: Khắc phục lỗi "function statement requires a name" và tránh tạo functions không cần thiết cho built-in methods

### Cải thiện cấu trúc Database Supabase
- **File đã sửa**: Database constraints và relationships
- **Loại thay đổi**: Database optimization - Foreign key constraints
- **Mô tả**: 
  - Thêm foreign key constraints cho tất cả các bảng để đảm bảo tính toàn vẹn dữ liệu
  - Thêm unique constraint cho share_code trong bảng shared_games
  - Tạo các index để tăng hiệu suất truy vấn (game_type, expires_at, is_published, etc.)
  - Thêm triggers để tự động cập nhật updated_at cho các bảng chính
  - Sử dụng CASCADE DELETE để tự động xóa dữ liệu liên quan khi xóa parent record
- **Lý do**: Đảm bảo tính toàn vẹn dữ liệu và cải thiện hiệu suất database

### Cập nhật HomePage - Đơn giản hóa giao diện
- **File đã sửa**: `src/pages/HomePage.tsx`
- **Loại thay đổi**: UI/UX - Tối ưu hóa nội dung
- **Mô tả**: 
  - Thay đổi tên "Tạo Game HTML" thành "Custom Game"
  - Thay đổi tên "Trò Chơi Có Sẵn" thành "Preset Game"
  - Xóa mô tả chi tiết của các nút chính
  - Đồng bộ màu chữ tiêu đề thành xanh (blue-600)
  - Đồng bộ màu nút thành gradient xanh (blue-600 to sky-600)
  - Cập nhật footer thành "Created by CES GLOBAL {year}" bằng tiếng Anh
  - Xóa mô tả "Xem và quản lý các trò chơi..." trong phần Lịch Sử Game
- **Lý do**: Tạo giao diện sạch sẽ, tập trung vào chức năng chính

### Thay đổi giao diện nút quay lại trong PresetGameHeader
- **File đã sửa**: `src/components/quiz/preset-games/PresetGameHeader.tsx`
- **Loại thay đổi**: Cải thiện UI/UX
- **Mô tả**: Thiết kế nút quay lại thành dạng thẻ với biểu tượng cánh cửa thay vì nút ghost đơn giản
- **Lý do**: Tăng tính nhận diện và thẩm mỹ cho giao diện

### Đồng nhất background cho HomePage và PresetGamesPage
- **File đã sửa**: `src/pages/HomePage.tsx`, `src/components/quiz/preset-games/PresetGamesPage.tsx`
- **Loại thay đổi**: UI/UX - Đồng nhất thiết kế
- **Mô tả**: Copy background animation từ CustomGameForm sang HomePage và PresetGamesPage
- **Lý do**: Tạo sự nhất quán với background khoa học có quantum particles và science icons

### Cập nhật mô hình Gemini AI
- **File đã sửa**: `src/constants/api-constants.ts`
- **Loại thay đổi**: Cập nhật cấu hình AI
- **Mô tả**: Thay đổi mô hình từ `gemini-2.5-pro-preview-05-06` sang `gemini-2.5-flash-preview-05-20`
- **Lý do**: Sử dụng mô hình mới hơn và nhanh hơn cho cả custom game và preset game

### Cải thiện logic tìm từ trong WordSearchTemplate
- **File đã sửa**: `src/components/quiz/preset-games/templates/WordSearchTemplate.tsx`
- **Loại thay đổi**: Cải thiện game logic
- **Mô tả**: Chỉ tìm kiếm từ theo hướng thuận (trái sang phải, trên xuống dưới), loại bỏ tìm kiếm từ ngược
- **Lý do**: Đơn giản hóa trò chơi và giảm nhầm lẫn cho người chơi
