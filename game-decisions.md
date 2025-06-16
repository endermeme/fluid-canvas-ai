
# Game Development Decisions

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
