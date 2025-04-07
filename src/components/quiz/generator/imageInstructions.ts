
/**
 * Generates instructions for handling images in games
 * @returns string with detailed image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Chỉ dẫn đặc biệt cho trò chơi có hình ảnh
    
    - YÊU CẦU NGHIÊM NGẶT: Đối với trò chơi Đoán từ qua hình, PHẢI SỬ DỤNG HÌNH ẢNH THỰC TẾ (không phải văn bản)
      - Sử dụng hình ảnh từ bất kỳ nguồn nào, miễn là hiển thị được và liên quan đến từ cần đoán
      - Các nguồn ảnh online bất kỳ có thể sử dụng: Google Images, Flickr, Unsplash, Wikipedia, v.v.
      - LUÔN cung cấp URL trực tiếp tới ảnh (không phải URL tới trang web chứa ảnh)
      - Đảm bảo URL ảnh có thể truy cập trực tiếp và hiển thị được (thường có đuôi .jpg, .png, .gif, .webp)
      - Không giới hạn số lượng hình ảnh cho mỗi từ cần đoán
    
    - Đối với trò chơi Đoán từ qua hình:
      - PHẢI cung cấp 1-3 hình ảnh khác nhau cho mỗi từ cần đoán
      - Các hình ảnh phải đủ rõ ràng để người dùng có thể đoán từ, nhưng vẫn mang tính thử thách
      - Có thể sử dụng hình ảnh ẩn một phần hoặc góc độ khác nhau của cùng một vật thể
      - Thêm gợi ý từng bước nếu người dùng gặp khó khăn

    - CẢNH BÁO QUAN TRỌNG:
      - KHÔNG sử dụng mô tả văn bản thay thế cho hình ảnh thực tế
      - KHÔNG sử dụng URL giả, URL không tồn tại hoặc không hiển thị được
      - KHÔNG tạo trò chơi đoán từ qua hình mà không có hình ảnh
    
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
