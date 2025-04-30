
# Sơ đồ kiến trúc của Custom Game

## Kiến trúc tổng quan

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  App.tsx        │────▶│ GameController  │────▶│ UI/CustomGameForm │
│  (Routes)       │     │ (State Manager) │     │ (User Input)    │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 │                       │
                                 │                       ▼
┌─────────────────┐     ┌────────▼────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ API/customGameAPI│◀───▶│ UI/EnhancedGameView │◀────│ geminiGenerator │
│ (DB Operations) │     │ (Game Display)  │     │ (AI Generation) │
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

## Đặc điểm của mỗi component

### 1. UI layer (src/components/quiz/custom-games/ui)

**CustomGameForm**
- Thu thập đầu vào từ người dùng
- Giao diện nhập mô tả game
- Xử lý gửi yêu cầu tạo game

**EnhancedGameView**
- Hiển thị game trong iframe
- Quản lý tương tác với game
- Hiển thị các thông báo lỗi và loading

**CustomGameHeader**
- Header cho giao diện game
- Cung cấp các nút điều khiển
- Xử lý chức năng chia sẻ

**GameIframeRenderer**
- Component thuần để hiển thị iframe
- Xử lý thuộc tính và styling cho iframe

### 2. API layer (src/components/quiz/custom-games/api)

**customGameAPI**
- Quản lý tương tác với Supabase
- CRUD operations cho game tùy chỉnh
- Xử lý lỗi và logging

### 3. Controller (src/components/quiz/custom-games/GameController)

**GameController**
- Điều phối giữa UI và API
- Quản lý trạng thái của game
- Xử lý navigation và flow

## Chi tiết các API

### customGameAPI

- `saveCustomGame`: Lưu game mới vào cơ sở dữ liệu
- `getCustomGame`: Lấy thông tin game theo ID
- `updateCustomGame`: Cập nhật thông tin game
- `deleteCustomGame`: Xóa game
- `listCustomGames`: Liệt kê tất cả game tùy chỉnh

## Luồng xử lý dữ liệu

1. **Tạo game mới**:
   - Người dùng nhập mô tả → UI/CustomGameForm
   - Gọi geminiGenerator để tạo nội dung game
   - Hiển thị trong UI/EnhancedGameView
   - Lưu trữ qua API/customGameAPI (nếu cần)

2. **Chia sẻ game**:
   - Gọi API/customGameAPI.saveCustomGame
   - Tạo game session thông qua gameParticipation.ts
   - Tạo URL chia sẻ và chuyển hướng

3. **Xem game đã chia sẻ**:
   - Lấy game từ API/customGameAPI.getCustomGame
   - Hiển thị trong UI/EnhancedGameView

## Tối ưu hóa

Cấu trúc thư mục được tổ chức để phân tách rõ ràng:
- **UI**: Tất cả giao diện người dùng
- **API**: Tương tác với backend
- **Controller**: Điều phối logic

Cấu trúc này giúp:
- Dễ dàng mở rộng các tính năng mới
- Tách biệt concerns giữa UI và logic
- Tái sử dụng components một cách hiệu quả
