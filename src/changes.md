


# Lịch sử thay đổi mã nguồn

## 25/04/2024 - Cập nhật cấu hình Vite để cho phép tất cả host
- Đã thêm các tên miền vào `allowedHosts` trong `vite.config.ts`: aurabusiness.tech, aurabusiness.tech:8080
- Đã thêm tùy chọn `.ngrok-free.app` để cho phép tất cả các subdomain ngrok
- Đã thêm tùy chọn `all` để cho phép tất cả các host khi cần thiết
- Nguyên nhân lỗi: Vite mặc định chỉ cho phép một số host cụ thể

## 25/04/2024 - Ghi chú về vấn đề Node.js phiên bản cũ
- Dự án Vite yêu cầu Node.js v14.18+ hoặc 16+
- Node.js v10.19.0 không hỗ trợ cú pháp import ES modules mà Vite sử dụng
- Cần nâng cấp Node.js lên phiên bản mới hơn để chạy dự án
- Có thể sử dụng NVM (Node Version Manager) để dễ dàng cài đặt và quản lý các phiên bản Node.js

## 25/04/2024 - Cập nhật QuizHeader với chức năng chia sẻ game
- Tích hợp chức năng chia sẻ game với QR code và link
- Thêm props để hỗ trợ chia sẻ game tùy chỉnh
- Tích hợp với Supabase để lưu và chia sẻ game
- Thêm thông báo toast cho các tương tác
- Thêm chức năng sao chép đường dẫn vào clipboard

## 25/04/2024 - Sửa lỗi chia sẻ game tùy chỉnh

### Tệp đã chỉnh sửa:
1. `src/components/quiz/custom-games/utils/customGameAPI.ts`:
   - Thêm log chi tiết để theo dõi quá trình lưu và truy xuất game
   - Cải thiện xử lý lỗi và thông báo
   - Đảm bảo dữ liệu được lưu đúng định dạng vào Supabase

2. `src/components/quiz/custom-games/EnhancedGameView.tsx`:
   - Thêm trạng thái isSharing để kiểm soát nút chia sẻ
   - Cải thiện quá trình tạo URL chia sẻ
   - Thêm log chi tiết để debug quá trình chia sẻ
   - Tự động sao chép URL vào clipboard

3. `src/components/quiz/custom-games/CustomGameHeader.tsx`:
   - Thêm prop isSharing để hiển thị trạng thái đang xử lý
   - Cập nhật giao diện nút chia sẻ khi đang trong quá trình xử lý

## 29/04/2025 - Sửa lỗi animation trong custom game
1. `src/components/quiz/custom-games/CustomGameForm.tsx`:
   - Thêm allowScripts vào sandbox để iframe có thể chạy script và animation
   - Tối ưu quá trình tạo và hiển thị game
   - Thêm xử lý cho sự kiện "GAME_LOADED" để đảm bảo iframe được hiển thị khi đã tải xong

2. Cải thiện hiệu năng animation:
   - Thêm allowfullscreen và loading="eager" cho iframe để tăng hiệu suất
   - Thay đổi cách xử lý kết xuất iframe để đảm bảo các animation CSS hoạt động
   - Thêm các tối ưu cho CSS animation trên các thiết bị di động

## 29/04/2025 - Thêm thuộc tính animation vào định nghĩa kiểu dữ liệu
1. `src/components/quiz/types.ts`:
   - Thêm thuộc tính `animation` vào interface GameSettingsData
   - Đảm bảo kiểu dữ liệu được định nghĩa đúng

2. `src/components/quiz/generator/types.ts`:
   - Thêm thuộc tính `animation` vào interface MiniGame
   - Hỗ trợ tốt hơn cho các game có animation phong phú

## 29/04/2025 - Refactor EnhancedGameView thành các component nhỏ hơn 
1. Tạo các component con riêng biệt:
   - `GameLoadingState.tsx`: Hiển thị trạng thái đang tải game
   - `GameErrorState.tsx`: Hiển thị thông báo lỗi và nút tải lại
   - `GameIframe.tsx`: Xử lý logic render iframe và các tương tác với iframe

2. Cập nhật EnhancedGameView.tsx:
   - Giảm độ phức tạp của component chính
   - Cải thiện khả năng tái sử dụng code
   - Dễ dàng bảo trì và mở rộng chức năng
   - Giảm số lượng mã trong một file


