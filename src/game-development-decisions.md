
# Các Quyết Định Phát Triển Game

## 2025-01-11: Cải tiến GameSettings - Loại bỏ "Learn interactively" và tăng kích thước
- **Thay đổi**: Redesign hoàn toàn GameSettings để hiện đại và user-friendly hơn
- **Cải tiến**:
  - Loại bỏ text "Learn interactively" không phù hợp
  - Tăng kích thước tổng thể của form settings (max-w-2xl)
  - Thêm header gradient với icon game tương ứng từng loại
  - Cải thiện placeholder text phù hợp với từng loại game
  - Typography và spacing lớn hơn, rõ ràng hơn
  - Color scheme xanh da trời nhất quán
  - Animation và hover effects mượt mà
- **Tệp sửa đổi**: `GameSettings.tsx` - redesign toàn bộ component
- **Trạng thái**: Đã hoàn thành

## 2025-01-11: Cải thiện layout và căn giữa giao diện
- **Thay đổi**: Điều chỉnh layout HomePage và GameSelector để hiển thị ở giữa màn hình
- **Cải tiến**:
  - Sử dụng `flex items-center justify-center` để căn giữa content theo cả 2 chiều
  - Điều chỉnh `min-h-screen` và padding để content không bị lệch lên trên
  - Cải thiện spacing và margin để tạo cân bằng tốt hơn
  - Tăng kích thước typography và spacing cho trải nghiệm tốt hơn
- **Tệp sửa đổi**:
  - `HomePage.tsx` - điều chỉnh layout căn giữa và spacing
  - `GameSelector.tsx` - cải thiện layout và alignment
- **Trạng thái**: Đã hoàn thành

## 2025-01-11: Redesign giao diện HomePage với tông màu xanh da trời
- **Thay đổi**: Redesign hoàn toàn giao diện HomePage để hiện đại và tinh tế hơn
- **Cải tiến**:
  - Sử dụng gradient background xanh da trời (sky-50, blue-50, indigo-100)
  - Cards với glass morphism effect (bg-white/70 backdrop-blur-md)
  - Typography cải thiện với font-bold và spacing tốt hơn
  - Hover effects và animations mượt mà hơn
  - Color scheme nhất quán với tông xanh da trời
- **Tệp sửa đổi**: `HomePage.tsx` - redesign toàn bộ giao diện
- **Trạng thái**: Đã hoàn thành

## 2025-01-11: Cải thiện giao diện GameSelector
- **Thay đổi**: Redesign GameSelector để hiện đại và user-friendly hơn
- **Cải tiến**:
  - Layout cải thiện với grid responsive
  - Cards với shadow và hover effects đẹp hơn
  - Quick start section với UI/UX tốt hơn
  - Loại bỏ text "Learn interactively" không phù hợp
  - Typography và spacing được cải thiện
- **Tệp sửa đổi**: `GameSelector.tsx` - cải thiện toàn bộ UI/UX
- **Trạng thái**: Đã hoàn thành

## 2025-01-11: Xóa 2 game liên quan đến hình ảnh
- **Quyết định**: Loại bỏ hoàn toàn 2 game sử dụng hình ảnh
- **Game bị xóa**:
  - Pictionary (đoán hình qua ảnh)
  - Progressive Reveal (đoán hình từ mờ đến rõ)
- **Lý do**: Theo yêu cầu người dùng muốn bỏ các game liên quan hình ảnh
- **Tệp bị xóa**:
  - `PictionaryTemplate.tsx`
  - `ProgressiveRevealTemplate.tsx`
- **Tệp sửa đổi**:
  - `templates/index.ts` - xóa export game liên quan ảnh
  - `GameSelector.tsx` - loại bỏ khỏi danh sách
  - `PresetGameManager.tsx` - xóa prompt tạo nội dung cho game ảnh
- **Trạng thái**: Đã xóa hoàn toàn

## Các Game Gốc Được Giữ Lại:
1. **Quiz** - Trắc nghiệm nhiều lựa chọn
2. **Flashcards** - Thẻ ghi nhớ hai mặt  
3. **Matching** - Nối cặp từ tương ứng
4. **Memory** - Lật thẻ tìm cặp giống nhau
5. **Ordering** - Sắp xếp từ thành câu
6. **WordSearch** - Tìm từ ẩn trong lưới chữ
7. **TrueFalse** - Câu hỏi đúng/sai

## Game Đã Xóa:
- **Pictionary** - Đoán hình qua ảnh (đã xóa 2025-01-11)
- **ProgressiveReveal** - Đoán hình từ blur dần rõ (đã xóa 2025-01-11)

## Nguyên Tắc Phát Triển:
- Không tạo giao diện code chuyên biệt trong quá trình tạo game custom
- Luôn kiểm tra file MD trước khi sửa đổi
- Ghi lại mọi thay đổi một cách ngắn gọn và rõ ràng
- Đảm bảo syntax hợp lệ cho tất cả file TypeScript/TSX
- Tất cả game mới phải hỗ trợ cả mobile và PC (click/touch only)
- Sử dụng Gemini API để lấy nội dung thay vì dữ liệu mẫu tĩnh
- **Chỉ tập trung vào game văn bản, không sử dụng hình ảnh**
- **Bỏ hoàn toàn mọi cơ chế tìm kiếm và xử lý ảnh**
- **Giao diện phải hiện đại, căn giữa và cân bằng trên màn hình**
- **Sử dụng tông màu xanh da trời làm chủ đạo với các điểm nhấn khác**
- **Settings phải rõ ràng, lớn và phù hợp với từng loại game**
- **Loại bỏ các text placeholder không phù hợp như "Learn interactively"**
