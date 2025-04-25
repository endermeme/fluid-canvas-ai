
# Tài Liệu Cấu Trúc Dự Án

## Tổng Quan
Đây là hệ thống tạo và chia sẻ game tương tác tùy chỉnh, cho phép người dùng tạo, lưu trữ và chia sẻ các game tương tác với người khác.

## Mục Đích Cuối Cùng
Cung cấp nền tảng để người dùng có thể tạo, lưu trữ và chia sẻ các game tương tác tùy chỉnh một cách dễ dàng, với giao diện thân thiện và khả năng mở rộng.

## Cấu Trúc Hệ Thống

### 1. Tích Hợp Supabase

**File: `src/integrations/supabase/client.ts`**
- **Chức năng**: Khởi tạo và xuất client Supabase để giao tiếp với backend
- **Nhiệm vụ chính**: Cung cấp kết nối đến cơ sở dữ liệu và dịch vụ Supabase

### 2. Quản Lý Game Tùy Chỉnh

**File: `src/components/quiz/custom-games/utils/customGameAPI.ts`**
- **Chức năng**: Xử lý API cho việc tạo, lưu, lấy, cập nhật và xóa game tùy chỉnh trên Supabase
- **Nhiệm vụ chính**:
  - `saveCustomGame`: Lưu game tùy chỉnh mới vào cơ sở dữ liệu
  - `getCustomGame`: Lấy thông tin chi tiết của một game theo ID
  - `updateCustomGame`: Cập nhật thông tin của game đã tồn tại
  - `deleteCustomGame`: Xóa game tùy chỉnh theo ID
  - `listCustomGames`: Liệt kê tất cả game tùy chỉnh đã lưu

### 3. Giao Diện Người Dùng

**File: `src/components/quiz/custom-games/EnhancedGameView.tsx`**
- **Chức năng**: Hiển thị game tùy chỉnh trong iframe và quản lý tương tác
- **Nhiệm vụ chính**:
  - Hiển thị nội dung game trong iframe an toàn
  - Xử lý các chức năng như refresh, fullscreen
  - Tích hợp chức năng chia sẻ game thông qua API
  - Quản lý trạng thái tải game và hiển thị thông báo lỗi

**File: `src/components/quiz/custom-games/CustomGameHeader.tsx`**
- **Chức năng**: Header cho giao diện game tùy chỉnh
- **Nhiệm vụ chính**:
  - Hiển thị các nút điều hướng và chức năng
  - Quản lý chuyển hướng và điều khiển game

**File: `src/components/quiz/custom-games/GameController.tsx`**
- **Chức năng**: Điều khiển toàn bộ quy trình tạo và hiển thị game
- **Nhiệm vụ chính**:
  - Quản lý trạng thái tạo game
  - Chuyển đổi giữa các chế độ: tạo mới, đang tạo, hiển thị game
  - Xử lý điều hướng và logic chuyển đổi giữa các màn hình

### 4. Chia Sẻ và Xem Game

**File: `src/components/quiz/share/SharedGame.tsx`**
- **Chức năng**: Hiển thị game được chia sẻ cho người dùng khác
- **Nhiệm vụ chính**:
  - Tải game từ ID chia sẻ
  - Hiển thị game trong môi trường an toàn
  - Xử lý các tương tác người dùng với game được chia sẻ

**File: `src/components/quiz/QuizHeader.tsx`**
- **Chức năng**: Header chung cho các trang quiz/game
- **Nhiệm vụ chính**:
  - Hiển thị nút quay lại, tạo mới, chia sẻ
  - Quản lý dialog chia sẻ với QR code và link

**File: `src/components/quiz/QuizContainer.tsx`**
- **Chức năng**: Container chung cho các trang quiz/game
- **Nhiệm vụ chính**:
  - Cung cấp layout nhất quán cho các trang game
  - Tích hợp header, content và footer
  - Quản lý logic chia sẻ và hiển thị dialog

### 5. Trang Hiển Thị Game

**File: `src/pages/Quiz.tsx`**
- **Chức năng**: Trang chính hiển thị và tương tác với game
- **Nhiệm vụ chính**:
  - Khởi tạo và hiển thị form tạo game
  - Xử lý quá trình tạo game với AI hoặc thủ công
  - Hiển thị game đã tạo và các chức năng tương tác

### 6. Game Mẫu

**File: `src/components/quiz/preset-games/PresetGameManager.tsx`**
- **Chức năng**: Quản lý các game mẫu có sẵn
- **Nhiệm vụ chính**:
  - Tạo và quản lý game từ các mẫu có sẵn
  - Tương tác với API để tạo nội dung game
  - Hiển thị và quản lý chia sẻ game mẫu

## Quy Trình Làm Việc

1. **Tạo Game**:
   - Người dùng truy cập trang tạo game
   - Nhập nội dung hoặc sử dụng AI để tạo game
   - Game được hiển thị trong iframe để người dùng xem trước

2. **Lưu và Quản Lý**:
   - Game được lưu vào Supabase với thông tin chi tiết
   - Người dùng có thể cập nhật, sửa đổi hoặc xóa game đã tạo

3. **Chia Sẻ Game**:
   - Người dùng có thể chia sẻ game qua link hoặc QR code
   - Game được hiển thị cho người nhận với giao diện phù hợp

4. **Xem Game Được Chia Sẻ**:
   - Người nhận truy cập link và xem game
   - Giao diện hiển thị game trong môi trường an toàn

## Cấu Trúc Cơ Sở Dữ Liệu

### Bảng `games`
- Lưu trữ thông tin cơ bản của tất cả các game
- Bao gồm tiêu đề, mô tả, nội dung HTML và loại game

### Bảng `custom_games`
- Lưu trữ dữ liệu riêng của game tùy chỉnh
- Liên kết với bảng games qua game_id
- Chứa cấu hình và cài đặt đặc biệt cho game

### Bảng `game_participants`
- Theo dõi người tham gia vào game
- Lưu trữ thông tin như tên, địa chỉ IP và thời gian tham gia

## Công Nghệ Sử Dụng

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (cơ sở dữ liệu, xác thực, lưu trữ)
- **API**: RESTful API thông qua Supabase client
- **Mã Hóa**: QR code cho chia sẻ game

## Kết Luận

Dự án cung cấp một nền tảng hoàn chỉnh để tạo, lưu trữ và chia sẻ các game tương tác tùy chỉnh. Với cấu trúc module rõ ràng, hệ thống có thể dễ dàng mở rộng với các loại game và tính năng mới trong tương lai.
