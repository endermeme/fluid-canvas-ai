
# Game Changes Log

## 2025-06-07 - Thêm template cho các game mới và đồng bộ AI

### Thay đổi:
1. **Tạo template cho 5 game mới**:
   - GroupSortTemplate.tsx - Game phân nhóm với drag & drop
   - SpinWheelTemplate.tsx - Vòng quay may mắn với SVG animation 
   - OpenBoxTemplate.tsx - Mở hộp bí ẩn với rewards/challenges
   - SpeakingCardsTemplate.tsx - Thẻ luyện nói với timer
   - CompleteSentenceTemplate.tsx (đã có sẵn)

2. **Cập nhật AI generation trong PresetGameManager.tsx**:
   - Thêm JSON format cho các game mới
   - Cập nhật settings cho từng loại game
   - Thêm error handling cho game không có sample data

3. **File đã thay đổi**:
   - templates/GroupSortTemplate.tsx (mới)
   - templates/SpinWheelTemplate.tsx (mới) 
   - templates/OpenBoxTemplate.tsx (mới)
   - templates/SpeakingCardsTemplate.tsx (mới)
   - PresetGameManager.tsx (cập nhật)
   - game-development-decisions.md (mới)

### Tính năng:
- Tất cả game mới đều hỗ trợ AI generation
- Responsive design với Tailwind CSS
- Toast notifications cho feedback
- Timer và scoring system
- Game state management hoàn chỉnh

## 2025-06-07 - Cập nhật prompt AI cho game Đoán Hình

### Thay đổi:
- Cập nhật prompt AI để lấy ảnh từ internet linh hoạt hơn
- Không cố định nguồn ảnh cụ thể
- Yêu cầu AI tìm ảnh phù hợp với chủ đề

### File thay đổi:
- PresetGameManager.tsx - case 'pictionary'
