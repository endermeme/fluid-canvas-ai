
/**
 * Generates instructions for handling images in games
 * @returns string with detailed image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Chỉ dẫn đặc biệt cho trò chơi có hình ảnh
    
    - QUAN TRỌNG: Nếu trò chơi cần hình ảnh, hãy sử dụng một trong các cách sau để cung cấp hình ảnh:
      1. Sử dụng URL hình ảnh cố định từ Wikipedia: 'https://upload.wikimedia.org/wikipedia/commons/thumb/[...].jpg'
         Ví dụ: https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_processing_1.png/300px-Image_processing_1.png
      2. Sử dụng URL hình ảnh từ Pixabay:
         'https://pixabay.com/get/[image_id].jpg'
         Ví dụ: https://pixabay.com/get/g195c7ac0b32fb8ca4ccc9acbe03fcc38a2f064fd2ef9f0e4dd5c8f5b96a0c55c0a21c5c43429d0dcce92b26dda0aea13_1280.jpg
      3. Sử dụng URL hình ảnh từ Google Images cache
         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS[...]'
         Ví dụ: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC-qbvZ0MJEhAbgDZqf9KQgWNYJKrNLeFa4q5W8ZK6yQ&s
      4. Sử dụng URL hình ảnh từ placeholder.com: 'https://via.placeholder.com/[width]x[height].png?text=[text]'
         Ví dụ: https://via.placeholder.com/300x200.png?text=Forest
      5. Sử dụng URL ảnh từ dummyimage.com: 'https://dummyimage.com/[width]x[height]/[color]/[textcolor]&text=[text]'
         Ví dụ: https://dummyimage.com/300x200/7EC0EE/333333&text=Ocean
      6. Sử dụng inline SVG trực tiếp trong HTML khi cần đồ họa đơn giản
         Ví dụ: <svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="red" /></svg>
      7. Sử dụng base64 cho ảnh nhỏ (tối đa 3-5 ảnh nhỏ)
         Ví dụ: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." />
      8. Tạo hình ảnh ASCII/Unicode art khi các phương pháp trên không khả dụng

    - TUYỆT ĐỐI KHÔNG SỬ DỤNG URL từ source.unsplash.com vì chúng không ổn định
    - TUYỆT ĐỐI KHÔNG SỬ DỤNG URL từ loremflickr.com vì chúng không ổn định
    - Khi sử dụng hình ảnh từ Wikipedia, sử dụng đường dẫn trực tiếp tới file ảnh, không dùng URL tới bài viết
    - Đối với ảnh từ Pixabay, chỉ sử dụng URL có dạng https://pixabay.com/get/[...]
    - Khi sử dụng ảnh từ Google, chỉ dùng URL có dạng https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS[...]
    - Đối với trò chơi ghép thẻ hình ảnh (memory card), sử dụng 4-8 hình ảnh khác nhau với URL chắc chắn hoạt động
    - Luôn cung cấp text thay thế cho ảnh (alt text) để đảm bảo trò chơi vẫn hoạt động nếu ảnh không tải được
    - Khi một URL ảnh không khả dụng, hiển thị một hình ảnh phù hợp tạo bằng SVG hoặc base64
    - Luôn có một backup plan nếu tất cả các hình ảnh không tải được (ví dụ: chuyển sang chế độ văn bản)

    ## Xử lý hình ảnh đúng cách trong JavaScript
    - Thêm event handler onerror cho mọi thẻ <img>:
      <img src="URL" alt="Mô tả" onerror="this.onerror=null; this.src='URL_DỰ_PHÒNG'; this.alt='Không thể tải hình';">
    - Thử tải hình ảnh trước khi sử dụng:
      function preloadImage(url, successCallback, errorCallback) {
        const img = new Image();
        img.onload = successCallback;
        img.onerror = errorCallback;
        img.src = url;
      }
    - Chuẩn bị các URL dự phòng cho mỗi hình ảnh cần thiết
    - Tạo SVG động nếu tất cả URL dự phòng đều thất bại
  `;
};
