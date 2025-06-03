
# Game Changes Log

## 2025-01-03 - Dọn dẹp Custom Game và tách Prompt ra JSON

### Files thay đổi:
- **src/components/quiz/generator/gamePrompts.json** - TẠO MỚI: Tách prompt ra file JSON riêng
- **src/components/quiz/generator/geminiPrompt.ts** - SỬA: Đọc prompt từ JSON
- **src/components/quiz/generator/geminiGenerator.ts** - SỬA: Đơn giản hóa, xóa canvas/difficulty functions
- **src/components/quiz/custom-games/CustomGameForm.tsx** - SỬA: Loại bỏ canvas mode và difficulty settings
- **src/components/quiz/generator/types.ts** - SỬA: Đơn giản hóa interface
- **src/components/quiz/custom-games/ui/index.ts** - SỬA: Xóa exports không cần thiết

### Files xóa:
- **src/components/quiz/custom-games/ui/CustomGameForm.tsx** - XÓA: File trùng lặp
- **src/components/quiz/generator/customGamePrompt.ts** - XÓA: Đã tách ra JSON
- **src/components/quiz/generator/promptBuilder.ts** - XÓA: Không cần thiết

### Loại thay đổi:
- Dọn dẹp code thừa và functions không sử dụng
- Tách prompt template ra file JSON độc lập
- Đơn giản hóa logic custom game chỉ còn input textarea
- Loại bỏ canvas mode và difficulty settings không cần thiết
