

# Quyết định phát triển game

## Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Xóa game NeuronPaths** - Loại bỏ game "Đường Dẫn Thần Kinh" khỏi hệ thống
2. **Cập nhật GameSelector** - Xóa NeuronPaths khỏi danh sách game có sẵn  
3. **Cập nhật templates index** - Loại bỏ import và export của NeuronPathsTemplate

### File thay đổi:
- templates/NeuronPathsTemplate.tsx (xóa)
- templates/index.ts (cập nhật exports)
- GameSelector.tsx (xóa game khỏi danh sách)

### Loại thay đổi:
- Xóa: 1 game template
- Cập nhật: GameSelector và template exports

## Ngày: 2025-06-07

### Thay đổi thực hiện:
1. **Thêm template cho các game mới** - Tạo template cho GroupSortTemplate, SpinWheelTemplate, CompleteSentenceTemplate, OpenBoxTemplate, SpeakingCardsTemplate
2. **Đồng bộ AI generation** - Cập nhật PresetGameManager để hỗ trợ tạo nội dung AI cho các game mới
3. **Sửa lỗi template missing** - Các game trong GameSelector đã có nhưng thiếu template

### File thay đổi:
- templates/GroupSortTemplate.tsx (tạo mới)
- templates/SpinWheelTemplate.tsx (tạo mới) 
- templates/CompleteSentenceTemplate.tsx (tạo mới)
- templates/OpenBoxTemplate.tsx (tạo mới)
- templates/SpeakingCardsTemplate.tsx (tạo mới)
- PresetGameManager.tsx (cập nhật AI generation)

### Loại thay đổi:
- Tạo mới: 5 template components
- Cập nhật: AI generation logic

