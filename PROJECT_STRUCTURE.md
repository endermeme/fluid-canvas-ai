
# AI Game Creator - Cấu Trúc Dự Án

Ứng dụng React cho phép người dùng tạo game giáo dục tương tác bằng AI.

## Cấu Trúc Dự Án

### Trang Chính
- `src/pages/Home.tsx` - Trang chủ với giới thiệu ứng dụng
- `src/pages/Quiz.tsx` - Giao diện tạo game chính với AI
- `src/pages/SharedGame.tsx` - Trang để xem các game đã chia sẻ

### Thành Phần Hiển Thị Game
- `src/components/quiz/GameView.tsx` - Hiển thị game đã tạo ở chế độ toàn màn hình
- `src/components/quiz/GameSettings.tsx` - Giao diện cài đặt cấu hình game (độ khó, thời gian, số câu hỏi)
- `src/components/quiz/GameLoading.tsx` - Màn hình hiển thị khi đang tạo game
- `src/components/quiz/GameError.tsx` - Hiển thị khi có lỗi xảy ra

### Tạo Game Tùy Chỉnh
- `src/components/quiz/QuizGenerator.tsx` - Thành phần chính tạo game với AI
- `src/components/quiz/custom-games/CustomGameForm.tsx` - Form tạo game tùy chỉnh với prompt
- `src/components/quiz/custom-games/GameController.tsx` - Điều khiển luồng tạo game tùy chỉnh

### Lựa Chọn Game Nhanh
- `src/components/quiz/QuickGameSelector.tsx` - Giao diện chọn game nhanh
- `src/components/quiz/quick-game-selector/CustomGameForm.tsx` - Form đơn giản để tạo game nhanh
- `src/components/quiz/quick-game-selector/GameGrid.tsx` - Lưới hiển thị các tùy chọn game
- `src/components/quiz/quick-game-selector/CustomGameDialog.tsx` - Hộp thoại nhập chủ đề game
- `src/components/quiz/quick-game-selector/GameHeader.tsx` - Tiêu đề phần chọn game nhanh

### Hệ Thống Game Mẫu
- `src/components/quiz/preset-games/PresetGamesPage.tsx` - Trang chính cho game mẫu
- `src/components/quiz/preset-games/GameSelector.tsx` - Giao diện chọn loại game mẫu
- `src/components/quiz/preset-games/PresetGameManager.tsx` - Quản lý tạo và hiển thị game mẫu

### Mẫu Game
- `src/components/quiz/preset-games/templates/` - Chứa mẫu cho các loại game khác nhau
  - `QuizTemplate.tsx` - Mẫu trò chơi trắc nghiệm
  - `FlashcardsTemplate.tsx` - Mẫu thẻ ghi nhớ
  - `MatchingTemplate.tsx` - Mẫu ghép cặp
  - `MemoryTemplate.tsx` - Mẫu trò chơi trí nhớ
  - `OrderingTemplate.tsx` - Mẫu sắp xếp thứ tự
  - `WordSearchTemplate.tsx` - Mẫu tìm từ
  - `PictionaryTemplate.tsx` - Mẫu đoán hình
  - `TrueFalseTemplate.tsx` - Mẫu đúng/sai
- `src/components/quiz/preset-games/data/` - Chứa dữ liệu mẫu cho từng loại game

### Hệ Thống Tạo Game AI
- `src/components/quiz/generator/AIGameGenerator.ts` - Lớp tạo game AI chính
- `src/components/quiz/generator/geminiGenerator.ts` - Tích hợp với Google Gemini AI
- `src/components/quiz/generator/responseParser.ts` - Phân tích phản hồi từ AI
- `src/components/quiz/generator/promptBuilder.ts` - Xây dựng prompt cho AI
- `src/components/quiz/generator/gameInstructions.ts` - Hướng dẫn tạo game cho AI
- `src/components/quiz/generator/imageInstructions.ts` - Hướng dẫn về hình ảnh cho AI
- `src/components/quiz/generator/apiUtils.ts` - Tiện ích cho API AI
- `src/components/quiz/generator/fallbackGenerator.ts` - Tạo game dự phòng

### Định Nghĩa Kiểu Dữ Liệu và Cấu Hình
- `src/components/quiz/types.ts` - Định nghĩa kiểu dữ liệu cho game và cài đặt
- `src/components/quiz/gameTypes.ts` - Cấu hình các loại game định trước

### Tiện Ích
- `src/utils/gameExport.ts` - Xử lý chức năng chia sẻ game
- `src/hooks/useCanvasState.ts` - Quản lý trạng thái canvas
- `src/lib/animations.ts` - Hiệu ứng giao diện

## Luồng Người Dùng

### Luồng 1: Tạo Game Tùy Chỉnh
1. Người dùng nhập yêu cầu chi tiết trong form CustomGameForm
2. AI tạo game hoàn chỉnh dựa trên yêu cầu
3. Game được hiển thị toàn màn hình và có thể chơi ngay

### Luồng 2: Tạo Game Từ Mẫu
1. Người dùng chọn loại game mẫu (quiz, flashcards, etc.)
2. Người dùng cấu hình game với cài đặt về:
   - Độ khó (dễ, trung bình, khó)
   - Số lượng câu hỏi/mục
   - Thời gian cho mỗi câu hỏi
   - Thời gian tổng thể
   - Các cài đặt bổ sung theo loại game
3. AI tạo nội dung dựa trên loại game và cài đặt đã chọn
4. Game được hiển thị và người dùng có thể bắt đầu chơi

### Luồng 3: Chọn Game Nhanh
1. Người dùng chọn loại game từ lưới lựa chọn nhanh
2. Người dùng nhập chủ đề qua hộp thoại đơn giản 
3. Game được tạo với cài đặt mặc định

## Cải Tiến Chức Năng
- Giao diện cài đặt game mới với nhiều tùy chỉnh về thời gian, số lượng và độ khó
- Form tạo game tùy chỉnh đơn giản hóa, chỉ cần nhập prompt
- Hệ thống cải tiến Game mẫu với cài đặt chi tiết
- Tính năng chia sẻ game qua liên kết
- Lưu lịch sử số game đã chơi

## Công Nghệ Sử Dụng
- React + TypeScript
- React Router
- Tailwind CSS
- Shadcn/UI Components
- Google Gemini AI
