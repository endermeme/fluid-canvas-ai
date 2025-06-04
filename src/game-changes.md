
# Game Changes Log

## 2025-06-04 - Ưu tiên sử dụng ảnh từ Wikimedia Commons cho game Đoán Hình

### Files thay đổi:
- **src/components/quiz/preset-games/PresetGameManager.tsx** - SỬA: Cập nhật prompt AI ưu tiên sử dụng ảnh từ Wikimedia Commons

### Loại thay đổi:
- Ưu tiên sử dụng ảnh từ Wikimedia Commons (https://commons.wikimedia.org) cho game Đoán Hình
- Thêm hướng dẫn định dạng URL Wikimedia Commons cho AI
- Tăng chất lượng và độ tin cậy của nguồn ảnh

## 2025-06-04 - Chuẩn hóa header cho tất cả game templates

### Files thay đổi:
- **src/components/quiz/preset-games/PresetGameHeader.tsx** - SỬA: Thêm onBack prop để xử lý custom back handler
- **src/components/quiz/preset-games/PresetGameManager.tsx** - SỬA: Truyền onBack handler cho header và templates

### Loại thay đổi:
- Chuẩn hóa việc sử dụng header chung cho tất cả game templates
- Loại bỏ nút "out" riêng trong các game templates
- Đảm bảo tất cả game sử dụng PresetGameHeader thống nhất

## 2025-06-04 - Cập nhật prompt AI linh hoạt cho nguồn ảnh

### Files thay đổi:
- **src/components/quiz/preset-games/PresetGameManager.tsx** - SỬA: Cập nhật prompt AI yêu cầu URL ảnh từ internet mà không cố định nguồn cụ thể

### Loại thay đổi:
- Loại bỏ yêu cầu nguồn ảnh cụ thể (Pexels/Pixabay/Freepik)
- Chỉ yêu cầu AI lấy URL ảnh thật từ internet dạng link
- Tăng tính linh hoạt cho việc tạo game Đoán Hình

## 2025-06-04 - Cập nhật prompt AI để yêu cầu hình ảnh thật cho game Đoán Hình

### Files thay đổi:
- **src/components/quiz/preset-games/PresetGameManager.tsx** - SỬA: Cập nhật prompt AI yêu cầu URL hình ảnh thật từ Pexels/Pixabay

### Loại thay đổi:
- Cập nhật prompt AI cho game Pictionary yêu cầu URL hình ảnh thực tế
- Loại bỏ việc fallback về sample data cho game Đoán Hình
- Đảm bảo AI cung cấp URL từ các nguồn ảnh miễn phí như Pexels, Pixabay, Freepik

## 2025-06-04 - Xóa file pictionarySampleData.ts

### Files thay đổi:
- **src/components/quiz/preset-games/data/pictionarySampleData.ts** - XÓA: Xóa file dữ liệu mẫu Pictionary

### Loại thay đổi:
- Xóa hoàn toàn file dữ liệu mẫu cho game Đoán Hình
- Loại bỏ dữ liệu cứng trong code

## 2025-06-04 - Thay thế hình ảnh mẫu bằng hình ảnh thực tế từ Pexels

### Files thay đổi:
- **src/components/quiz/preset-games/data/pictionarySampleData.ts** - SỬA: Thay thế tất cả URL hình ảnh placeholder bằng URL thực tế từ Pexels

### Loại thay đổi:
- Loại bỏ hoàn toàn hình ảnh mẫu và placeholder
- Sử dụng hình ảnh thực tế từ Pexels API
- Cải thiện chất lượng hình ảnh trong game Đoán Hình
- Tất cả hình ảnh đều có URL thực tế và hoạt động

## 2025-06-04 - Loại bỏ phụ thuộc vào Unsplash và cho phép sử dụng ảnh từ bất kỳ nguồn nào

### Files thay đổi:
- **src/components/quiz/preset-games/data/pictionarySampleData.ts** - SỬA: Thay thế URL Unsplash bằng Pixabay và các nguồn mở khác
- **src/utils/media-utils.ts** - TẠO MỚI: File utility để xử lý ảnh từ nhiều nguồn
- **src/components/quiz/preset-games/templates/PictionaryTemplate.tsx** - SỬA: Hỗ trợ nhiều nguồn ảnh và cải thiện xử lý lỗi

### Loại thay đổi:
- Loại bỏ phụ thuộc vào Unsplash trong PictionaryTemplate
- Thêm module xử lý media để hỗ trợ nhiều nguồn ảnh
- Thêm fallback cho ảnh không tải được
- Tăng tính linh hoạt cho nguồn ảnh trong game

## 2025-01-03 - Fix lỗi game "Đúng hay Sai" và "Đoán Hình"

### Files thay đổi:
- **src/components/quiz/preset-games/templates/TrueFalseTemplate.tsx** - SỬA: Fix hiển thị nút lựa chọn Đúng/Sai
- **src/components/quiz/preset-games/templates/PictionaryTemplate.tsx** - SỬA: Thay thế hình ảnh giả bằng hình ảnh thực từ Unsplash
- **src/components/quiz/preset-games/data/pictionarySampleData.ts** - SỬA: Cập nhật URL hình ảnh thực tế

### Loại thay đổi:
- Sửa lỗi game Đúng hay Sai không hiển thị được nút lựa chọn
- Thay thế hình ảnh example.com bằng hình ảnh thực tế từ Unsplash
- Cải thiện trải nghiệm người dùng với hình ảnh chất lượng cao

## 2025-01-03 - Refactor GameSharePage thành các component nhỏ hơn

### Files thay đổi:
- **src/components/game-share/GameShareForm.tsx** - TẠO MỚI: Component form tham gia game
- **src/components/game-share/ParticipantsList.tsx** - TẠO MỚI: Component danh sách người chơi 
- **src/components/game-share/ShareSection.tsx** - TẠO MỚI: Component chia sẻ game
- **src/pages/GameSharePage.tsx** - SỬA: Refactor thành component nhỏ hơn

### Loại thay đổi:
- Tách GameSharePage từ 521 dòng thành 4 component riêng biệt
- Cải thiện khả năng bảo trì và tái sử dụng code
- Tách logic form, danh sách người chơi và phần chia sẻ
- Giữ nguyên 100% chức năng hiện tại

## 2025-01-03 - Sửa lỗi form tham gia game và cải thiện real-time sync

### Files thay đổi:
- **src/pages/GameSharePage.tsx** - SỬA: Sửa form không đóng và thêm auto-refresh participants

### Loại thay đổi:
- Sửa lỗi form không đóng sau khi submit thành công
- Thêm loading state cho form để tránh double submit
- Thêm auto-refresh danh sách người chơi mỗi 10 giây
- Thêm nút "Làm mới" thủ công cho danh sách người chơi
- Cải thiện UI feedback với loading states và visual indicators
- Reset form sau khi submit thành công

## 2025-01-03 - Sửa lỗi RLS policy cho game_participants

### Files thay đổi:
- **src/pages/GameSharePage.tsx** - SỬA: Xử lý lỗi RLS khi tham gia game
- **src/utils/gameParticipation.ts** - SỬA: Cập nhật logic xử lý lỗi database

### Loại thay đổi:
- Sửa lỗi "new row violates row-level security policy" 
- Thêm fallback khi không thể ghi vào Supabase
- Cải thiện error handling cho form tham gia game

## 2025-01-03 - Sửa lỗi build sau khi dọn dẹp code

### Files thay đổi:
- **src/components/quiz/hooks/useIframeManager.ts** - SỬA: Loại bỏ loadAttempts và maxRetryAttempts không cần thiết
- **src/components/quiz/custom-games/EnhancedGameView.tsx** - SỬA: Loại bỏ props loadAttempts và maxAttempts
- **src/components/quiz/custom-games/GameController.tsx** - SỬA: Import từ CustomGameForm đúng path
- **src/components/quiz/custom-games/ui/index.ts** - SỬA: Loại bỏ export CustomGameForm không tồn tại

### Loại thay đổi:
- Sửa lỗi TypeScript sau khi dọn dẹp code
- Đơn giản hóa GameLoadingIndicator chỉ nhận progress prop
- Sửa import paths sau khi xóa file trùng lặp

## 2025-01-03 - Dọn dẹp Custom Game và tách Prompt ra JSON

### Files thay đổi:
- **src/components/quiz/generator/gamePrompts.json** - TẠO MỚI: Tách prompt ra file JSON riêng
- **src/components/quiz/generator/geminiPrompt.ts** - SỬA: Đọc prompt từ JSON
- **src/components/quiz/generator/geminiGenerator.ts** - SỬA: Đơn giản hóa, xóa canvas/difficulty functions
- **src/components/quiz/custom-games/CustomGameForm.tsx** - SỬA: Loại bỏ canvas mode và difficulty settings
- **src/components/quiz/generator/types.ts** - SỬA: Đơn giản hóa interface
- **src/components/quiz/custom-games/ui/index.ts** - SỬA: Xóa exports không cần thiết

### Files xóa:
- **src/components/quiz/custom-games/ui/CustomGameForm.tsx** - XÓA: File trùng lặp
- **src/components/quiz/generator/customGamePrompt.ts** - XÓA: Đã tách ra JSON
- **src/components/quiz/generator/promptBuilder.ts** - XÓA: Không cần thiết

### Loại thay đổi:
- Dọn dẹp code thừa và functions không sử dụng
- Tách prompt template ra file JSON độc lập
- Đơn giản hóa logic custom game chỉ còn input textarea
- Loại bỏ canvas mode và difficulty settings không cần thiết
