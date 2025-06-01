
# Sơ đồ kiến trúc của Custom Game

## Kiến trúc tổng quan

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  App.tsx        │────▶│ GameController  │────▶│ CustomGameForm  │
│  (Routes)       │     │ (State Manager) │     │ (User Input)    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 │                       │
                                 │                       ▼
┌─────────────────┐     ┌────────▼────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ gameExport.ts   │◀───▶│ EnhancedGameView│◀────│ geminiGenerator │
│ (Share/Export)  │     │ (Game Display)  │     │ (AI Generation) │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │  iframe-utils   │     │ geminiPrompt.ts │
                        │  (HTML Enhance) │     │ (AI Templates)  │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
```

## Luồng dữ liệu

```
┌─────────┐      ┌────────────┐      ┌─────────┐      ┌──────────┐
│         │      │            │      │         │      │          │
│ Mô tả   │─────▶│ CustomForm │─────▶│ Gemini  │─────▶│ HTML/CSS │
│ Game    │      │            │      │ API     │      │ JS Code  │
│         │      │            │      │         │      │          │
└─────────┘      └────────────┘      └─────────┘      └────┬─────┘
                                                           │
                                                           ▼
┌─────────┐      ┌────────────┐      ┌─────────┐      ┌──────────┐
│         │      │            │      │         │      │          │
│ Người   │◀─────│ Iframe     │◀─────│ Enhanced│◀─────│ Enhanced │
│ dùng    │      │ Game       │      │ View    │      │ HTML     │
│         │      │            │      │         │      │          │
└─────────┘      └────────────┘      └─────────┘      └──────────┘
```

## Quy trình xử lý HTML/CSS/JS Code

```
┌───────────────┐
│ Raw HTML from │
│ Gemini API    │
└───────┬───────┘
        │
        ▼
┌───────────────┐    ┌───────────────┐
│ processGameCode│───▶│ Extract title │
│ (cleansing)    │    │ and content   │
└───────┬───────┘    └───────────────┘
        │
        ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ enhanceIframe │───▶│ Process images│───▶│ Add error     │
│ Content       │    │ in content    │    │ handling      │
└───────┬───────┘    └───────────────┘    └───────────────┘
        │
        ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Add responsive│───▶│ Add loading   │───▶│ Return final  │
│ styles        │    │ indicator     │    │ HTML document │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Đặc điểm của mỗi component

### GameController (Quản lý trạng thái)
- Quản lý toàn bộ trạng thái của game tùy chỉnh
- Điều phối các components khác
- Xử lý điều hướng và tương tác người dùng

### CustomGameForm (Thu thập đầu vào)
- Giao diện người dùng cho việc nhập mô tả game
- Xử lý việc gọi AIGameGenerator
- Hiển thị trạng thái loading

### EnhancedGameView (Hiển thị game)
- Hiển thị game trong iframe
- Quản lý tương tác với game (refresh, fullscreen)
- Xử lý lỗi khi hiển thị game

### geminiGenerator (Tạo nội dung game)
- Kết nối với Gemini API
- Xử lý và làm sạch mã HTML từ API
- Trích xuất thông tin game

### iframe-utils (Xử lý nội dung HTML)
- Tối ưu hóa HTML cho iframe
- Thêm các script hỗ trợ
- Xử lý các tài nguyên trong HTML

### gameExport (Chia sẻ game)
- Lưu game vào cơ sở dữ liệu
- Tạo và quản lý URL chia sẻ
