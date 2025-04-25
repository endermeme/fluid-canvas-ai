# Phân tích dự án Web

## Cấu trúc dự án

Dự án là một ứng dụng web React sử dụng Vite làm công cụ build, với cấu trúc chính như sau:

```
src/
├── components/
│   ├── quiz/
│   │   ├── components/
│   │   │   ├── GameContainer.tsx (Component hiển thị iframe game)
│   │   │   └── GameHeader.tsx
│   │   ├── custom-games/
│   │   │   ├── utils/
│   │   │   │   └── iframe-utils.ts (Re-export từ thư mục khác)
│   │   │   ├── GameContainer.tsx (Component hiển thị iframe khác)
│   │   │   └── ... (Các component liên quan đến game tùy chỉnh)
│   │   ├── preset-games/
│   │   ├── generator/
│   │   ├── share/
│   │   └── utils/
│   │       └── iframe-utils.ts (File gốc xử lý content cho iframe)
│   └── ui/ (UI components)
├── pages/
│   ├── Quiz.tsx
│   ├── HomePage.tsx
│   ├── SharedGame.tsx
│   ├── GameSharePage.tsx
│   └── GameHistoryPage.tsx
├── hooks/
├── utils/
├── lib/
├── integrations/
└── constants/
```

## Công năng chính của dự án

Đây là ứng dụng web tạo và chia sẻ các game/quiz tương tác:

1. **Hệ thống quiz/game**: 
   - Cho phép tạo và chia sẻ các game quiz
   - Có nhiều loại game được định nghĩa sẵn (preset-games)
   - Cho phép tạo game tùy chỉnh (custom-games)

2. **Hiển thị game**:
   - Sử dụng iframe để hiển thị nội dung game HTML
   - Các game được hiển thị trong container có thể điều chỉnh kích thước
   - Có xử lý lỗi và loading state

3. **Chia sẻ game**:
   - Các game có thể được chia sẻ qua URL
   - Có bảng điều khiển cho giáo viên (TeacherDashboard)

## Vấn đề trùng lặp và xung đột

### 1. Trùng lặp component GameContainer

Hiện tại có hai file GameContainer gần như giống nhau ở hai vị trí khác nhau:
- `src/components/quiz/components/GameContainer.tsx`
- `src/components/quiz/custom-games/GameContainer.tsx`

Hai component này có chức năng tương tự nhau, đều hiển thị iframe với nội dung game, có xử lý loading và error.

### 2. Vấn đề với module iframe-utils.ts

Có sự nhầm lẫn trong cách import module:
- File gốc: `src/components/quiz/utils/iframe-utils.ts` (đã tồn tại)
- File re-export: `src/components/quiz/custom-games/utils/iframe-utils.ts` (chỉ re-export từ file gốc)

Tuy nhiên, trong `src/components/quiz/custom-games/GameContainer.tsx` lại import từ một file không tồn tại:
```typescript
import { enhanceIframeContent } from './utils/iframe-processor';
```

Đây có thể là nguyên nhân dẫn đến lỗi "Đã chặn việc tải mô-đun từ iframe-utils.ts" vì đường dẫn import không đúng.

### 3. Cấu hình Vite có vấn đề

Cấu hình trong `vite.config.ts` đã tạo server với cổng 8080, nhưng một số import có thể đang tìm file từ URL absolute (như lỗi đã mô tả) thay vì import tương đối.

## Các file cần xóa hoặc điều chỉnh

1. **Xem xét gộp hai GameContainer thành một**:
   - Nên giữ lại `src/components/quiz/components/GameContainer.tsx` và xóa phiên bản trong custom-games
   - Hoặc tạo một phiên bản chung và đặt ở vị trí cao hơn trong cấu trúc thư mục

2. **Sửa đường dẫn import trong custom-games/GameContainer.tsx**:
   - Từ `./utils/iframe-processor` thành `./utils/iframe-utils` hoặc trực tiếp import từ `../../utils/iframe-utils`

3. **Xem xét xóa file re-export nếu không cần thiết**:
   - File `src/components/quiz/custom-games/utils/iframe-utils.ts` có thể không cần thiết nếu các component import trực tiếp từ file gốc

## Kế hoạch cải thiện

1. Chuẩn hóa cấu trúc thư mục và xóa các thành phần trùng lặp
2. Thống nhất cách import và sử dụng các utility function
3. Điều chỉnh cấu hình Vite để tránh lỗi khi tải module
4. Cải thiện hệ thống xử lý lỗi khi tải iframe để hiển thị lỗi rõ ràng hơn 