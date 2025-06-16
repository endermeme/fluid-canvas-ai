
# Game Development Decisions

## 2025-01-16: Cải thiện template Flashcards với hiệu ứng 3D và giao diện đẹp hơn
- **Thay đổi**: Nâng cấp toàn bộ giao diện Flashcards với hiệu ứng lật thẻ 3D thực tế
- **Files**: 
  - src/components/quiz/preset-games/templates/FlashcardsTemplate.tsx
  - src/styles/animations.css
- **Chi tiết**:
  - **Hiệu ứng lật thẻ 3D**: Sử dụng CSS 3D transforms với perspective, backface-visibility và transform-style
  - **Thẻ to hơn và đẹp hơn**: Tăng kích thước lên h-80, thêm gradient backgrounds và shadow-2xl
  - **Giao diện sống động**: Background gradient từ violet-blue-cyan, glass morphism effects
  - **Layout tối ưu**: Di chuyển tất cả controls xuống bottom với fixed positioning
  - **Animation smooth**: Thêm transition-transform duration-700 cho flip effect
  - **Màu sắc tương tác**: Mặt trước dùng blue gradient, mặt sau dùng cyan gradient
  - **Typography cải thiện**: Text-3xl font-bold cho nội dung thẻ
  - **Button styling**: Gradient buttons với shadow và hover effects
  - **Responsive design**: Duy trì responsive cho mobile và desktop

## 2025-01-16: Sửa lỗi UI/UX toàn bộ templates
- **Thay đổi**: Fix tất cả vấn đề giao diện game templates
- **Files**: 
  - src/components/quiz/preset-games/templates/FlashcardsTemplate.tsx
  - src/components/quiz/preset-games/templates/QuizTemplate.tsx
- **Chi tiết**:
  - **Fixed điểm số**: Di chuyển điểm số lên ngay dưới header với position cố định
  - **Fixed kích thước game**: Scale to hơn giao diện game, đặc biệt flashcards và quiz
  - **Fixed contrast**: Sử dụng text-foreground thay vì màu trắng trên nền sáng
  - **Fixed scroll**: Xóa bỏ scroll không cần thiết bằng cách dùng overflow-hidden và flex layout
  - **Layout cải thiện**: Sử dụng h-full flex flex-col để control layout chính xác
  - **Header cố định**: Thêm flex-shrink-0 cho header để không bị co lại
  - **Game area**: Flex-1 để chiếm hết không gian còn lại
  - **Responsive**: Cải thiện responsive design cho mobile và desktop

## 2025-01-16: Sửa lỗi animation orbital - Hành tinh quay tròn đúng cách
- **Thay đổi**: Fix lỗi animation khiến hành tinh di chuyển theo đường thẳng thay vì quay tròn
- **Files**: src/components/quiz/components/SolarSystemSpinner.tsx
- **Chi tiết**:
  - Thay đổi cách positioning hành tinh từ `top: '0'` thành `top: '-Xrem'` (âm để đặt hành tinh ở phía trên quỹ đạo)
  - Sử dụng `transform: 'translate(-50%, -50%)'` cho container quỹ đạo
  - Đặt `origin-center` cho các container hành tinh để quay quanh tâm
  - Mỗi hành tinh được định vị chính xác trên rìa quỹ đạo của nó
  - Bảo đảm animation `animate-spin` hoạt động đúng với orbital motion thay vì linear motion

## 2025-01-16: Chuyển đổi thành AI Solar System thực tế
- **Thay đổi**: Tạo mô phỏng hệ mặt trời thực tế với biểu tượng AI Brain làm trung tâm
- **Files**: src/components/quiz/components/SolarSystemSpinner.tsx
- **Chi tiết**:
  - Giữ biểu tượng Brain ở trung tâm với hào quang AI (vàng cam + hiệu ứng ping)
  - Quỹ đạo không đều như hệ mặt trời thật: Mercury gần nhất → Neptune xa nhất
  - Khoảng cách realistic: từ 80px (Mercury) đến 320px (Neptune)
  - Kích thước hành tinh đúng tỷ lệ: Jupiter lớn nhất (24px), Mercury nhỏ nhất (6px)
  - Màu sắc chính xác:
    * Mercury: xám bạc
    * Venus: vàng nhạt + quay ngược
    * Earth: xanh lam + xanh lục với đám mây
    * Mars: đỏ
    * Jupiter: nâu vàng với dải sọc
    * Saturn: vàng với 3 vành đai
    * Uranus: xanh nhạt
    * Neptune: xanh đậm + mờ hơn
  - Tốc độ quay realistic: Mercury nhanh nhất (2s) → Neptune chậm nhất (20s)
  - Thêm hiệu ứng không gian với các vòng sáng ping

## 2025-01-16: Fixed Solar System Accuracy
- **Thay đổi**: Sửa lại SolarSystemSpinner theo đúng thứ tự và tỷ lệ hành tinh thật
- **Files**: src/components/quiz/components/SolarSystemSpinner.tsx
- **Chi tiết**:
  - Đúng thứ tự 8 hành tinh: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
  - Tốc độ quay tương ứng với chu kỳ quỹ đạo thực tế (Mercury nhanh nhất, Neptune chậm nhất)
  - Kích thước hành tinh tương ứng với thực tế (Jupiter lớn nhất)
  - Màu sắc đúng với đặc điểm từng hành tinh
  - Saturn có vành đai đặc trưng
  - Mặt trời màu vàng cam thay vì gradient xanh
  - Vị trí planet đúng trên quỹ đạo (top positioning thay vì transform phức tạp)

## Previous Decisions
- GameLoading component với SolarSystemSpinner
- LoadingStepIndicator cho progress tracking
- Floating elements cho visual effects
- Fun facts rotation system
