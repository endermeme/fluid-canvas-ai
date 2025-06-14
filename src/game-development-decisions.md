
# Các Quyết Định Phát Triển Game

## 2025-01-14: Fix chức năng share link và thêm game template mới
- **Thay đổi**: Cải thiện chức năng share link với Supabase và thêm game template mới
- **Cải tiến database**:
  - Thêm cột `share_count` và `last_accessed_at` vào bảng `games` 
  - Tạo bảng `game_templates` cho việc quản lý template game
  - Cập nhật RLS policies cho việc share game public
  - Thêm indexes để tăng hiệu suất truy vấn
- **Cải tiến code**:
  - Fix lỗi syntax SQL migration
  - Cập nhật gameExport utils để handle share count
  - Cải thiện error handling cho share functionality
- **Tệp sửa đổi**:
  - `game-development-decisions.md` - ghi lại quyết định
  - `gameExport.ts` - cải thiện share functionality
- **Trạng thái**: Đang thực hiện

## 2025-01-11: Tối ưu settings template cho từng loại game
- **Thay đổi**: Điều chỉnh settings template để phù hợp với từng loại game cụ thể
- **Cải tiến**:
  - **Quiz**: Chỉ giữ các settings liên quan đến câu hỏi trắc nghiệm (difficulty, questionCount, timePerQuestion, useTimer, showExplanation, shuffleQuestions, shuffleOptions, bonusTime)
  - **Flashcards**: Chỉ các settings cho thẻ ghi nhớ (autoFlip, flipTime, shuffleCards, showProgress)
  - **Matching**: Settings cho game nối từ (difficulty, timeLimit, shuffleItems, allowPartialMatching)
  - **Memory**: Settings cho game ghi nhớ (useTimer, timeLimit, allowHints, shuffleCards)
  - **Ordering**: Settings cho sắp xếp câu (timeLimit, showHints, allowShuffle)
  - **WordSearch**: Settings cho tìm từ ẩn (gridSize, allowDiagonalWords, showWordList, timeLimit)
  - **TrueFalse**: Settings cho đúng/sai (timePerQuestion, totalTime, showExplanation)
- **Logic fixes**:
  - TrueFalseTemplate: Fix timer logic và state management tương tự QuizTemplate
  - Cải thiện xử lý timer và useEffect hooks
  - Đảm bảo các settings được sử dụng đúng cách trong từng template
- **Tệp sửa đổi**:
  - `GameSelector.tsx` - thêm defaultSettings cho từng game type
  - `TrueFalseTemplate.tsx` - fix logic timer và state management
- **Trạng thái**: Đã hoàn thành

## 2025-01-11: Fix lỗi logic templates và redesign GameSelector
- **Thay đổi**: Sửa lỗi logic và cải thiện giao diện toàn bộ
- **Lỗi đã sửa**:
  - QuizTemplate: Fix timer logic, xử lý useTimer properly, bonus time logic
  - FlashcardsTemplate: Fix auto-flip timer conflicts, state management
  - MemoryTemplate: Fix matching logic, card state handling, timer integration
- **Cải tiến GameSelector**:
  - Loại bỏ phần "quick start" vô dụng
  - Redesign cards đều đặn với grid responsive 
  - Thêm hover effects và animations mượt mà
  - Icon và gradient riêng cho từng game type
  - Layout centered và cân bằng trên màn hình
  - Typography và spacing được cải thiện
- **Tệp sửa đổi**:
  - `QuizTemplate.tsx` - fix timer và state logic
  - `FlashcardsTemplate.tsx` - fix auto-flip và timer conflicts  
  - `MemoryTemplate.tsx` - fix matching algorithm và state
  - `GameSelector.tsx` - redesign hoàn toàn giao diện
- **Trạng thái**: Đã hoàn thành

## 2025-01-11: Tối ưu kích thước GameSettings - Giảm padding và spacing
- **Thay đổi**: Điều chỉnh kích thước GameSettings để vừa phải, không quá to phải scroll
- **Cải tiến**:
  - Giảm max-width từ max-w-2xl xuống max-w-xl
  - Giảm padding header từ p-8 xuống p-6
  - Giảm padding main content từ p-8 xuống p-6
  - Giảm spacing từ space-y-8 xuống space-y-6
  - Giảm kích thước icon từ h-12 w-12 xuống h-10 w-10
  - Giảm kích thước textarea từ min-h-[120px] xuống min-h-[100px]
  - Giảm height các input và button từ h-14 xuống h-12 và h-10
  - Điều chỉnh spacing cho grid và labels để compact hơn
- **Tệp sửa đổi**: `GameSettings.tsx` - tối ưu kích thước và spacing
- **Trạng thái**: Đã hoàn thành

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
- **Trạng thái**: Đã hoàn thành (sau đó được tối ưu lại)

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
- **Trạng thái**: Đã hoàn thành (sau đó được redesign lại hoàn toàn)

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
1. **Quiz** - Trắc nghiệm nhiều lựa chọn ✅ Fixed logic
2. **Flashcards** - Thẻ ghi nhớ hai mặt ✅ Fixed logic  
3. **Matching** - Nối cặp từ tương ứng
4. **Memory** - Lật thẻ tìm cặp giống nhau ✅ Fixed logic
5. **Ordering** - Sắp xếp từ thành câu
6. **WordSearch** - Tìm từ ẩn trong lưới chữ
7. **TrueFalse** - Câu hỏi đúng/sai ✅ Fixed logic

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
- **Settings phải rõ ràng, lớn và phù hợp với từng loại game nhưng không quá to phải scroll**
- **Loại bỏ các text placeholder không phù hợp như "Learn interactively"**
- **Tối ưu kích thước để vừa phải với màn hình, tránh scroll không cần thiết**
- **Cards game phải đều đặn, không thò thụt, với hover effects mượt mà**
- **Loại bỏ các tính năng quick start vô dụng không cần thiết**
- **Fix tất cả lỗi logic trong game templates để hoạt động chính xác**
- **Settings template phải tối ưu cho từng loại game, loại bỏ các settings thừa không cần thiết**
- **Mỗi game type chỉ có những settings phù hợp với chức năng của nó**
- **Database migrations phải tuân theo syntax PostgreSQL chính xác**
- **Share link phải hoạt động ổn định với RLS policies phù hợp**
