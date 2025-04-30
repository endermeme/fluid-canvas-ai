
# Quy trình hoạt động của Custom Game

## Tổng quan

Custom Game là tính năng cho phép người dùng tạo các trò chơi tương tác bằng cách sử dụng AI để tạo ra code HTML, CSS và JavaScript dựa trên mô tả của người dùng. Dưới đây là quy trình tổng thể và các file tham gia:

## Quy trình hoạt động

1. **Người dùng nhập mô tả game** → CustomGameForm.tsx
2. **Gửi yêu cầu tới AI (Gemini)** → geminiGenerator.ts
3. **Xử lý phản hồi từ AI** → geminiGenerator.ts → processGameCode()
4. **Hiển thị game trong iframe** → iframe-utils.ts → enhanceIframeContent()
5. **Hiển thị giao diện game** → EnhancedGameView.tsx
6. **Quản lý trạng thái game** → GameController.tsx
7. **Chia sẻ game** → gameExport.ts → saveGameForSharing()

## Các file tham gia và vai trò

### File gốc (Entry point)
- `src/App.tsx` - Định nghĩa routes của ứng dụng, trong đó có route `/custom-game` dẫn đến tính năng tạo game tùy chỉnh

### Components cho Custom Game

1. **GameController.tsx**
   - Vai trò: Điều khiển luồng làm việc tổng thể của custom game
   - Chức năng:
     - Quản lý trạng thái của game (đang tạo, đã tạo, đang hiển thị form)
     - Điều hướng giữa form tạo game và hiển thị game
     - Xử lý các tác vụ chia sẻ game
     - Điều phối giữa CustomGameForm và EnhancedGameView

2. **CustomGameForm.tsx**
   - Vai trò: Giao diện để người dùng nhập mô tả game muốn tạo
   - Chức năng:
     - Thu thập đầu vào từ người dùng (mô tả game)
     - Gọi AIGameGenerator để tạo game
     - Hiển thị trạng thái loading trong quá trình tạo game
     - Chuyển kết quả tạo game về GameController

3. **EnhancedGameView.tsx**
   - Vai trò: Hiển thị game đã tạo trong iframe
   - Chức năng:
     - Nhúng nội dung HTML game vào iframe
     - Xử lý các tương tác với game (refresh, fullscreen)
     - Hiển thị thông báo lỗi nếu game không thể tải
     - Quản lý trạng thái loading của iframe

4. **CustomGameHeader.tsx**
   - Vai trò: Hiển thị thanh điều hướng cho game tùy chỉnh
   - Chức năng:
     - Cung cấp các nút điều khiển (quay lại, làm mới, toàn màn hình)
     - Hiển thị tiêu đề game
     - Cung cấp nút chia sẻ game

### API và Xử lý dữ liệu

1. **geminiGenerator.ts**
   - Vai trò: Kết nối với Google Gemini API để tạo game
   - Chức năng:
     - Tạo prompt cho Gemini API
     - Gửi yêu cầu tới API
     - Xử lý phản hồi từ API
     - Làm sạch và định dạng mã code nhận được
     - Trích xuất tiêu đề và nội dung game

2. **geminiPrompt.ts**
   - Vai trò: Định nghĩa prompt templates cho Gemini API
   - Chức năng:
     - Cung cấp cấu trúc prompt cho việc tạo game
     - Định nghĩa các instructions về format HTML, canvas, và tính năng game

3. **customGamePrompt.ts**
   - Vai trò: Định nghĩa prompt templates thay thế cho tạo game đơn giản hơn
   - Chức năng:
     - Cung cấp template prompt đơn giản hơn
     - Tập trung vào yêu cầu cụ thể cho mobile và desktop

### Utilities và Helpers

1. **iframe-utils.ts**
   - Vai trò: Xử lý và nâng cao nội dung HTML để hiển thị trong iframe
   - Chức năng:
     - Xử lý hình ảnh trong nội dung HTML
     - Thêm các script hỗ trợ vào HTML (xử lý lỗi, theo dõi loading)
     - Thêm CSS tối ưu hóa cho touch devices
     - Đảm bảo cấu trúc HTML đúng và đầy đủ

2. **gameExport.ts**
   - Vai trò: Lưu trữ và chia sẻ game
   - Chức năng:
     - Lưu game vào cơ sở dữ liệu
     - Tạo URL chia sẻ
     - Xử lý các tác vụ liên quan đến export game

3. **apiUtils.ts**
   - Vai trò: Cung cấp tiện ích cho việc gọi API
   - Chức năng:
     - Log các thông tin API
     - Đo thời gian thực thi API
     - Xử lý lỗi API

### Types và Interfaces

1. **types.ts**
   - Định nghĩa các types cho game settings
   - Định nghĩa cấu trúc dữ liệu cho game

2. **generator/types.ts**
   - Định nghĩa các types cho API response
   - Định nghĩa cấu trúc MiniGame

## Luồng dữ liệu chi tiết

### 1. Khi người dùng tạo game mới:

```
Người dùng nhập mô tả → CustomGameForm.tsx 
→ AIGameGenerator.getInstance().generateMiniGame() 
→ tryGeminiGeneration() trong geminiGenerator.ts
→ generateWithGemini() trong geminiGenerator.ts
→ Gọi Gemini API với prompt từ geminiPrompt.ts
→ Xử lý kết quả với processGameCode()
→ Trả về đối tượng MiniGame cho CustomGameForm.tsx
→ CustomGameForm.tsx gọi onGenerate() để trả kết quả về GameController.tsx
→ GameController.tsx cập nhật state và hiển thị EnhancedGameView.tsx
→ EnhancedGameView.tsx gọi enhanceIframeContent() từ iframe-utils.ts
→ Game được hiển thị trong iframe
```

### 2. Khi người dùng chia sẻ game:

```
Người dùng nhấn nút chia sẻ → CustomGameHeader.tsx
→ EnhancedGameView.tsx gọi handleShare()
→ saveGameForSharing() trong gameExport.ts
→ Lưu game vào cơ sở dữ liệu
→ Tạo URL chia sẻ
→ Trả về URL cho EnhancedGameView.tsx
→ Hiển thị thông báo thành công
```

### 3. Xử lý nội dung HTML:

```
HTML từ AI → enhanceIframeContent() trong iframe-utils.ts
→ Xử lý hình ảnh với processImageSource()
→ Phân tích và chuẩn hóa cấu trúc HTML
→ Thêm các script hỗ trợ (error handling, loading notification)
→ Thêm CSS tối ưu hóa cho touch devices
→ Thêm loading indicator
→ Trả về HTML đã được nâng cao
```

## Tối ưu hóa và Xử lý lỗi

1. **Retry Mechanism**
   - tryGeminiGeneration() có cơ chế retry khi gọi API thất bại

2. **Error Handling trong iframe**
   - Thêm window.onerror để bắt và hiển thị lỗi trong game
   - Hiển thị UI thân thiện cho các lỗi

3. **Loading States**
   - Hiển thị progress bar khi loading game
   - Theo dõi trạng thái loading của iframe

4. **Responsive Design**
   - Thêm CSS tối ưu cho cả desktop và touch devices
   - Xử lý sự kiện touch đặc biệt cho mobile

## Lưu ý quan trọng

1. Các game được tạo chỉ tồn tại trong session hiện tại trừ khi được chia sẻ
2. Gemini API yêu cầu kết nối internet để hoạt động
3. Iframe có các giới hạn bảo mật (sandbox) để đảm bảo an toàn
4. Custom game sử dụng HTML Canvas khi có thể để tạo trải nghiệm game tốt hơn
