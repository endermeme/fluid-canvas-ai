
# Game Development Decisions

## Database Updates (2025-06-14)

### Files Changed:
- supabase/migrations: Thêm cột share_count, last_accessed_at vào bảng games
- src/utils/gameExport.ts: Sửa lỗi TypeScript, sử dụng RPC function increment_share_count
- src/integrations/supabase/types.ts: Tự động cập nhật từ database schema

### Loại thay đổi:
- **Database Schema**: Thêm tracking cho game statistics
- **Bug Fix**: Sửa TypeScript errors liên quan đến supabase.sql không tồn tại
- **Function Usage**: Sử dụng RPC function thay vì raw SQL để update game stats

### Mô tả:
Thêm khả năng theo dõi số lần share và lần truy cập cuối của games. Sử dụng RPC function increment_share_count để tránh TypeScript errors với raw SQL.
