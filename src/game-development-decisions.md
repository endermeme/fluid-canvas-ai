
# Các Quyết Định Phát Triển Game

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

## 2025-01-10: Fix prompt để loại bỏ hoàn toàn Wikimedia Commons
- **Vấn đề**: Mặc dù đã tích hợp Google Search, prompt vẫn còn tham chiếu đến commons.wikimedia.org
- **Sửa chữa**: 
  - Cập nhật prompt trong `PresetGameManager.tsx` để BẮT BUỘC sử dụng Google Search
  - Loại bỏ hoàn toàn mọi tham chiếu đến Wikimedia Commons
  - Thêm yêu cầu rõ ràng về chất lượng và độ phù hợp của ảnh
  - Đảm bảo AI chỉ tìm ảnh từ Google Search, không dùng nguồn cũ
- **Tệp sửa đổi**: `PresetGameManager.tsx` - loại bỏ hoàn toàn Wikimedia Commons khỏi prompt
- **Trạng thái**: Đã cập nhật prompt để chỉ sử dụng Google Search - DEPRECATED, đã xóa game ảnh

## 2025-01-10: Tích hợp Google Search để tìm ảnh cho Progressive Reveal
- **Thay đổi**: Bỏ cơ chế tìm ảnh cũ từ Wikimedia Commons, chuyển sang sử dụng Google Search tool trong Gemini API
- **Tính năng mới**: 
  - Sử dụng Gemini 2.0 với Google Search tool để tìm ảnh thực tế từ web
  - AI sẽ tự động tìm kiếm ảnh phù hợp với chủ đề
  - Lấy URL ảnh trực tiếp từ kết quả search thay vì dùng Wikimedia Commons
  - Cải thiện độ chính xác và tính mới mẻ của ảnh
- **Cơ chế**: 
  - Prompt yêu cầu Gemini search ảnh trên Google với từ khoá phù hợp
  - Lấy URL ảnh trực tiếp từ kết quả search
  - Validate ảnh trước khi sử dụng trong game
- **Tệp sửa đổi**: 
  - `PresetGameManager.tsx` - cập nhật prompt để sử dụng Google Search
  - `ProgressiveRevealTemplate.tsx` - đơn giản hoá xử lý URL ảnh
- **Trạng thái**: Đã implement và fix prompt để loại bỏ hoàn toàn Wikimedia Commons - DEPRECATED, đã xóa game ảnh

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
