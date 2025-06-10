
# Quyết định phát triển game

## Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Xóa các game mới** - Loại bỏ hoàn toàn 5 game template: GroupSort, SpinWheel, CompleteSentence, Anagram, OpenBox
2. **Giữ lại game cũ** - Chỉ giữ lại 8 game template cơ bản: Quiz, Flashcards, Matching, Memory, Ordering, WordSearch, Pictionary, TrueFalse
3. **Cập nhật GameSelector** - Xóa các game mới khỏi danh sách, chỉ hiển thị game cũ
4. **Cập nhật templates index** - Loại bỏ import và export của các game mới

### File thay đổi:
- templates/GroupSortTemplate.tsx (xóa)
- templates/SpinWheelTemplate.tsx (xóa)
- templates/CompleteSentenceTemplate.tsx (xóa)
- templates/AnagramTemplate.tsx (xóa)
- templates/OpenBoxTemplate.tsx (xóa)
- templates/index.ts (cập nhật exports)
- GameSelector.tsx (cập nhật danh sách game)

### Loại thay đổi:
- Xóa: 5 game template mới
- Cập nhật: GameSelector và template exports
- Giữ lại: 8 game template cơ bản

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Sửa lỗi game Mở Hộp Bí Ẩn** - Dialog câu hỏi không hiện, màu sắc vẫn xám
2. **Sửa logic câu hỏi** - Đảm bảo dialog xuất hiện khi mở hộp câu hỏi
3. **Cải thiện màu sắc** - Dùng màu tươi sáng: cyan, blue, green, orange thay vì xám
4. **Tối ưu UI** - RadioGroup và dialog hiển thị chính xác

### File thay đổi:
- templates/OpenBoxTemplate.tsx (sửa logic dialog và màu sắc hoàn chỉnh)

### Loại thay đổi:
- Sửa lỗi: Dialog câu hỏi không hiện khi mở hộp
- Sửa lỗi: Màu sắc vẫn xám thay vì tươi sáng
- Cải thiện: Logic xử lý câu hỏi và UI

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Cải thiện game Mở Hộp Bí Ẩn** - Bỏ bonus box, chỉ giữ câu hỏi và thử thách
2. **Thêm dạng câu hỏi mới** - Câu hỏi 4 lựa chọn và câu hỏi đúng/sai với RadioGroup
3. **Cải thiện màu sắc** - Dùng màu tươi hơn: cyan, blue, indigo thay vì tím đậm
4. **Tối ưu UX** - Dialog rõ ràng với RadioGroup cho việc chọn đáp án

### File thay đổi:
- templates/OpenBoxTemplate.tsx (cập nhật toàn bộ logic câu hỏi và màu sắc)

### Loại thay đổi:
- Bỏ: Bonus box (reward type)
- Thêm: Câu hỏi trắc nghiệm 4 lựa chọn và đúng/sai
- Cải thiện: Màu sắc tươi sáng hơn
- Cải thiện: UI/UX với RadioGroup

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Cải thiện game Mở Hộp Bí Ẩn** - Thêm logic yêu cầu trả lời câu hỏi khi mở hộp
2. **Thêm dialog trả lời** - Modal cho phép người chơi nhập câu trả lời cho câu hỏi
3. **Tính điểm thông minh** - Cộng điểm nếu đúng, trừ một nửa điểm nếu sai
4. **Cải thiện màu sắc** - Đồng bộ màu sắc các hộp và UI đẹp hơn

### File thay đổi:
- templates/OpenBoxTemplate.tsx (cập nhật logic game)

### Loại thay đổi:
- Thêm: Logic trả lời câu hỏi với dialog
- Cải thiện: Tính điểm dựa trên đúng/sai
- Cải thiện: Màu sắc và UI đồng bộ

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Thêm AI tạo đề tài** - AI tự động tạo đề tài viết thay vì dùng chủ đề có sẵn
2. **Cải thiện workflow** - AI tạo đề tài → hiển thị đề tài → người dùng viết → AI chấm điểm
3. **Tối ưu UX** - Hiển thị rõ ràng đề tài và quá trình từng bước

### File thay đổi:
- templates/SpeakingCardsTemplate.tsx (thêm AI tạo đề tài)

