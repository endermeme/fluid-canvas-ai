
# Kiến trúc của Custom Game

## Tổng quan kiến trúc

Custom Game được tổ chức thành hai thư mục chính: API và UI. Thư mục API chứa các tương tác với backend và cơ sở dữ liệu, trong khi thư mục UI chứa các component giao diện người dùng. Kiến trúc này giúp tách biệt rõ ràng giữa logic nghiệp vụ và giao diện.

GameController đóng vai trò trung tâm, điều phối giữa UI và API, quản lý trạng thái của ứng dụng và điều hướng. Thông qua GameController, người dùng có thể tạo và tương tác với các game tùy chỉnh.

## Các thành phần chính

### 1. Thành phần UI (src/components/quiz/custom-games/ui)

**CustomGameForm**
- Thu thập đầu vào từ người dùng thông qua form
- Cung cấp giao diện để nhập mô tả game
- Xử lý việc gửi yêu cầu tạo game
- Hiển thị thông báo khi game đang được tạo

**EnhancedGameView**
- Hiển thị game đã tạo trong iframe
- Quản lý trạng thái của game (loading, error)
- Cung cấp các tính năng như làm mới, toàn màn hình
- Xử lý các sự kiện từ iframe

**CustomGameHeader**
- Hiển thị thanh điều hướng phía trên game
- Cung cấp các nút điều khiển (quay lại, chia sẻ, làm mới)
- Quản lý các tương tác với game

**GameIframeRenderer**
- Component đặc biệt để hiển thị iframe
- Cấu hình sandbox và các thuộc tính bảo mật
- Quản lý hiển thị và animation của iframe

### 2. Thành phần API (src/components/quiz/custom-games/api)

**customGameAPI**
- Quản lý tương tác với cơ sở dữ liệu Supabase
- Cung cấp các hàm CRUD (Create, Read, Update, Delete)
- Xử lý lưu trữ và truy xuất thông tin game
- Quản lý việc chia sẻ game

### 3. Thành phần Controller

**GameController**
- Điều phối luồng làm việc của game
- Quản lý trạng thái ứng dụng
- Xử lý việc chuyển đổi giữa các màn hình
- Kết nối UI với API

## Quy trình xử lý dữ liệu

1. **Tạo game mới**:
   - Người dùng nhập mô tả game qua CustomGameForm
   - GameController gọi geminiGenerator để tạo nội dung game
   - EnhancedGameView hiển thị game trong iframe
   - Nếu cần, game được lưu trữ qua customGameAPI

2. **Chia sẻ game**:
   - Người dùng nhấn nút chia sẻ trong CustomGameHeader
   - customGameAPI lưu game vào cơ sở dữ liệu
   - Tạo URL chia sẻ và thông báo cho người dùng
   - Người dùng có thể sao chép URL hoặc xem mã QR

3. **Xem game đã chia sẻ**:
   - Người dùng truy cập URL game
   - GameController lấy thông tin game từ customGameAPI
   - EnhancedGameView hiển thị game trong iframe

## Cải tiến và tối ưu hóa

Kiến trúc hiện tại được tối ưu hóa để:
- Tách biệt rõ ràng giữa UI và API
- Dễ dàng mở rộng và thêm tính năng mới
- Quản lý trạng thái một cách hiệu quả
- Tái sử dụng component giữa các phần của ứng dụng
- Xử lý lỗi và trạng thái loading một cách nhất quán
