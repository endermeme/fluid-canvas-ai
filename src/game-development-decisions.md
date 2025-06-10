
# Các Quyết Định Phát Triển Game

## 2025-01-10: Tạo game "Progressive Image Reveal" mới
- **Loại**: Game đoán hình ảnh với cơ chế unique
- **Tính năng**: 
  - Ảnh hiện từ blur → clear dần dần (5 levels)
  - Multiple choice 4 đáp án
  - Scoring theo timing (càng đoán sớm càng cao điểm)
  - Sử dụng Gemini API lấy ảnh từ Wikipedia/Commons
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

## 2025-01-10: Tạo game "Mở Hộp Bí Ẩn" - OpenBox  
- **Loại**: Game thể loại mới
- **Tính năng**: Người chơi mở hộp để khám phá câu hỏi bên trong
- **UI**: Hiệu ứng mở hộp với animation, màu sắc tươi sáng (cyan, blue, green, orange)
- **Cơ chế**: Trắc nghiệm và đúng/sai với dialog hiển thị câu hỏi khi mở hộp
- **Tệp**: `OpenBoxTemplate.tsx`
- **Trạng thái**: Đã xóa theo yêu cầu

## 2025-01-10: Tạo game "Xếp Chữ" - Anagram
- **Loại**: Game sắp xếp từ
- **Tính năng**: Người chơi kéo thả các chữ cái để tạo thành từ đúng
- **UI**: Drag & drop với hiệu ứng visual feedback  
- **Cơ chế**: Hint system và animation khi hoàn thành
- **Tệp**: `AnagramTemplate.tsx`
- **Trạng thái**: Đã xóa theo yêu cầu

## 2025-01-10: Tạo game "Hoàn Thành Câu" - CompleteSentence
- **Loại**: Game điền từ vào chỗ trống
- **Tính năng**: Điền từ thiếu vào câu với gợi ý
- **UI**: Input fields với validation real-time
- **Cơ chế**: Multiple blanks per sentence với scoring
- **Tệp**: `CompleteSentenceTemplate.tsx` 
- **Trạng thái**: Đã xóa theo yêu cầu

## 2025-01-10: Tạo game "Vòng Xoay May Mắn" - SpinWheel
- **Loại**: Game quay số may mắn
- **Tính năng**: Quay bánh xe để chọn câu hỏi ngẫu nhiên
- **UI**: Animated spinning wheel với sound effects
- **Cơ chế**: Random question selection với bonus points
- **Tệp**: `SpinWheelTemplate.tsx`
- **Trạng thái**: Đã xóa theo yêu cầu

## 2025-01-10: Tạo game "Phân Loại Nhóm" - GroupSort  
- **Loại**: Game phân loại và sắp xếp
- **Tính năng**: Kéo thả các item vào nhóm phù hợp
- **UI**: Multiple drop zones với color coding
- **Cơ chế**: Drag & drop validation với feedback
- **Tệp**: `GroupSortTemplate.tsx`
- **Trạng thái**: Đã xóa theo yêu cầu

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
