# Các Quyết Định Phát Triển Game

## 2025-01-10: Fix prompt để loại bỏ hoàn toàn Wikimedia Commons
- **Vấn đề**: Mặc dù đã tích hợp Google Search, prompt vẫn còn tham chiếu đến commons.wikimedia.org
- **Sửa chữa**: 
  - Cập nhật prompt trong `PresetGameManager.tsx` để BẮT BUỘC sử dụng Google Search
  - Loại bỏ hoàn toàn mọi tham chiếu đến Wikimedia Commons
  - Thêm yêu cầu rõ ràng về chất lượng và độ phù hợp của ảnh
  - Đảm bảo AI chỉ tìm ảnh từ Google Search, không dùng nguồn cũ
- **Tệp sửa đổi**: `PresetGameManager.tsx` - loại bỏ hoàn toàn Wikimedia Commons khỏi prompt
- **Trạng thái**: Đã cập nhật prompt để chỉ sử dụng Google Search

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
- **Trạng thái**: Đã implement và fix prompt để loại bỏ hoàn toàn Wikimedia Commons

## 2025-01-10: Fix lỗi URL ảnh Wikimedia Commons - Chuyển sang URL trực tiếp (Lần 3)
- **Vấn đề**: Vẫn dùng Special:FilePath thay vì URL ảnh trực tiếp thực sự
- **Sửa chữa**: 
  - Cập nhật `getDirectImageUrl` để tạo URL trực tiếp từ `upload.wikimedia.org`
  - Convert từ `commons.wikimedia.org/wiki/File:...` sang `upload.wikimedia.org/wikipedia/commons/thumb/.../800px-...`
  - Thêm multiple fallback strategies với cấu trúc thư mục khác nhau
  - Tạo clean filename và proper encoding cho URL
  - Xử lý extension validation
- **Tệp sửa đổi**: `ProgressiveRevealTemplate.tsx` - convert thành real direct image URLs
- **Trạng thái**: Đã fix để dùng URL ảnh trực tiếp thực sự - DEPRECATED, chuyển sang Google Search

## 2025-01-10: Fix lỗi CORS với ảnh Wikimedia Commons - Progressive Reveal (Lần 2)
- **Vấn đề**: Vẫn còn lỗi "Image load error, using placeholder" với ảnh từ Wikimedia Commons
- **Sửa chữa**: 
  - Cải thiện hàm `getDirectImageUrl` với logging để debug
  - Thêm fallback method sử dụng `upload.wikimedia.org` khi Special:FilePath fail
  - Tăng cường error handling và retry mechanism
  - Thêm console.log để track quá trình convert URL
- **Tệp sửa đổi**: `ProgressiveRevealTemplate.tsx` - cải thiện URL conversion và fallback
- **Trạng thái**: Đã fix lỗi load ảnh - DEPRECATED, chuyển sang Google Search

## 2025-01-10: Fix lỗi CORS với ảnh Wikimedia Commons - Progressive Reveal
- **Vấn đề**: Ảnh từ commons.wikimedia.org bị chặn bởi OpaqueResponseBlocking (CORS policy)
- **Sửa chữa**: 
  - Cập nhật hàm `getDirectImageUrl` để convert URL từ `commons.wikimedia.org/wiki/File:...`
  - Sử dụng Special:FilePath API với width parameter để lấy ảnh trực tiếp
  - Thêm encodeURIComponent cho tên file để xử lý ký tự đặc biệt
  - Đảm bảo ảnh được load từ URL trực tiếp thay vì trang wiki
- **Tệp sửa đổi**: `ProgressiveRevealTemplate.tsx` - cải thiện image URL conversion
- **Trạng thái**: Đã fix lỗi CORS và cải thiện hiển thị ảnh - DEPRECATED, chuyển sang Google Search

## 2025-01-10: Cải thiện Progressive Reveal - Image scaling và scoring system
- **Thay đổi**: 
  - Fix việc hiển thị ảnh từ Wikimedia Commons với URL conversion
  - Cải thiện image scaling trong khung cố định (aspect-square)
  - Sửa scoring system theo thang điểm 10 trừ dần theo user settings
  - Thêm fallback loading cho ảnh lỗi
- **Tính năng**: 
  - Convert Wikimedia Commons URL thành direct image URL
  - Fixed aspect ratio container cho ảnh
  - Thời gian countdown theo thang 10 points, chia đều theo user timePerQuestion setting
  - Scoring = timeLeft (1-10) + blurLevel bonus
- **Tệp sửa đổi**: `ProgressiveRevealTemplate.tsx` - cải thiện image loading và scoring
- **Trạng thái**: Đã cập nhật với image scaling và scoring system mới

## 2025-01-10: Cố định URL ảnh trong prompt Gemini
- **Thay đổi**: Cố định trong prompt gửi cho Gemini rằng PHẢI dùng URL từ `https://commons.wikimedia.org`
- **Áp dụng cho**: Pictionary, ProgressiveReveal và các game ảnh khác
- **Lý do**: Đảm bảo Gemini không tự ý dùng upload.wikimedia.org hay URL khác
- **Tệp sửa đổi**: `PresetGameManager.tsx` - cập nhật prompt AI với yêu cầu bắt buộc
- **Trạng thái**: Đã cập nhật với prompt bắt buộc - DEPRECATED, chuyển sang Google Search

## 2025-01-10: Cập nhật URL ảnh từ commons.wikimedia.org
- **Thay đổi**: Tất cả game sử dụng ảnh phải dùng URL từ `https://commons.wikimedia.org` 
- **Áp dụng cho**: Pictionary, ProgressiveReveal và các game ảnh khác
- **Lý do**: Thống nhất format URL và đảm bảo ảnh load được tốt nhất
- **Tệp sửa đổi**: `PresetGameManager.tsx` - cập nhật prompt AI
- **Trạng thái**: Đã cập nhật - DEPRECATED, chuyển sang Google Search

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
9. **ProgressiveReveal** - Đoán hình từ blur dần rõ (sử dụng Google Search để tìm ảnh)

## Nguyên Tắc Phát Triển:
- Không tạo giao diện code chuyên biệt trong quá trình tạo game custom
- Luôn kiểm tra file MD trước khi sửa đổi
- Ghi lại mọi thay đổi một cách ngắn gọn và rõ ràng
- Đảm bảo syntax hợp lệ cho tất cả file TypeScript/TSX
- Tất cả game mới phải hỗ trợ cả mobile và PC (click/touch only)
- Sử dụng Gemini API để lấy nội dung thay vì dữ liệu mẫu tĩnh
- **Sử dụng Google Search tool trong Gemini 2.0 để tìm ảnh thực tế từ web**
- **Bỏ cơ chế Wikimedia Commons cũ, chuyển sang tìm ảnh trực tiếp từ Google Search**
- **AI sẽ tự động search và validate ảnh phù hợp với chủ đề game**

</edits_to_apply>
