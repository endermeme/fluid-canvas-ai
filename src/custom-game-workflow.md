
# Quy trình hoạt động của Custom Game

## Tổng quan

Custom Game là tính năng cho phép người dùng tạo các trò chơi tương tác bằng cách sử dụng AI để tạo ra code HTML, CSS và JavaScript dựa trên mô tả của người dùng. Dưới đây là quy trình tổng thể và các file liên quan.

## Quy trình hoạt động chi tiết

### 1. Người dùng nhập mô tả game
- Người dùng truy cập vào trang tạo game tùy chỉnh
- Điền vào form mô tả chi tiết về game muốn tạo
- Form được xử lý bởi CustomGameForm.tsx

### 2. Gửi yêu cầu tới AI (Gemini)
- CustomGameForm gọi đến AIGameGenerator
- AIGameGenerator tạo prompt dựa trên mô tả người dùng
- Prompt được gửi tới Gemini API thông qua geminiGenerator.ts
- Quá trình này có cơ chế retry nếu gặp lỗi

### 3. Xử lý phản hồi từ AI
- Phản hồi từ AI được nhận và xử lý bởi processGameCode()
- Mã HTML được làm sạch và chuẩn hóa
- Tiêu đề game được trích xuất từ nội dung
- Tạo đối tượng MiniGame chứa thông tin game

### 4. Nâng cao nội dung iframe
- MiniGame được gửi tới EnhancedGameView
- Nội dung HTML được cải thiện bởi enhanceIframeContent() trong iframe-utils.ts
- Thêm xử lý lỗi và theo dõi trạng thái loading
- Thêm CSS và script hỗ trợ cho game

### 5. Hiển thị game cho người dùng
- Game được hiển thị trong iframe bởi GameIframeRenderer
- Hiển thị loading indicator trong khi game đang tải
- Xử lý các lỗi nếu có
- Hiển thị các điều khiển qua CustomGameHeader

### 6. Quản lý trạng thái game
- GameController.tsx quản lý toàn bộ trạng thái
- Chuyển đổi giữa form và hiển thị game
- Xử lý các tương tác từ người dùng
- Quản lý việc tạo game mới

### 7. Chia sẻ game (tùy chọn)
- Người dùng có thể chọn chia sẻ game
- Game được lưu vào cơ sở dữ liệu thông qua customGameAPI.ts
- Tạo URL chia sẻ độc đáo
- Người dùng có thể sao chép hoặc xem mã QR

## Các file chính và vai trò

### Components UI
1. **GameController.tsx**: Điều khiển luồng làm việc tổng thể
2. **CustomGameForm.tsx**: Giao diện nhập mô tả game
3. **EnhancedGameView.tsx**: Hiển thị game trong iframe
4. **CustomGameHeader.tsx**: Thanh điều hướng và điều khiển
5. **GameIframeRenderer.tsx**: Component iframe đặc biệt
6. **GameErrorDisplay.tsx**: Hiển thị lỗi nếu có
7. **GameLoadingIndicator.tsx**: Hiển thị trạng thái loading

### API và xử lý dữ liệu
1. **customGameAPI.ts**: Tương tác với Supabase
2. **geminiGenerator.ts**: Giao tiếp với AI Gemini
3. **geminiPrompt.ts**: Template cho prompt AI
4. **iframe-utils.ts**: Utilities xử lý nội dung iframe

### Hooks và tiện ích
1. **useIframeManager.tsx**: Hook quản lý iframe
2. **useGameShareManager.tsx**: Hook quản lý chia sẻ game

## Xử lý lỗi và các trường hợp đặc biệt

### 1. Xử lý lỗi khi gọi AI
- Cơ chế retry tự động khi gọi API thất bại
- Hiển thị thông báo lỗi thân thiện cho người dùng
- Log chi tiết để giúp gỡ lỗi

### 2. Xử lý iframe trống hoặc lỗi
- Timeout khi iframe không tải đúng
- Theo dõi và thông báo lỗi JavaScript trong iframe
- Hiển thị giao diện lỗi thân thiện

### 3. Tối ưu cho thiết bị di động
- Thêm CSS đặc biệt cho touch devices
- Xử lý sự kiện touch
- Responsive design cho mọi kích thước màn hình

### 4. Bảo mật
- Sandbox cho iframe để ngăn chặn mã độc
- Xử lý an toàn nội dung từ AI
- Kiểm tra và làm sạch mã HTML trước khi hiển thị

## Các cải tiến trong tương lai
- Cho phép người dùng chỉnh sửa mã HTML trực tiếp
- Thêm templates game để người dùng chọn
- Cải thiện hiệu suất AI với cache
- Thêm tùy chọn tùy chỉnh giao diện game
- Tích hợp với các hệ thống đánh giá và phân tích
