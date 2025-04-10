
# AI Game Creator - Project Structure

Ứng dụng React cho phép người dùng tạo game giáo dục tương tác bằng AI.

## Cấu trúc Dự Án

### Trang Chính
- `src/pages/Home.tsx` - Trang chủ với giới thiệu ứng dụng
- `src/pages/Quiz.tsx` - Giao diện tạo game chính với AI
- `src/pages/SharedGame.tsx` - Trang để xem các game đã chia sẻ

### Thành phần Chính
- `src/components/quiz/GameView.tsx` - Hiển thị game đã tạo ở chế độ toàn màn hình
- `src/components/quiz/GameSettings.tsx` - Giao diện cài đặt cấu hình game
- `src/components/quiz/GameLoading.tsx` - Hiển thị trạng thái đang tải
- `src/components/quiz/GameError.tsx` - Hiển thị khi có lỗi

### Tạo Game với AI
- `src/components/quiz/QuizGenerator.tsx` - Thành phần chính tạo game với AI
- `src/components/quiz/custom-games/CustomGameForm.tsx` - Form tạo game tùy chỉnh
- `src/components/quiz/custom-games/GameController.tsx` - Điều khiển luồng tạo game

### Hệ thống Game Mẫu
- `src/components/quiz/preset-games/PresetGamesPage.tsx` - Trang chính cho game mẫu
- `src/components/quiz/preset-games/GameSelector.tsx` - Giao diện chọn loại game
- `src/components/quiz/preset-games/PresetGameManager.tsx` - Quản lý việc tạo và hiển thị game mẫu

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

### Lựa chọn Game Nhanh
- `src/components/quiz/quick-game-selector/index.tsx` - Thành phần chính cho chọn game nhanh
- `src/components/quiz/quick-game-selector/CustomGameForm.tsx` - Form đơn giản hóa để tạo game nhanh
- `src/components/quiz/quick-game-selector/GameGrid.tsx` - Hiển thị lưới các tùy chọn game
- `src/components/quiz/quick-game-selector/CustomGameDialog.tsx` - Hộp thoại để nhập chủ đề game
- `src/components/quiz/quick-game-selector/GameHeader.tsx` - Tiêu đề phần chọn game nhanh

### Tạo Game với AI
- `src/components/quiz/generator/AIGameGenerator.ts` - Lớp tạo game AI chính
- `src/components/quiz/generator/geminiGenerator.ts` - Tích hợp với Google Gemini AI
- `src/components/quiz/generator/responseParser.ts` - Phân tích phản hồi từ AI
- `src/components/quiz/generator/promptBuilder.ts` - Xây dựng prompt cho AI
- `src/components/quiz/generator/gameInstructions.ts` - Hướng dẫn tạo game cho AI
- `src/components/quiz/generator/imageInstructions.ts` - Hướng dẫn về hình ảnh cho AI
- `src/components/quiz/generator/apiUtils.ts` - Tiện ích cho API AI
- `src/components/quiz/generator/fallbackGenerator.ts` - Tạo game dự phòng
- `src/components/quiz/generator/types.ts` - Định nghĩa kiểu dữ liệu cho hệ thống tạo game

### Cấu hình và Loại Game
- `src/components/quiz/types.ts` - Định nghĩa kiểu dữ liệu cho game và cài đặt
- `src/components/quiz/gameTypes.ts` - Cấu hình các loại game định trước

### Tiện ích
- `src/utils/gameExport.ts` - Xử lý chức năng chia sẻ game
- `src/hooks/useCanvasState.ts` - Quản lý trạng thái canvas cho phần tử tương tác
- `src/lib/animations.ts` - Tiện ích hoạt hình cho giao diện người dùng

## Luồng Người Dùng
1. Người dùng có hai lựa chọn chính:
   - Tạo game tùy chỉnh qua trang Quiz
   - Chọn game mẫu qua trang Preset Games
2. Đối với game tùy chỉnh:
   - Người dùng nhập chi tiết game trong CustomGameForm
   - AI tạo game tùy chỉnh dựa trên yêu cầu người dùng
3. Đối với game mẫu:
   - Người dùng chọn loại game từ các tùy chọn đã định sẵn
   - Người dùng tùy chỉnh thông số và chủ đề game
   - AI tạo game dựa trên loại và thông số đã chọn
4. Game được hiển thị toàn màn hình trong thành phần GameView
5. Người dùng có thể chơi, khởi động lại và chia sẻ game với người khác

## Tính năng
- Tạo game trực tiếp từ giao diện chính
- Nhiều mẫu game cho các hoạt động học tập khác nhau
- Theo dõi số lần chơi game để đo lường tương tác người dùng
- Tạo game giáo dục bằng AI (Google Gemini)
- Tính năng quản lý thời gian bao gồm bộ đếm thời gian cho từng câu hỏi, tổng thời gian và thời gian thưởng
- Hiển thị game toàn màn hình để trải nghiệm người dùng tốt hơn

## Công nghệ Sử dụng
- React
- React Router
- Tailwind CSS
- Shadcn/UI Components
- Google Gemini AI để tạo game
