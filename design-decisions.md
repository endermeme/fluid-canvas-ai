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

## 2024-12-17: Quiz Template UI Enhancement
- **Vấn đề**: Giao diện quiz cần cải thiện với nút to hơn, bố cục dọc và animation rõ ràng hơn
- **Giải pháp**: 
  - Thiết kế lại layout với 4 nút dọc thay vì grid 2x2
  - Tăng kích thước nút (p-5 sm:p-6) và cải thiện spacing
  - Thêm Framer Motion cho animation mượt mà
  - Cải thiện màu sắc và gradient cho trạng thái đúng/sai
  - Thêm hover effects và scale animations
  - Sử dụng backdrop-blur và gradient backgrounds
  - Responsive design với breakpoints sm:
- **Files thay đổi**: QuizTemplate.tsx
- **Lý do**: Tạo trải nghiệm người dùng trực quan và hấp dẫn hơn cho game quiz

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

## 2024-12-17: QuizTemplate Giao Diện To Hơn và Tự Động Chuyển Câu
- **Vấn đề**: Giao diện quiz còn nhỏ, chưa đầy đặn và không tự động chuyển câu sau khi trả lời
- **Giải pháp**: 
  - Tăng kích thước tổng thể: padding từ p-4 lên p-6/p-8, font từ text-lg lên text-2xl/text-3xl
  - Tăng kích thước nút: padding từ p-5 lên p-6/p-8, chiều cao nút lên py-6
  - Tăng kích thước icon: từ h-4 w-4 lên h-5 w-5 và h-8 w-8 cho option icons
  - Thêm tự động chuyển câu: setTimeout 2.5 giây sau khi trả lời
  - Cải thiện spacing: gap từ 3 lên 4-5, margin bottom tăng
  - Tăng max-width container từ max-w-2xl lên max-w-4xl
  - Cải thiện card result: tăng padding và font size
- **Files thay đổi**: QuizTemplate.tsx
- **Lý do**: Tạo trải nghiệm người dùng tốt hơn với giao diện lớn, rõ ràng và flow tự động mượt mà

## 2024-12-17: QuizTemplate Final Syntax Error Fix
- **Vấn đề**: Lỗi JSX syntax nghiêm trọng do cấu trúc thẻ không đúng, motion.div không được đóng và return statement bị lỗi cấu trúc
- **Giải pháp**: 
  - Viết lại hoàn toàn cấu trúc JSX với đóng thẻ đúng cách
  - Đảm bảo mọi motion.div, div và JSX element đều có thẻ đóng tương ứng
  - Kiểm tra và sửa tất cả cấu trúc nested JSX từ đầu đến cuối
  - Giữ nguyên tất cả functionality và business logic đã có
  - Đảm bảo không có thẻ mở thừa hoặc thiếu thẻ đóng
- **Files thay đổi**: QuizTemplate.tsx
- **Lý do**: Sửa lỗi build nghiêm trọng để component có thể hoạt động bình thường và tránh crash ứng dụng

## 2024-12-17: GameSelector Animation Optimization
- **Vấn đề**: Giao diện preset game bị giật giật ở các phần chữ khi hover và transition
- **Giải pháp**: 
  - Thêm `will-change-transform` để tối ưu GPU rendering
  - Sử dụng `transform: translate3d(0, 0, 0)` để kích hoạt hardware acceleration
  - Thêm `backfaceVisibility: hidden` và `perspective: 1000px` cho smooth animation
  - Cải thiện transition timing với `ease-out` thay vì default
  - Tối ưu transform thay vì thay đổi layout properties
  - Thêm transition riêng cho từng element (text, icons, backgrounds)
- **Files thay đổi**: GameSelector.tsx
- **Lý do**: Loại bỏ hiện tượng giật lag khi hover và tạo animation mượt mà hơn cho UX tốt hơn
