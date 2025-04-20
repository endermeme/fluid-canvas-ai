
# Cấu trúc UI Components cho Game Custom

## 1. Tổ chức thư mục
```
src/components/quiz/custom-games/
├── components/
│   ├── headers/
│   │   ├── GameHeader.tsx
│   │   └── CustomGameHeader.tsx
│   ├── containers/
│   │   ├── GameContainer.tsx
│   │   └── CustomGameContainer.tsx
│   ├── controls/
│   │   ├── GameControls.tsx
│   │   └── CustomGameControls.tsx
│   ├── results/
│   │   └── GameResult.tsx
│   └── shared/
│       ├── Timer.tsx
│       ├── ProgressBar.tsx
│       └── Score.tsx
```

## 2. Component Descriptions

### Headers
- **GameHeader**: Header chung cho tất cả các game
  - Hiển thị tiêu đề game
  - Nút điều hướng (Back, Home)
  - Thời gian và điểm số

### Containers
- **GameContainer**: Container chung cho game
  - Layout chung
  - Xử lý responsive
  - Tích hợp với header

### Controls
- **GameControls**: Controls chung cho game
  - Nút điều khiển (Start, Pause, Reset)
  - Xử lý tương tác người dùng

### Results
- **GameResult**: Hiển thị kết quả
  - Điểm số cuối cùng
  - Thống kê
  - Nút chơi lại

### Shared Components
- **Timer**: Đồng hồ đếm ngược
- **ProgressBar**: Thanh tiến trình
- **Score**: Hiển thị điểm số

## 3. Hướng dẫn Sử dụng

### GameHeader Example
```tsx
<GameHeader
  title="Quiz Game"
  onBack={() => {}}
  score={100}
  timeLeft={60}
/>
```

### GameContainer Example
```tsx
<GameContainer>
  <GameContent />
  <GameControls />
</GameContainer>
```

### GameControls Example
```tsx
<GameControls
  onNext={() => {}}
  onPrevious={() => {}}
  onRestart={() => {}}
/>
```

## 4. Quy tắc Styling
- Sử dụng Tailwind CSS cho styling
- Đảm bảo responsive trên mọi kích thước màn hình
- Theo design system của project

## 5. Best Practices
- Tách biệt logic và UI
- Sử dụng TypeScript cho type safety
- Tối ưu performance với React memo khi cần
- Đảm bảo accessibility

## 6. Tích hợp với Game Templates
```tsx
// Example usage in a game template
const GameTemplate = () => {
  return (
    <GameContainer>
      <GameHeader />
      <GameContent />
      <GameControls />
    </GameContainer>
  );
};
```

## 7. State Management
- Sử dụng React Context cho state global
- Props drilling cho state local
- Custom hooks cho logic phức tạp

## 8. Accessibility
- Đảm bảo semantic HTML
- Keyboard navigation
- Screen reader support
- ARIA labels

## 9. Error Handling
- Error boundaries cho mỗi game
- Fallback UI cho lỗi
- Loading states

## 10. Performance
- Code splitting cho các components lớn
- Lazy loading cho assets
- Memoization cho calculations phức tạp
