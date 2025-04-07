
/**
 * Generates instructions for handling images in games
 * @returns string with detailed image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Chỉ dẫn đặc biệt cho trò chơi có hình ảnh
    
    - QUAN TRỌNG: Nếu trò chơi cần hình ảnh, hãy sử dụng hình ảnh từ bất kỳ nguồn nào, nhưng phải đảm bảo hiển thị được:
      - Các nguồn ảnh online bất kỳ có thể sử dụng
      - Có thể sử dụng URL từ bất kỳ nguồn nào miễn là ảnh tồn tại và có thể truy cập được
      - Ghi rõ URL ảnh để hiển thị trực tiếp
      - Nếu sử dụng hình ảnh từ API, hãy đảm bảo URL là cố định và không thay đổi
    
    - Đối với trò chơi đoán hình, hãy sử dụng hình ảnh thay vì văn bản
      - Cung cấp hình ảnh liên quan đến từ cần đoán
      - Đảm bảo hình ảnh hiển thị rõ ràng đủ để người dùng có thể đoán
      - Có thể sử dụng nhiều hình ảnh cho một từ để gợi ý rõ hơn

    - LUÔN cung cấp URL trực tiếp tới hình ảnh (không phải URL tới trang web chứa hình ảnh)
    - LUÔN đảm bảo URL hình ảnh có thể truy cập trực tiếp và hiển thị được
    - LUÔN cung cấp văn bản thay thế (alt text) cho hình ảnh để đảm bảo trò chơi vẫn hoạt động nếu ảnh không tải được
    
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
