
# Các Quyết Định Phát Triển Game

## 2025-01-10: Cố định URL ảnh trong prompt Gemini
- **Thay đổi**: Cố định trong prompt gửi cho Gemini rằng PHẢI dùng URL từ `https://commons.wikimedia.org`
- **Áp dụng cho**: Pictionary, ProgressiveReveal và các game ảnh khác
- **Lý do**: Đảm bảo Gemini không tự ý dùng upload.wikimedia.org hay URL khác
- **Tệp sửa đổi**: `PresetGameManager.tsx` - cập nhật prompt AI với yêu cầu bắt buộc
- **Trạng thái**: Đã cập nhật với prompt bắt buộc

## 2025-01-10: Cập nhật URL ảnh từ commons.wikimedia.org
- **Thay đổi**: Tất cả game sử dụng ảnh phải dùng URL từ `https://commons.wikimedia.org` 
- **Áp dụng cho**: Pictionary, ProgressiveReveal và các game ảnh khác
- **Lý do**: Thống nhất format URL và đảm bảo ảnh load được tốt nhất
- **Tệp sửa đổi**: `PresetGameManager.tsx` - cập nhật prompt AI
- **Trạng thái**: Đã cập nhật

## 2025-01-10: Sửa lỗi giao diện game "Progressive Image Reveal"
- **Vấn đề**: Layout không liền khối, không cân xứng, có phần bị chéo
- **Sửa chữa**: 
  - Cải thiện responsive layout với grid system
  - Đảm bảo tất cả components align đúng
  - Fix spacing và padding để giao diện liền mạch
- **Tệp**: `ProgressiveRevealTemplate.tsx`
- **Trạng thái**: Đã sửa

## 2025-01-10: Sửa lỗi game "Progressive Image Reveal"
- **Vấn đề**: Điểm số quá cao (có thể > 100), giao diện bị lỗi, load ảnh chậm
- **Sửa chữa**:
  - Giới hạn điểm max = 100 điểm mỗi câu
  - Fix state management cho việc load ảnh mới
  - Cải thiện UI responsiveness và error handling
  - Đảm bảo ảnh load xong mới cho chơi câu tiếp theo
- **Tệp**: `ProgressiveRevealTemplate.tsx`
- **Trạng thái**: Đã sửa

## 2025-01-10: Tạo game "Progressive Image Reveal" mới
- **Loại**: Game đoán hình ảnh với cơ chế unique
- **Tính năng**: 
  - Ảnh hiện từ blur → clear dần dần (5 levels)
  - Multiple choice 4 đáp án
  - Scoring theo timing (càng đoán sớm càng cao điểm)
  - Sử dụng Gemini API lấy ảnh từ Commons Wikimedia
- **UI**: Mobile-friendly với buttons lớn, responsive design
- **Cơ chế**: Click/touch only, không typing
- **Tệp**: `ProgressiveRevealTemplate.tsx`
- **Trạng thái**: Đang implement

## 2025-01-10: Xóa bỏ các game mới và sửa lỗi syntax
- **Thay đổi**: Xóa toàn bộ 5 game mới (GroupSort, SpinWheel, CompleteSentence, Anagram, OpenBox)
- **Giữ lại**: Chỉ 8 game cũ gốc (quiz, flashcards, matching, memory, ordering, wordsearch, pictionary, truefalse)  
- **Lý do**: Theo yêu cầu người dùng muốn giữ lại game cũ và loại bỏ game mới
- **Tệp sửa đổi**: 
  - `templates/index.ts` - cập nhật export chỉ game cũ
  - `GameSelector.tsx` - loại bỏ game mới khỏi danh sách
  - `PresetGameManager.tsx` - xóa tag HTML không hợp lệ `</initial_code>` gây lỗi syntax
  - Xóa 5 file template game mới

## Các Game Gốc Được Giữ Lại:
1. **Quiz** - Trắc nghiệm nhiều lựa chọn
2. **Flashcards** - Thẻ ghi nhớ hai mặt  
3. **Matching** - Nối cặp từ tương ứng
4. **Memory** - Lật thẻ tìm cặp giống nhau
5. **Ordering** - Sắp xếp từ thành câu
6. **WordSearch** - Tìm từ ẩn trong lưới chữ
7. **Pictionary** - Đoán hình qua ảnh
8. **TrueFalse** - Câu hỏi đúng/sai

## Game Mới Đang Phát Triển:
9. **ProgressiveReveal** - Đoán hình từ blur dần rõ (đang implement)

## Nguyên Tắc Phát Triển:
- Không tạo giao diện code chuyên biệt trong quá trình tạo game custom
- Luôn kiểm tra file MD trước khi sửa đổi
- Ghi lại mọi thay đổi một cách ngắn gọn và rõ ràng
- Đảm bảo syntax hợp lệ cho tất cả file TypeScript/TSX
- Tất cả game mới phải hỗ trợ cả mobile và PC (click/touch only)
- Sử dụng Gemini API để lấy nội dung thay vì dữ liệu mẫu tĩnh
- **URL ảnh PHẢI được cố định trong prompt gửi cho Gemini: chỉ được dùng https://commons.wikimedia.org cho tất cả game về ảnh**
