
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

  // Đơn giản hóa prompt để trả về mã HTML nguyên bản không cần xử lý phức tạp
  const basePrompt = `
Tạo một trò chơi HTML đơn giản theo chủ đề: "${topic}"

**YÊU CẦU QUAN TRỌNG:**
- Trò chơi phải có thể chơi ngay mà không cần thiết lập phức tạp
- Hỗ trợ đầy đủ cho cả màn hình cảm ứng và chuột
- Phải hoạt động hoàn hảo trên cả thiết bị di động và máy tính
- Giao diện người dùng phải đơn giản, trực quan và đẹp mắt
- Tập trung vào cơ chế chơi game cốt lõi
- TỐI ƯU HÓA TỐC ĐỘ TẢI (rất quan trọng)
- Giữ kích thước mã nhỏ gọn và hiệu quả
- Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'}
- Độ khó: ${difficulty}
- Thể loại: ${category}

**TƯƠNG THÍCH ĐA THIẾT BỊ:**
1. Hỗ trợ màn hình cảm ứng:
   - Tất cả phần tử tương tác PHẢI hoạt động với sự kiện cảm ứng
   - Có kích thước chạm phù hợp (tối thiểu 44px vuông)
   - Phản hồi trực quan rõ ràng khi tương tác
   - Ngăn chặn zoom và cuộn không mong muốn trong khi chơi

2. Hỗ trợ chuột:
   - Tất cả tương tác cũng phải hoạt động hoàn hảo với sự kiện chuột
   - Hành vi nhất quán trên các thiết bị

**THIẾT KẾ RESPONSIVE:**
- Sử dụng đơn vị tương đối (vw, vh) cho kích thước
- Tự động phát hiện khả năng của thiết bị và điều chỉnh giao diện phù hợp
- Bố cục thích ứng với cả hướng dọc và ngang

**TỐI ƯU HÓA HIỆU SUẤT:**
- Giảm thiểu số lượng phần tử DOM và tối ưu hóa hiển thị
- Sử dụng requestAnimationFrame thay vì setInterval
- Giảm độ phức tạp của logic trò chơi
- Giữ kích thước tài nguyên ở mức tối thiểu

**ĐỊNH DẠNG MÃ TRÒ CHƠI:**
- Trả về tệp HTML hoàn chỉnh với tất cả CSS/JS đã bao gồm
- KHÔNG CÓ PHỤ THUỘC BÊN NGOÀI hoặc liên kết CDN
- Trả về mã chính xác như nó sẽ chạy, có đúng cách thụt lề và cấu trúc
- KHÔNG sửa đổi hoặc làm sạch mã - trả về chính xác như vậy
- KHÔNG bao gồm cú pháp khối mã markdown (\`\`\`) trong phản hồi của bạn
- Bao gồm DOCTYPE và cấu trúc HTML chính xác

**CẤU TRÚC TRÒ CHƠI:**
1. Tiêu đề trò chơi rõ ràng và hướng dẫn đơn giản
2. Nút bắt đầu ngay lập tức
3. Khu vực chơi game cốt lõi với hỗ trợ cảm ứng/chuột
4. Hiển thị điểm số/tiến trình cơ bản
5. Tùy chọn khởi động lại nhanh chóng
6. Điều khiển phù hợp với thiết bị
7. Bố cục đáp ứng cho tất cả kích thước màn hình

Tập trung vào việc làm cho trò chơi có thể chơi ngay lập tức, thú vị và hoạt động đầy đủ trên BẤT KỲ thiết bị nào!
`;

  return basePrompt;
};
