
/**
 * Instructions for image handling in games
 * @returns string with detailed image handling instructions
 */
export const getImageInstructions = (): string => {
  return `
    ## Hình ảnh
    - LUÔN sử dụng Pixabay API với định dạng: https://pixabay.com/api/?key=49691613-4d92ecd39a474575561ea2695&q=[search_term]&image_type=photo
    - Thay thế [search_term] bằng từ khóa tìm kiếm chi tiết liên quan đến nội dung
    - Sử dụng từ khóa tìm kiếm bằng tiếng Anh để có kết quả tốt nhất
    - Từ khóa nên chi tiết, ví dụ: "strawberry fruit fresh" thay vì chỉ "strawberry"
    - Sử dụng trường "webformatURL" từ kết quả API để lấy URL hình ảnh
    - Luôn thêm alt text và onerror cho các thẻ <img>
    - KHÔNG sử dụng nguồn hình ảnh khác như Unsplash, imgur, v.v.
  `;
};

/**
 * Chuyển một đề tài thành mô tả hình ảnh
 * @param topic Chủ đề cần mô tả
 * @returns Mô tả hình ảnh
 */
export const topicToImageDescription = (topic: string): string => {
  return `Một hình ảnh minh họa cho ${topic}`;
};

/**
 * Tạo URL Pixabay để tìm kiếm hình ảnh
 * @param keyword Từ khóa tìm kiếm
 * @param safeSearch Tìm kiếm hình ảnh an toàn cho mọi lứa tuổi 
 * @returns URL tìm kiếm hình ảnh từ Pixabay
 */
export const generatePixabaySearchUrl = (keyword: string, safeSearch: boolean = true): string => {
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://pixabay.com/api/?key=49691613-4d92ecd39a474575561ea2695&q=${encodedKeyword}&image_type=photo&safesearch=${safeSearch}`;
};

/**
 * Tạo URL hình ảnh trực tiếp từ response của Pixabay
 * @param searchTerm Từ khóa tìm kiếm
 * @returns URL hình ảnh
 */
export const generatePixabayImage = async (searchTerm: string): Promise<string> => {
  try {
    const response = await fetch(generatePixabaySearchUrl(searchTerm));
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Lấy URL ảnh từ kết quả đầu tiên
      return data.hits[0].webformatURL;
    }
    
    // Nếu không tìm thấy ảnh, trả về URL placeholder
    return generatePlaceholderImage(400, 300, searchTerm);
  } catch (error) {
    console.error("Không thể lấy hình ảnh từ Pixabay:", error);
    return generatePlaceholderImage(400, 300, searchTerm);
  }
};

/**
 * Tạo URL placeholder cho hình ảnh
 * @param width Chiều rộng hình ảnh
 * @param height Chiều cao hình ảnh
 * @param text Văn bản hiển thị trên hình ảnh
 * @returns URL hình ảnh placeholder
 */
export const generatePlaceholderImage = (width: number = 400, height: number = 300, text: string = "Image"): string => {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/${width}x${height}?text=${encodedText}`;
};

/**
 * Xử lý lỗi tải hình ảnh
 * @param event Sự kiện lỗi
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  const img = event.currentTarget;
  const topic = img.alt || "image";
  img.src = generatePlaceholderImage(400, 300, `${topic} - Not Found`);
  img.alt = `Failed to load image: ${topic}`;
};
