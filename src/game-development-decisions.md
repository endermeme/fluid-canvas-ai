
# Quyết định phát triển game

## Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Xóa game NeuronPaths** - Loại bỏ game "Đường Dẫn Thần Kinh" khỏi hệ thống
2. **Refactor PresetGameManager** - Chia file lớn thành các module nhỏ hơn
3. **Tạo custom hooks** - useGameGeneration, useGameSharing để quản lý logic riêng biệt
4. **Tạo components tái sử dụng** - GameErrorDisplay, GameContentRenderer, ShareDialog
5. **Tạo utility functions** - gameUtils, sampleDataLoader để tách logic chung

### File thay đổi:
- templates/NeuronPathsTemplate.tsx (xóa) - Game đường dẫn thần kinh
- templates/index.ts (cập nhật) - Xóa import NeuronPathsTemplate
- GameSelector.tsx (cập nhật) - Xóa entry neuronpaths
- hooks/useGameGeneration.ts (tạo mới) - Quản lý AI generation
- hooks/useGameSharing.ts (tạo mới) - Quản lý game sharing
- components/GameErrorDisplay.tsx (tạo mới) - Component hiển thị lỗi
- components/GameContentRenderer.tsx (tạo mới) - Component render game
- components/ShareDialog.tsx (tạo mới) - Dialog chia sẻ
- utils/gameUtils.ts (tạo mới) - Utility functions chung
- utils/sampleDataLoader.ts (tạo mới) - Load sample data
- PresetGameManager.tsx (refactor) - Giảm từ 782 lines xuống ~150 lines

### Loại thay đổi:
- Xóa: Game NeuronPaths (đường dẫn thần kinh)
- Refactor: Chia file lớn thành module nhỏ
- Tối ưu: Cải thiện maintainability và readability
- Tái cấu trúc: Tách logic thành hooks và components riêng biệt

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
