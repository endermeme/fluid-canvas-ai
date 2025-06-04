
const balloonpopSampleData = {
  title: "Bóng Bay Đố Vui - Kiến Thức Tổng Hợp",
  description: "Nổ bóng bay để khám phá những câu hỏi thú vị và học hỏi kiến thức mới!",
  balloons: [
    {
      id: 1,
      question: "Thủ đô của Việt Nam là gì?",
      options: ["Hà Nội", "Thành phố Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"],
      correctAnswer: 0,
      explanation: "Hà Nội là thủ đô của Việt Nam từ năm 1010 dưới thời Lý Thái Tổ."
    },
    {
      id: 2,
      question: "Hành tinh nào gần Mặt Trời nhất?",
      options: ["Sao Kim", "Sao Thủy", "Trái Đất", "Sao Hỏa"],
      correctAnswer: 1,
      explanation: "Sao Thủy là hành tinh gần Mặt Trời nhất trong hệ Mặt Trời."
    },
    {
      id: 3,
      question: "Ai là tác giả của 'Truyện Kiều'?",
      options: ["Nguyễn Du", "Hồ Xuân Hương", "Nguyễn Bỉnh Khiêm", "Cao Bá Quát"],
      correctAnswer: 0,
      explanation: "Nguyễn Du là tác giả của tác phẩm 'Truyện Kiều' - kiệt tác văn học Việt Nam."
    },
    {
      id: 4,
      question: "Cơ quan nào trong cơ thể con người bơm máu?",
      options: ["Gan", "Phổi", "Tim", "Thận"],
      correctAnswer: 2,
      explanation: "Tim là cơ quan bơm máu, đưa máu đi khắp cơ thể qua hệ tuần hoàn."
    },
    {
      id: 5,
      question: "Nguyên tố hóa học nào có ký hiệu là O?",
      options: ["Oxi", "Vàng", "Bạc", "Sắt"],
      correctAnswer: 0,
      explanation: "O là ký hiệu hóa học của Oxi (Oxygen), một nguyên tố thiết yếu cho sự sống."
    },
    {
      id: 6,
      question: "Quả Trái Đất quay quanh trục của nó trong bao lâu?",
      options: ["12 giờ", "24 giờ", "48 giờ", "1 tuần"],
      correctAnswer: 1,
      explanation: "Trái Đất quay quanh trục của nó trong 24 giờ, tạo ra ngày và đêm."
    }
  ],
  settings: {
    timePerQuestion: 15,
    totalTime: 300,
    allowSkip: false,
    showExplanation: true,
    balloonPopAnimation: true
  }
};

export default balloonpopSampleData;
