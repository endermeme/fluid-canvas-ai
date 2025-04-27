
# Lịch sử thay đổi mã nguồn

## 27/04/2024 - Cải thiện cách xử lý game HTML/CSS/JS và tích hợp Supabase
- Thay đổi cách xử lý mã HTML/CSS/JS khi tải game trong iframe
- Tách riêng xử lý HTML, CSS và JS thành các phần riêng biệt
- Sửa đổi cơ chế lưu trữ Supabase để đơn giản hơn
- Cải thiện các thông báo console.log để dễ theo dõi hơn

## 27/04/2024 - Sửa lỗi TypeScript trong GameController
- Đã sửa lỗi trong handleShareGame() để trả về Promise<string> thay vì Promise<void>
- Sửa lỗi: error TS2322: Type '() => Promise<void>' không thể gán cho '() => void | Promise<string>'
- Thêm giá trị trả về chuỗi rỗng để tương thích với kiểu trả về yêu cầu

## 25/04/2024 - Cập nhật cấu hình Vite để cho phép tất cả host
- Đã thêm các tên miền vào `allowedHosts` trong `vite.config.ts`: aurabusiness.tech, aurabusiness.tech:8080
