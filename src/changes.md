
# Lịch sử thay đổi

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
