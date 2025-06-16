# Quyết định thiết kế và sửa đổi

## Ngày 2025-01-16

### Khắc phục lỗi React Hooks trong CustomGameForm
- **File đã sửa**: `src/components/quiz/custom-games/CustomGameForm.tsx`
- **Loại thay đổi**: Bug fix - React hooks order
- **Mô tả**: 
  - Di chuyển conditional return check của `isGenerating` xuống cuối component sau khi tất cả hooks đã được gọi
  - Đảm bảo tất cả hooks (`useState`, `useToast`, `useNavigate`, `React.useMemo`) được gọi theo cùng thứ tự mỗi lần render
  - Sửa lỗi "Rendered fewer hooks than expected" khi có early return statement
- **Lý do**: React yêu cầu hooks phải được gọi theo cùng thứ tự trong mỗi lần render để tránh lỗi

### Tối ưu hóa Animation Background và Loading Progress System
- **File đã sửa**: `src/hooks/useLoadingProgress.ts`, `src/components/ui/background-particles.tsx`, `src/components/quiz/GameLoading.tsx`, `src/components/quiz/custom-games/CustomGameForm.tsx`, `src/pages/HomePage.tsx`, `src/components/quiz/preset-games/PresetGamesPage.tsx`
- **Loại thay đổi**: UI/UX optimization - Background animation và loading system
- **Mô tả**: 
  - Tạo component `BackgroundParticles` tối ưu để tránh particles di chuyển loạn khi gõ phím
  - Tạo hook `useLoadingProgress` để quản lý progress bar thông minh với các giai đoạn rõ ràng
  - Cải thiện progress bar để không bị kẹt ở 98% và tránh hiển thị 101%
  - Sử dụng `React.useMemo` để stable positions cho science icons và particles
  - Progress bar hiện có animation mượt mà từng giai đoạn với thanh đếm phần trăm hiển thị chính xác
  - Áp dụng tối ưu hóa cho cả 3 màn hình: HomePage, CustomGameForm, và PresetGamesPage
- **Lý do**: Khắc phục vấn đề animation bị loạn khi user interaction và cải thiện trải nghiệm loading

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

### Cập nhật GameLoading với Stage Progress và loại bỏ stub functions
- **File đã sửa**: `src/components/quiz/GameLoading.tsx`, `src/components/quiz/utils/iframe-enhancer.ts`
- **File đã tạo**: `src/components/quiz/game-components/GameStageProgress.tsx`
- **Loại thay đổi**: UI/UX improvement + Bug fix
- **Mô tả**: 
  - Thay đổi progress bar thành dạng stages với science icons (Atom, FlaskConical, Microscope, TestTube, Code)
  - Mỗi giai đoạn có icon khoa học riêng, animation xoay khi active
  - Bỏ hoàn toàn việc tạo stub functions trong iframe-enhancer để tránh lỗi "function statement requires a name"
  - Stage progress có animation mượt mà và hiển thị giai đoạn hiện tại rõ ràng
- **Lý do**: Cải thiện trải nghiệm người dùng với progress visual tốt hơn và khắc phục lỗi JavaScript
