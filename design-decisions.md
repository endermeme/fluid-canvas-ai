
# Design Decisions Log

## 2024-01-01: Game Templates Responsive Design
- **Vấn đề**: Các game template bị tràn màn hình khi zoom hoặc thay đổi kích thước cửa sổ
- **Giải pháp**: 
  - Sử dụng `h-screen max-h-screen overflow-hidden` cho container chính
  - Thêm responsive breakpoints cho text size và spacing
  - Sử dụng `flex-shrink-0` cho header và footer, `flex-1` cho content area
  - Thêm `overflow-auto` cho các vùng có thể cuộn
  - Sử dụng `min-h-0` để ngăn flex items mở rộng quá mức
- **Files thay đổi**:
  - FlashcardsTemplate.tsx: Thêm responsive layout và text sizing
  - MatchingTemplate.tsx: Cải thiện grid layout và text handling
  - MemoryTemplate.tsx: Tối ưu memory card grid và controls
  - EnhancedGameView.tsx: Sử dụng h-screen thay vì h-full
- **Lý do**: Đảm bảo game templates hoạt động tốt trên mọi kích thước màn hình và mức zoom

## 2024-12-17: Loading Animation Enhancement
- **Vấn đề**: Animation loading không tự nhiên, các icon dừng đột ngột sau khi hoàn thành giai đoạn
- **Giải pháp**: 
  - Icon đang hoạt động: quay liên tục với animation mượt mà
  - Icon đã hoàn thành: quay về vị trí dọc (0 độ) với animation easeOut
  - Thêm checkmark cho các giai đoạn đã hoàn thành
  - Thay đổi màu sắc để phân biệt trạng thái (xanh lá cho hoàn thành)
- **Files thay đổi**: GameStageProgress.tsx
- **Lý do**: Tạo trải nghiệm loading tự nhiên và trực quan hơn

## 2024-12-17: PresetGameHeader Layout Fix
- **Vấn đề**: Nút quay lại thừa trong template, giao diện bị thiên lên trên không vào giữa
- **Giải pháp**: 
  - Xóa nút quay lại thừa từ các template
  - Cải thiện căn giữa giao diện với flexbox
  - Tăng kích thước font và padding phù hợp
- **Files thay đổi**: PresetGameHeader.tsx, GameHeader.tsx, CustomGameHeader.tsx, QuizHeader.tsx
- **Lý do**: Tránh trùng lặp UI và cải thiện UX

## 2024-12-17: OrderingTemplate Layout Improvement  
- **Vấn đề**: Template sắp xếp câu có nút quay lại thừa, giao diện không căn giữa và nhỏ
- **Giải pháp**:
  - Xóa nút quay lại thừa khỏi template
  - Sử dụng flexbox để căn giữa nội dung
  - Tăng kích thước font và spacing
  - Cải thiện responsive design
- **Files thay đổi**: OrderingTemplate.tsx
- **Lý do**: Tạo trải nghiệm người dùng nhất quán và dễ sử dụng

## 2024-12-17: API Call Optimization for Game Loading
- **Vấn đề**: Thanh tiến trình bị kẹt ở giai đoạn phân tích chủ đề do chỉ gọi API một lần
- **Giải pháp**: Triển khai chế độ dự đoán (predictive mode) trong useLoadingProgress hook
  - Tự động tiến qua các giai đoạn khi không có phản hồi API
  - Đồng bộ với hoàn thành API khi có phản hồi
  - Thêm cơ chế fallback cho trường hợp API chậm
- **Files thay đổi**: 
  - useLoadingProgress.ts: Thêm logic dự đoán tiến trình
  - GameLoading.tsx: Cập nhật hiển thị với chế độ dự đoán
- **Lý do**: Cải thiện trải nghiệm người dùng khi tải game, tránh trường hợp kẹt
