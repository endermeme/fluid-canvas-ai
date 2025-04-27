
# Các thay đổi

## 2025-04-27
- Tạo mới `src/components/quiz/utils/iframe-html.ts`: Xử lý phần HTML trong iframe
- Tạo mới `src/components/quiz/utils/iframe-css.ts`: Xử lý phần CSS trong iframe 
- Tạo mới `src/components/quiz/utils/iframe-js.ts`: Xử lý phần JavaScript trong iframe
- Cập nhật `src/components/quiz/utils/iframe-utils.ts`: Tích hợp 3 phần HTML, CSS, JS
- Cập nhật `src/components/quiz/generator/customGamePrompt.ts`: Cải thiện prompt cho định dạng 3 phần riêng biệt
- Cập nhật `src/components/quiz/custom-games/GameController.tsx`: Mở lại tính năng tạo game tùy chỉnh
- Tạo mới `src/components/quiz/types/customGame.ts`: Thêm kiểu dữ liệu cho game tùy chỉnh
- Cập nhật `src/components/quiz/components/GameContainer.tsx`: Sửa lỗi kiểu dữ liệu CustomGameResponse
- Cập nhật `src/components/quiz/custom-games/GameController.tsx`: Thêm logs cho debug và sửa lỗi gửi yêu cầu

## 2025-04-28
- Cập nhật `src/components/quiz/utils/iframe-css.ts`: Tối ưu hóa CSS cho hiển thị văn bản trong game
- Cập nhật `src/components/quiz/generator/customGamePrompt.ts`: Cải thiện hướng dẫn tạo game hiển thị văn bản đúng

## 2025-04-29
- Cập nhật `src/components/quiz/utils/iframe-css.ts`: Sửa lỗi vị trí hiển thị văn bản trong các game vòng quay
- Cập nhật `src/components/quiz/utils/iframe-js.ts`: Sửa lỗi logic xác định phần thưởng trong game vòng quay
- Bổ sung hàm `determineWheelResult` để đảm bảo xác định chính xác phần thưởng trong vòng quay

## 2025-04-30
- Cập nhật `src/components/quiz/utils/iframe-css.ts`: Cải thiện CSS cho việc hiển thị văn bản trong các segment của vòng quay
- Cập nhật `src/components/quiz/utils/iframe-js.ts`: Thêm hàm `positionWheelTexts` để định vị text trong các segment vòng quay
- Cập nhật `src/components/quiz/generator/customGamePrompt.ts`: Bổ sung hướng dẫn chi tiết hơn cho việc tạo game vòng quay

## 2025-05-01
- Cập nhật `src/components/quiz/generator/customGamePrompt.ts`: Viết hướng dẫn chi tiết hơn cho việc tạo game vòng quay
- Cập nhật `src/components/quiz/utils/iframe-css.ts`: Viết lại hoàn toàn CSS cho game vòng quay
- Cập nhật `src/components/quiz/utils/iframe-js.ts`: Thêm các hàm hỗ trợ mới cho game vòng quay với logic cải tiến

## 2025-05-02
- Tái cấu trúc `src/components/quiz/utils/iframe-js.ts`: Tách thành các file nhỏ hơn để dễ quản lý
- Tạo mới `src/components/quiz/utils/game-helpers/wheel-helpers.ts`: Chứa các hàm hỗ trợ cho game vòng quay
- Tạo mới `src/components/quiz/utils/game-helpers/general-helpers.ts`: Chứa các hàm hỗ trợ chung cho tất cả các game
- Sửa lỗi tính toán kết quả trong game vòng quay và cải thiện hiển thị văn bản

## 2025-05-03
- Refactored CSS into separate modules for better organization:
  - Created `src/components/quiz/utils/styles/base-styles.ts`: Base styles for all games
  - Created `src/components/quiz/utils/styles/wheel-styles.ts`: Wheel game specific styles
  - Created `src/components/quiz/utils/styles/text-styles.ts`: Common text styles
  - Created `src/components/quiz/utils/styles/card-styles.ts`: Card game specific styles
- Fixed TypeScript errors in helpers:
  - Updated `general-helpers.ts` to properly type check HTML elements
  - Updated `wheel-helpers.ts` to properly type check SVG elements
- Simplified main `iframe-css.ts` to use modular style imports

## 2025-05-04
- Sửa lỗi JavaScript không hoạt động trong game:
  - Cập nhật `iframe-js.ts` để cải thiện cách tích hợp mã JavaScript
  - Cập nhật `iframe-utils.ts` để đảm bảo script chạy sau khi DOM đã tải
  - Thêm xử lý lỗi cho script để tránh treo trò chơi
  - Đảm bảo các trình trợ giúp đúng cách

## 2025-05-05
- Sửa triệt để lỗi JavaScript không hoạt động trong iframe:
  - Cập nhật `iframe-js.ts` để luôn bao gồm trình trợ giúp ở đầu script
  - Cập nhật `iframe-utils.ts` để thực thi JavaScript trực tiếp không qua DOMContentLoaded
  - Thêm xử lý lỗi chi tiết hơn để hiển thị lỗi game trong iframe
  - Tích hợp thêm console.log trong iframe để dễ debug hơn
