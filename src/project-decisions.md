
# Quyết định tái tổ chức dự án

## Thay đổi ngày: 2025-01-27

### Tái tổ chức cấu trúc thư mục
- **Loại thay đổi**: Restructure
- **Files thay đổi**: 
  - Tạo 4 thư mục chính: ui/, preset/, custom/, ai/
  - Di chuyển components vào đúng thư mục
  - Cập nhật imports trong App.tsx
  - Xóa thư mục thừa: games/, quiz/
  - Tạo shared/ cho types chung

### Cấu trúc mới:
```
src/components/
├── ui/              # Giao diện chung (containers, headers, shared UI)
│   ├── GameContainer.tsx
│   └── GameHeader.tsx
├── preset/          # Game từ template có sẵn  
│   ├── PresetGamesPage.tsx
│   └── GameSelector.tsx
├── custom/          # Game tùy chỉnh
│   ├── GameController.tsx
│   ├── EnhancedGameView.tsx
│   ├── CustomGameForm.tsx
│   ├── CustomGameHeader.tsx
│   └── game-components/
├── ai/              # AI game generation
│   ├── index.ts
│   ├── types.ts
│   └── gameGenerator.ts
└── shared/          # Types và utilities dùng chung
    └── types.ts
```

### Lý do:
- Tối giản cấu trúc thư mục từ 3 cấp xuống 2 cấp
- Phân chia rõ ràng theo chức năng: UI, Preset, Custom, AI
- Dễ quản lý và mở rộng
- Loại bỏ duplicate components
- Tạo hook useGameShareManager.ts

### Files xóa:
- src/components/games/ (toàn bộ thư mục)
- src/components/quiz/ (toàn bộ thư mục)
- Duplicate EnhancedGameView trong ui/

### Files tạo mới:
- 15+ files được tổ chức lại theo cấu trúc mới
- Tất cả imports đã được cập nhật
