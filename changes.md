# Quyết định & Lịch sử chỉnh sửa

## 2025-04-21: Thiết kế lại header các game preset, loại bỏ tên game
- Tạo mới: src/components/quiz/preset-games/PresetGameHeader.tsx (header preset mới, tối giản, chỉ còn các nút icon quay về, tạo mới, lịch sử, chia sẻ)
- Cập nhật: src/components/quiz/preset-games/templates/TrueFalseTemplate.tsx sử dụng PresetGameHeader, không còn tên game trên header
- Điều chỉnh lại các props cho đồng bộ
