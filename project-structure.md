# Cấu Trúc Dự Án Fluid Canvas AI

## Tổng Quan Dự Án

Dự án Fluid Canvas AI là một ứng dụng React cho phép người dùng tạo, chia sẻ và chơi các trò chơi tương tác. Ứng dụng được xây dựng trên nền tảng Vite với TypeScript và sử dụng thư viện UI Shadcn.

## Cấu Trúc Thư Mục

```
src/
├── components/              # Các component UI của ứng dụng
│   ├── games/              # Components liên quan đến game
│   │   ├── custom/         # Components cho game tùy chỉnh
│   │   ├── preset/         # Components cho game định sẵn
│   │   ├── shared/         # Components dùng chung giữa các loại game
│   │   └── generator/      # Components cho việc tạo game
│   └── ui/                 # Components UI cơ bản (buttons, cards, etc.)
├── hooks/                  # React hooks
├── lib/                    # Các utility functions
├── types/                  # TypeScript definitions
├── styles/                 # CSS và style definitions
├── pages/                  # Page components
├── integrations/           # Kết nối với các service bên ngoài
└── constants/              # Các hằng số dùng trong ứng dụng
```

## Các Module Chính

### 1. Module Quản Lý Game (src/components/games)

#### Custom Game Module (src/components/games/custom)

- **EnhancedGameView.tsx**: Component chính để hiển thị game tùy chỉnh với đầy đủ tính năng
  - Props: miniGame, onReload, className, onBack, hideHeader, onShare, onNewGame, extraButton, isTeacher, gameExpired
  - Sử dụng các hooks: useToast, useGameShareManager, useIframeManager
  - Hiển thị: Header, iframe chứa game, các controls và UI loading/error

- **Game Components**:
  - **GameIframeRenderer.tsx**: Render iframe chứa nội dung HTML của game
  - **GameLoadingIndicator.tsx**: Hiển thị tiến trình loading game
  - **GameErrorDisplay.tsx**: Hiển thị thông báo lỗi khi game không tải được

### 2. Module Hooks (src/hooks)

- **useIframeManager.ts**: Hook quản lý iframe
  - Input: miniGame, onReload, gameExpired
  - States: iframeRef, iframeError, isIframeLoaded, loadingProgress, loadAttempts
  - Functions: loadIframeContent, refreshGame, handleFullscreen
  - Xử lý: Loading content, error handling, fullscreen mode, game refresh

- **useGameShareManager.ts**: Hook quản lý chia sẻ game
  - Input: miniGame, toast, onShare
  - States: isSharing
  - Functions: handleShare
  - Xử lý: Tạo link chia sẻ, lưu game vào database

- **use-toast.ts**: Hook quản lý thông báo (toast notifications)

### 3. Module Utility (src/lib)

- **iframe-utils.ts**: Utilities cho việc xử lý iframe
  - Functions: enhanceIframeContent
  - Xử lý: Thêm styles, scripts vào HTML content, xử lý communication giữa iframe và app

- **gameExport.ts**: Xử lý việc export/save game
  - Functions: saveGameForSharing, getSharedGame, getRemainingTime, formatHtmlContent
  - Xử lý: Lưu game vào database, lấy game từ database, tính thời gian còn lại

- **utils.ts**: Các utility functions chung
- **media-utils.ts**: Xử lý media (hình ảnh, âm thanh)
- **animations.ts**: Các hiệu ứng animation
- **block-utils.ts**: Utilities cho việc xử lý blocks
- **debug-utils.ts**: Công cụ debug

## Luồng Dữ Liệu Chính

1. **Luồng hiển thị game**:
   - EnhancedGameView render UI chính
   - useIframeManager load và xử lý content
   - iframe-utils.ts enhance nội dung HTML
   - GameIframeRenderer hiển thị content

2. **Luồng chia sẻ game**:
   - useGameShareManager xử lý sự kiện chia sẻ
   - gameExport.ts lưu game vào database
   - Tạo và trả về URL chia sẻ

## Cách Triển Khai Kỹ Thuật

### 1. Iframe Enhancement

File `iframe-utils.ts` cung cấp hàm `enhanceIframeContent` đóng vai trò quan trọng trong việc cải thiện nội dung HTML:

```typescript
export const enhanceIframeContent = async (content: string, title?: string): Promise<string> => {
  // Xử lý và tăng cường nội dung HTML với:
  // - Meta tags
  // - CSS cơ bản
  // - Scripts để giao tiếp với parent window
  // - Đảm bảo cấu trúc HTML hợp lệ
  // ...
};
```

### 2. Game Loading Lifecycle

Hook `useIframeManager` quản lý vòng đời của việc load game:
- Khởi tạo iframe
- Loading content với hiệu ứng progress
- Xử lý message từ iframe
- Retry logic khi load thất bại
- Fullscreen và refresh handling

### 3. Game Sharing System

`gameExport.ts` và `useGameShareManager` cung cấp hệ thống chia sẻ game:
- Lưu nội dung game vào Supabase database
- Tạo unique ID và URL cho game
- Set expiration time (3 ngày)
- Encode game content vào HTML để dễ retrieve 