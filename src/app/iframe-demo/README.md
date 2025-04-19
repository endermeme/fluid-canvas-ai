# Iframe Demo Preview Component

## Giới thiệu

Component này cung cấp khả năng hiển thị và xem trước các file HTML demo trong một iframe. Nó đặc biệt hữu ích cho việc kiểm tra các demo tương tác mà không cần phải mở file riêng biệt hoặc triển khai demo lên server khác.

## Tính năng

- Tải nội dung HTML từ API endpoint
- Xử lý và nâng cao nội dung HTML với các style và script bổ sung
- Hiển thị nội dung trong iframe với sandbox an toàn
- Xử lý trạng thái loading và error
- Nút để tải lại nội dung
- Giao diện người dùng thân thiện và hiện đại

## Thành phần

1. **Page Component** (`page.tsx`): Component hiển thị chính
2. **Layout** (`layout.tsx`): Layout đặc biệt cho trang iframe-demo
3. **API Endpoint** (`/api/get-iframe-demo/route.ts`): Cung cấp nội dung HTML
4. **Utility Function** (`/utils/iframe-utils.ts`): Xử lý và nâng cao nội dung HTML
5. **HTML Demo** (`/components/quiz/demo/iframe-test.html`): File HTML demo mẫu

## Cách sử dụng

1. Truy cập vào đường dẫn `/iframe-demo` để xem demo mẫu
2. Nhấn nút "Tải lại nội dung" để làm mới iframe
3. Để thay đổi nội dung demo, chỉnh sửa file `iframe-test.html`

## Cách thêm demo mới

1. Tạo file HTML mới trong thư mục `/components/quiz/demo/`
2. Cập nhật API endpoint trong file `/api/get-iframe-demo/route.ts` để trỏ đến file mới
3. (Tùy chọn) Điều chỉnh utility function nếu cần thêm style hoặc script đặc biệt

## Hạn chế

- Iframe có giới hạn về bảo mật, một số tính năng có thể không hoạt động đúng như khi mở file trực tiếp
- Sandbox của iframe giới hạn một số tương tác để đảm bảo an toàn
- Một số API trình duyệt có thể không hoạt động trong iframe

## Lưu ý bảo mật

- Iframe luôn được cấu hình với sandbox để ngăn chặn các script tiềm ẩn độc hại
- Nội dung HTML được tải từ server của bạn, không từ bên thứ ba
- Cẩn thận khi cho phép các script từ demo HTML chạy trong iframe