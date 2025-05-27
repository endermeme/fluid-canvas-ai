
# Lịch sử thay đổi mã nguồn

## 27/05/2025 - Cải thiện prompt và hiển thị iframe cho custom game
- Cập nhật `customGamePrompt.ts`: tạo prompt tập trung vào full-screen gameplay, loại bỏ text thừa
- Cập nhật `iframe-styles.ts`: thêm styles full-screen (100vw x 100vh), loại bỏ margin/padding
- Cập nhật `GameIframeRenderer.tsx`: iframe absolute positioning để khớp viền màn hình
- Cập nhật `EnhancedGameView.tsx`: loại bỏ Card wrapper, sử dụng layout full-screen

## 30/04/2025 - Tái cấu trúc thư mục CustomGame
- Tạo hai thư mục chính: `src/components/quiz/custom-games/api` và `src/components/quiz/custom-games/ui`
- Di chuyển `src/utils/customGameAPI.ts` vào `src/components/quiz/custom-games/api/customGameAPI.ts`
- Di chuyển các component UI vào thư mục `src/components/quiz/custom-games/ui`
- Cập nhật các import path trong các file liên quan
- Cập nhật tài liệu để phản ánh cấu trúc mới

## 30/04/2025 - Dọn dẹp thư mục src/components
- Tái cấu trúc các thư mục trong `src/components/quiz/utils`
- Di chuyển và hợp nhất các file từ `src/components/quiz/custom-games/utils` vào `src/utils`
- Xóa thư mục `src/components/quiz/custom-games/utils` không cần thiết

## 30/04/2025 - Dọn dẹp project và xóa file không cần thiết
- Xóa `src/unused-files.md` (chuyển thành `src/changes.md`)
- Xóa các file không được sử dụng trong thư mục `src/components/quiz/generator`:
  - `fallbackGenerator.ts` 
  - `responseParser.ts`
- Hợp nhất các file trong thư mục `src/components/quiz/quick-game-selector`

## 30/04/2025 - Sửa lỗi React trong use-toast.ts
- Đã thêm import React trong file `src/hooks/use-toast.ts`
- Sửa lỗi TypeScript: "React refers to a UMD global, but the current file is a module"
- Đảm bảo sử dụng React.useState và React.useEffect đúng cách

## 30/04/2025 - Chuyển đổi tài liệu từ sơ đồ sang văn bản
- Cập nhật `src/custom-game-architecture.md` để hiển thị kiến trúc dưới dạng văn bản thay vì sơ đồ
- Cập nhật `src/custom-game-workflow.md` để mô tả quy trình dưới dạng văn bản chi tiết
- Cải thiện cấu trúc và định dạng để dễ đọc hơn
- Bổ sung thêm chi tiết về các thành phần và quy trình

## Các thay đổi trước đó

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
