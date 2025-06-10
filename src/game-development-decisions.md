
# Quyết định phát triển game

## Ngày: 2025-06-10

### Thay đổi thực hiện:
1. **Đơn giản hóa game Luyện Viết** - Chỉ 1 bài viết, thời gian cố định 10 phút
2. **Loại bỏ hệ thống phức tạp** - Bỏ nhiều bài, bỏ độ khó, chỉ giữ chức năng cốt lõi
3. **Tối ưu UI đơn giản** - Giao diện rõ ràng, dễ sử dụng

### File thay đổi:
- templates/SpeakingCardsTemplate.tsx (đơn giản hóa toàn bộ)

### Loại thay đổi:
- Đơn giản hóa: Từ nhiều bài thành 1 bài duy nhất
- Cố định: Thời gian 10 phút cho mọi bài viết
- Loại bỏ: Hệ thống độ khó, nhiều thẻ, navigation phức tạp

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
