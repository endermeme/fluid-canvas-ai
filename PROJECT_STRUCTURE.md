
# AI Game Creator - Cấu Trúc Dự Án

Ứng dụng web cho phép người dùng tạo và chia sẻ game giáo dục tương tác bằng AI.

## Cấu Trúc Dự Án

### 1. Trang Chính
- `src/pages/Home.tsx` - Trang chủ giới thiệu ứng dụng
- `src/pages/Quiz.tsx` - Trang tạo game với AI
- `src/pages/SharedGame.tsx` - Trang xem game đã chia sẻ
- `src/pages/NotFound.tsx` - Trang 404

### 2. Hệ Thống Game
#### Tạo Game & Hiển Thị
- `src/components/quiz/GameView.tsx` - Hiển thị game ở chế độ toàn màn hình
- `src/components/quiz/GameLoading.tsx` - Màn hình loading khi đang tạo game
- `src/components/quiz/GameError.tsx` - Hiển thị khi có lỗi xảy ra

#### Tạo Game Tùy Chỉnh
- `src/components/quiz/custom-games/CustomGameForm.tsx` - Form tạo game tùy chỉnh
- `src/components/quiz/custom-games/GameController.tsx` - Điều khiển luồng tạo game

#### Game Mẫu
- `src/components/quiz/preset-games/PresetGamesPage.tsx` - Trang chọn game mẫu
- `src/components/quiz/preset-games/GameSelector.tsx` - Chọn loại game mẫu
- `src/components/quiz/preset-games/templates/*` - Các mẫu game khác nhau

### 3. Hệ Thống Chia Sẻ & Theo Dõi
#### Chia Sẻ Game
- `src/components/quiz/share/ShareGamePage.tsx` - Trang chia sẻ game với người chơi
- `src/components/quiz/share/GameDashboard.tsx` - Bảng điều khiển theo dõi người tham gia
- `src/components/quiz/share/GameHistory.tsx` - Lịch sử các game đã tạo

#### Tiện Ích Hỗ Trợ
- `src/utils/gameParticipation.ts` - Quản lý người tham gia và chống gian lận
- `src/utils/gameExport.ts` - Xuất và chia sẻ game

### 4. Tạo Game Với AI
- `src/components/quiz/generator/AIGameGenerator.ts` - Lớp tạo game AI chính
- `src/components/quiz/generator/geminiGenerator.ts` - Tích hợp Gemini AI
- `src/components/quiz/generator/promptBuilder.ts` - Xây dựng prompt cho AI
- `src/components/quiz/generator/responseParser.ts` - Phân tích phản hồi AI

## Luồng Người Dùng

### 1. Tạo Game
1. Chọn loại game (tùy chỉnh hoặc mẫu có sẵn)
2. Nhập chủ đề và cấu hình game
3. AI tạo nội dung game
4. Game được hiển thị và có thể chơi ngay

### 2. Chia Sẻ Game & Theo Dõi Người Chơi
1. Tạo game mới và nhấn nút "Chia sẻ"
2. Sao chép liên kết chia sẻ hoặc vào trang dashboard
3. Người chơi nhập tên để tham gia game
4. Người tạo xem thống kê và danh sách người tham gia
5. Có thể xuất dữ liệu người chơi ra file CSV

### 3. Xem Lịch Sử Game
1. Vào trang "Lịch sử game"
2. Xem danh sách các game đã tạo
3. Mở dashboard hoặc xem lại game bất kỳ

## Tính Năng Nổi Bật

### Tạo Game Bằng AI
- Tạo nội dung game dựa trên chủ đề người dùng nhập
- Hỗ trợ nhiều loại game: quiz, trí nhớ, ghép cặp, v.v.
- Giao diện đơn giản, dễ sử dụng

### Chia Sẻ & Theo Dõi
- Chia sẻ game qua liên kết
- Ghi nhận thông tin người tham gia
- Chống gian lận bằng kiểm soát IP
- Dashboard quản lý và thống kê
- Xuất dữ liệu người tham gia

### Trải Nghiệm Người Dùng
- Giao diện responsive
- Các game tương tác trực quan
- Dễ dàng chơi lại hoặc tạo game mới

## Cập Nhật Mới

### Hệ Thống Chia Sẻ & Theo Dõi Người Chơi
- Thêm trang chia sẻ game yêu cầu tên người tham gia
- Theo dõi IP để kiểm soát gian lận
- Dashboard hiển thị danh sách người tham gia
- Trang lịch sử game để dễ dàng quản lý

### Cải Tiến Giao Diện
- Nút điều hướng nhất quán ở các trang
- Bố cục gọn gàng, khoa học hơn
- Hiển thị thông tin game rõ ràng

### Tối Ưu Hóa
- Tái cấu trúc mã nguồn để dễ bảo trì
- Chia nhỏ các component để nâng cao hiệu suất
- Cải thiện hệ thống routing
