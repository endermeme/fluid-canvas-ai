# Lịch sử thay đổi mã nguồn

## 26/04/2024 - Thêm lại chức năng chia sẻ game
- Tạo bảng shared_games và thiết lập RLS policies
- Cập nhật gameExport.ts với các hàm xử lý chia sẻ game
- Thêm props mới cho EnhancedGameView để hỗ trợ chia sẻ game
- Ghi chú các thay đổi trong changes.md

### Tệp đã chỉnh sửa:
1. `src/utils/gameExport.ts`: Thêm lại các hàm chia sẻ game
2. `src/components/quiz/custom-games/EnhancedGameView.tsx`: Cập nhật interface và thêm props mới
3. `src/changes.md`: Ghi chú các thay đổi

### Chi tiết thay đổi:
1. Tạo bảng `shared_games` với các trường:
   - id, game_id, created_at, expires_at, share_code, is_active
   - Thêm các indexes và RLS policies
2. Thêm lại các hàm trong gameExport.ts:
   - saveGameForSharing: Lưu game và tạo link chia sẻ
   - getSharedGame: Lấy thông tin game từ mã chia sẻ
   - getRemainingTime: Tính thời gian còn lại
3. Cập nhật EnhancedGameView với các props mới:
   - onShare: Xử lý chia sẻ game
   - onNewGame: Tạo game mới
   - extraButton: Thêm nút tùy chỉnh
