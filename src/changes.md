
# Lịch sử thay đổi

- Refactor iframe-utils.ts thành các modules nhỏ hơn: iframe-enhancer.ts, iframe-scripts.ts, iframe-styles.ts và iframe-utils.ts mới nhỏ gọn hơn
- Refactor EnhancedGameView.tsx thành các components nhỏ hơn: GameErrorDisplay, GameLoadingIndicator, GameIframeRenderer và các hooks useIframeManager, useGameShareManager
- Cập nhật giao diện CustomGameForm: căn giữa màn hình, thêm hiệu ứng gradient và backdrop-blur, nâng cấp thiết kế Card
- Ẩn tiêu đề game trên header và xoá phản hồi tại header game tùy chỉnh
- Ẩn tiêu đề game trên header
- Thêm form nhập tên và tuổi trước khi tham gia game
- Cải thiện thông báo khi game hết hạn
- Ẩn nút giáo viên cho người chơi thường
- Cập nhật hiển thị thông tin người chơi
- Thêm cơ chế chống gian lận
- Sửa lỗi cú pháp trong geminiPrompt.ts (escape backticks trong template string)
- Sửa lỗi iframe trắng bằng cách cải thiện trình xử lý nội dung và thêm phát hiện khi game đã tải xong
- Sửa lỗi cú pháp trong iframe-utils.ts (các lỗi dấu phẩy và cú pháp)
- Cải thiện hàm shake() trong iframe-utils.ts thông qua việc thay thế template string bằng chuỗi thông thường
- Thêm xử lý thời gian chờ và cơ chế kiểm tra nội dung iframe để giải quyết vấn đề màn hình trắng
- Thêm xử lý cho các định dạng ảnh từ API Gemini (base64 và URL)
- Sửa lỗi TypeScript liên quan đến Promise trong xử lý nội dung iframe
- Cải thiện chức năng chia sẻ game để giảm hiện tượng flash màn hình và sửa lỗi không tìm thấy game trong link chia sẻ
- Thêm các chức năng thiếu trong gameParticipation.ts: getGameSession, exportParticipantsToCSV, maskIpAddress, getAllGameSessions
- Thêm interface GameSession vào types.ts để hỗ trợ các chức năng quản lý phiên game và người chơi
- Sửa lỗi TypeScript trong gameParticipation.ts: xoá định nghĩa trùng lặp GameParticipant và thêm thuộc tính score
- Sửa lỗi TypeScript trong gameParticipation.ts: thêm kiểm tra thuộc tính score trong dữ liệu từ Supabase
- Thêm tài liệu về quy trình hoạt động của custom game và kiến trúc hệ thống