### Loại thay đổi:
- Thêm: AI tự động tạo đề tài viết dựa trên chủ đề chung
- Cải thiện: Workflow rõ ràng từ tạo đề tài đến chấm điểm
- Tối ưu: UI/UX hiển thị đề tài và quá trình

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Sửa lỗi game Luyện Viết** - Thêm logic chấm điểm AI hoàn chỉnh
2. **Hoàn thiện workflow** - Thêm textarea nhập bài, gửi Gemini API, hiển thị kết quả
3. **Sửa logic flow** - Đảm bảo không quay về màn hình sẵn sàng sau khi gửi

### File thay đổi:
- templates/SpeakingCardsTemplate.tsx (sửa logic hoàn chỉnh)

### Loại thay đổi:
- Sửa lỗi: Logic thiếu xử lý AI chấm điểm
- Thêm: Textarea nhập bài viết và API call đến Gemini
- Sửa: Flow game không bị reset sau khi gửi bài

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Cập nhật SpeakingCardsTemplate** - Chuyển từ game luyện nói thành game luyện viết
2. **Tích hợp AI chấm điểm** - Sử dụng Gemini API để chấm điểm bài viết của người dùng
3. **Thêm textarea và UI mới** - Giao diện cho phép nhập văn bản và hiển thị kết quả chấm điểm

### File thay đổi:
- templates/SpeakingCardsTemplate.tsx (cập nhật toàn bộ logic)

### Loại thay đổi:
- Cập nhật: Logic game từ speaking sang writing
- Thêm: Tích hợp Gemini API cho chấm điểm
- Thêm: UI textarea và hiển thị kết quả

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Xóa game PatternRecognition** - Loại bỏ game "Nhận Dạng Mẫu" khỏi hệ thống
2. **Cập nhật GameSelector** - Xóa PatternRecognition khỏi danh sách game có sẵn  
3. **Cập nhật templates index** - Loại bỏ import và export của PatternRecognitionTemplate

### File thay đổi:
- templates/PatternRecognitionTemplate.tsx (xóa)
- templates/index.ts (cập nhật exports)
- GameSelector.tsx (xóa game khỏi danh sách)

### Loại thay đổi:
- Xóa: 1 game template
- Cập nhật: GameSelector và template exports

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Xóa game NeuronPaths** - Loại bỏ game "Đường Dẫn Thần Kinh" khỏi hệ thống
2. **Cập nhật GameSelector** - Xóa NeuronPaths khỏi danh sách game có sẵn  
3. **Cập nhật templates index** - Loại bỏ import và export của NeuronPathsTemplate

### File thay đổi:
- templates/NeuronPathsTemplate.tsx (xóa)
- templates/index.ts (cập nhật exports)
- GameSelector.tsx (xóa game khỏi danh sách)

### Loại thay đổi:
- Xóa: 1 game template
- Cập nhật: GameSelector và template exports

## Ngày: 2025-06-07

### Thay đổi thực hiện:
1. **Thêm template cho các game mới** - Tạo template cho GroupSortTemplate, SpinWheelTemplate, CompleteSentenceTemplate, OpenBoxTemplate, SpeakingCardsTemplate
2. **Đồng bộ AI generation** - Cập nhật PresetGameManager để hỗ trợ tạo nội dung AI cho các game mới
3. **Sửa lỗi template missing** - Các game trong GameSelector đã có nhưng thiếu template

### File thay đổi:
- templates/GroupSortTemplate.tsx (tạo mới)
- templates/SpinWheelTemplate.tsx (tạo mới) 
- templates/CompleteSentenceTemplate.tsx (tạo mới)
- templates/OpenBoxTemplate.tsx (tạo mới)
- templates/SpeakingCardsTemplate.tsx (tạo mới)
- PresetGameManager.tsx (cập nhật AI generation)

### Loại thay đổi:
- Tạo mới: 5 template components
- Cập nhật: AI generation logic

## Trước đó - Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Xóa game Luyện Viết** - Loại bỏ game "Luyện Viết với AI" (trước đây là "Thẻ Nói") khỏi hệ thống
2. **Cập nhật GameSelector** - Xóa speakingcards khỏi danh sách game có sẵn  
3. **Cập nhật templates index** - Loại bỏ import và export của SpeakingCardsTemplate

### File thay đổi:
- templates/SpeakingCardsTemplate.tsx (xóa)
- templates/index.ts (cập nhật exports)
- GameSelector.tsx (xóa game khỏi danh sách)

### Loại thay đổi:
- Xóa: 1 game template
- Cập nhật: GameSelector và template exports
