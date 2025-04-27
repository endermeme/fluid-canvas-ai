
export interface GamePromptOptions {
  topic: string;
  useCanvas?: boolean;
  language?: string;
  difficulty?: string;
  category?: string;
}

export const generateCustomGamePrompt = (options: GamePromptOptions): string => {
  const { 
    topic, 
    language = 'en',
    difficulty = 'medium',
    category = 'general'
  } = options;

  // Cải thiện prompt để trả về HTML, CSS và JS rõ ràng hơn
  const basePrompt = `
Tạo một trò chơi HTML tương tác đơn giản theo chủ đề: "${topic}"

**YÊU CẦU PHÂN CHIA MÃ NGUỒN:**
- Tạo mã HTML cơ bản, CSS riêng biệt và JavaScript riêng biệt
- KHÔNG mã hóa, KHÔNG minify - trả về mã nguồn dễ đọc
- TỐI ƯU HÓA TỐC ĐỘ TẢI (QUAN TRỌNG NHẤT)

**THIẾT KẾ RESPONSIVE:**
- Sử dụng đơn vị tương đối (%, vw, vh) cho kích thước
- Hỗ trợ đầy đủ cho cả màn hình cảm ứng và điều khiển bằng chuột
- Bố cục thích ứng với cả hướng dọc và ngang

**TƯƠNG THÍCH ĐA NỀN TẢNG:**
- Đảm bảo trải nghiệm nhất quán trên điện thoại, máy tính bảng và máy tính
- Tất cả phần tử tương tác PHẢI đủ lớn cho cảm ứng (tối thiểu 44px)
- Ngăn chặn zoom và cuộn không mong muốn trong khi chơi
- Xử lý sự kiện touch và sự kiện chuột một cách nhất quán

**TỐI ƯU HÓA HIỆU SUẤT:**
- Giảm thiểu số lượng DOM và hoạt ảnh phức tạp
- Sử dụng requestAnimationFrame thay vì setInterval
- Tránh tạo quá nhiều sự kiện hay listener

**YÊU CẦU ĐẦU RA:**
- Tạo file HTML hoàn chỉnh với CSS trong thẻ <style> và JS trong thẻ <script>
- BẮT BUỘC trả về định dạng đầy đủ: <!DOCTYPE html><html>...</html>
- KHÔNG sử dụng thư viện hoặc tài nguyên bên ngoài
- Luôn thêm meta viewport cho thiết bị di động
- Tiêu đề <title> và <h1> phù hợp với chủ đề

**CẤU TRÚC GAME:**
- Tiêu đề rõ ràng và hướng dẫn ngắn gọn
- Vùng chơi game chính đáp ứng điều khiển cảm ứng/chuột
- Hiển thị điểm số hoặc tiến trình trực quan
- Khả năng bắt đầu lại nhanh chóng
- Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}
- Độ khó: ${difficulty}

TẬP TRUNG CHÍNH VÀO TỐC ĐỘ TẢI, ĐƠN GIẢN, VÀ TRẢI NGHIỆM NGƯỜI DÙNG MƯỢT MÀ!
`;

  return basePrompt;
};
