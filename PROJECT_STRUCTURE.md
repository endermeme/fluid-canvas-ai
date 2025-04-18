
# AI Game Creator - Tài Liệu Dự Án

Ứng dụng tạo trò chơi giáo dục tương tác bằng AI, cho phép người dùng tạo và chia sẻ trò chơi một cách nhanh chóng và dễ dàng.

## Tính Năng Chính

### 1. Tạo Game Với AI
- **Tạo game từ prompt**: Nhập yêu cầu và AI sẽ tạo trò chơi hoàn chỉnh
- **Hiển thị trong iframe**: Game được hiển thị trực tiếp trong ứng dụng
- **Công nghệ sử dụng**: HTML, CSS, JavaScript thuần, tất cả trong một file HTML duy nhất
- **Hỗ trợ đa dạng game**: Quiz, ghép cặp, trí nhớ, xếp hình, câu đố, v.v.

### 2. Chia Sẻ & Theo Dõi
- **Chia sẻ qua liên kết**: Tạo liên kết để chia sẻ game với người khác
- **Theo dõi người tham gia**: Xem danh sách người chơi và điểm số
- **Lưu trữ tạm thời**: Game được lưu trong localStorage và hết hạn sau 48 giờ

### 3. Tùy Chỉnh Game
- **Chọn độ khó**: Dễ, trung bình, khó
- **Số lượng câu hỏi**: Tùy chỉnh số lượng câu hỏi/thẻ trong game
- **Thời gian**: Điều chỉnh thời gian cho mỗi câu hỏi
- **Thể loại**: Lựa chọn chủ đề (lịch sử, khoa học, địa lý, v.v.)

## Giao Diện Người Dùng

### Trang Chính (/)
- **Chat AI**: Giao diện chat để giao tiếp với AI
- **Khu vực Canvas**: Nơi hiển thị các block tương tác
- **Thanh sidebar**: Chứa các tùy chọn và công cụ

### Trang Tạo Game (/quiz)
- **Form nhập prompt**: Nhập yêu cầu cho trò chơi
- **Nút tạo game**: Gửi yêu cầu đến AI để tạo game
- **Iframe hiển thị game**: Hiển thị game được tạo
- **Các nút điều khiển**: Tạo mới, tải lại, chia sẻ, quay lại

### Trang Game Đã Chia Sẻ (/game/:id)
- **Màn hình nhập tên**: Yêu cầu người chơi nhập tên trước khi tham gia
- **Game view**: Hiển thị game đầy đủ màn hình
- **Bảng điểm**: Hiển thị điểm số và thứ hạng

## Luồng Hoạt Động

### Tạo Game
1. Người dùng nhập prompt mô tả trò chơi mong muốn
2. Hệ thống gửi prompt đến Gemini API kèm theo cấu hình
3. AI tạo một file HTML hoàn chỉnh với game tương tác
4. Game được hiển thị trong iframe cho người dùng
5. Người dùng có thể tạo mới, làm mới hoặc chia sẻ game

### Chia Sẻ Game
1. Người dùng nhấn nút "Chia sẻ game"
2. Hệ thống tạo một ID duy nhất và lưu game vào localStorage
3. Tạo liên kết chia sẻ dựa trên ID
4. Người dùng chia sẻ liên kết cho người khác
5. Game tự động hết hạn sau 48 giờ

## Thành Phần Kỹ Thuật

### 1. Tạo Game Với Gemini AI
- `AIGameGenerator.ts`: Class chính để tạo game với AI
- `geminiGenerator.ts`: Tích hợp với Google Gemini API
- `promptBuilder.ts`: Xây dựng prompt chuyên biệt cho AI

### 2. Hiển Thị Game
- `Quiz.tsx`: Trang chính để tạo và hiển thị game
- `QuizContainer.tsx`: Container bao quanh game với các điều khiển
- `GameLoading.tsx`: Hiển thị khi đang tạo game

### 3. Quản Lý Người Chơi
- `gameParticipation.ts`: Quản lý thông tin người tham gia
- `gameExport.ts`: Lưu trữ và chia sẻ game

## Mô Hình Dữ Liệu

### Game
```typescript
interface MiniGame {
  title: string;
  description?: string;
  content: string; // HTML content
  items?: any[];
}
```

### Game Settings
```typescript
interface GameSettingsData {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
  category: 'general' | 'history' | 'science' | 'geography' | 'arts' | 'sports' | 'math';
}
```

### Stored Game
```typescript
interface StoredGame {
  id: string;
  title: string;
  description: string;
  htmlContent: string;
  createdAt: number;
  expiresAt: number;
}
```

## Xử Lý Đặc Biệt

### Xử Lý Hình Ảnh
- Hệ thống yêu cầu AI chỉ cung cấp từ khóa tìm kiếm cho hình ảnh
- Sử dụng Pixabay API để lấy hình ảnh thực tế
- Thay thế URL hình ảnh không phải Pixabay bằng URL Pixabay

### An Toàn Cho Iframe
- Sử dụng thuộc tính sandbox để giới hạn quyền của iframe
- Xử lý giao tiếp giữa iframe và trang chính qua postMessage

### Hiệu Suất
- Game hoạt động hoàn toàn trong trình duyệt, không cần backend
- Sử dụng localStorage để lưu trữ game đã chia sẻ
- Tự động dọn dẹp game hết hạn

## Hướng Dẫn Phát Triển

### Thêm Loại Game Mới
1. Tạo mẫu hướng dẫn trong gameInstructions.ts
2. Thêm loại game vào gameTypes.ts
3. Tùy chỉnh cài đặt mặc định cho loại game

### Tối Ưu Prompt AI
1. Nghiên cứu prompt hiện tại trong promptBuilder.ts
2. Thử nghiệm và cải thiện cấu trúc prompt
3. Thêm ví dụ và hướng dẫn cụ thể cho AI

### Cải Thiện UI/UX
1. Tối ưu giao diện người dùng trong Quiz.tsx
2. Thêm hoạt ảnh và hiệu ứng cho loading state
3. Cải thiện responsive design cho thiết bị di động
