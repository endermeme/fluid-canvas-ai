
# Quyết định sửa đổi iframe-utils

## Ngày: 2025-04-20

### Files đã thay đổi:
1. Tạo mới src/components/quiz/utils/iframe-utils.ts
2. Tạo mới src/components/quiz/custom-games/utils/iframe-utils.ts

### Loại thay đổi:
- Đơn giản hóa xử lý HTML
- Sửa lỗi import
- Loại bỏ xử lý phức tạp

### Chi tiết:
- Xóa cơ chế lọc và xử lý phức tạp
- Giữ nguyên API để tương thích ngược
- Chỉ thực hiện xử lý HTML tối thiểu
- Tạo phiên bản đơn giản để giải quyết lỗi import

