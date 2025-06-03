
export const balloonPopSampleData = {
  title: "Balloon Pop Quiz - Kiến thức tổng hợp",
  description: "Nổ bóng bay để khám phá câu hỏi thú vị bên trong",
  balloons: [
    {
      id: 1,
      question: "Thủ đô của Việt Nam là gì?",
      options: ["Hà Nội", "Thành phố Hồ Chí Minh", "Đà Nẵng", "Huế"],
      correctAnswer: 0,
      color: "red",
      explanation: "Hà Nội là thủ đô của Việt Nam từ năm 1010."
    },
    {
      id: 2,
      question: "Con sông dài nhất Việt Nam là gì?",
      options: ["Sông Hồng", "Sông Mekong", "Sông Đà", "Sông Cửu Long"],
      correctAnswer: 2,
      color: "blue",
      explanation: "Sông Đà là con sông dài nhất chảy qua lãnh thổ Việt Nam."
    },
    {
      id: 3,
      question: "Việt Nam có bao nhiêu tỉnh thành?",
      options: ["62", "63", "64", "65"],
      correctAnswer: 1,
      color: "green",
      explanation: "Việt Nam có 63 tỉnh thành, bao gồm 58 tỉnh và 5 thành phố trực thuộc trung ương."
    },
    {
      id: 4,
      question: "Món ăn nào được coi là đặc sản Việt Nam?",
      options: ["Sushi", "Phở", "Pizza", "Hamburger"],
      correctAnswer: 1,
      color: "yellow",
      explanation: "Phở là món ăn truyền thống và nổi tiếng nhất của Việt Nam."
    },
    {
      id: 5,
      question: "Lễ hội lớn nhất trong năm của người Việt là gì?",
      options: ["Tết Trung Thu", "Tết Nguyên Đán", "Tết Đoan Ngọ", "Tết Hàn Thực"],
      correctAnswer: 1,
      color: "purple",
      explanation: "Tết Nguyên Đán (Tết Âm lịch) là lễ hội lớn nhất và quan trọng nhất của người Việt."
    },
    {
      id: 6,
      question: "Di sản thế giới nào của Việt Nam được UNESCO công nhận đầu tiên?",
      options: ["Vịnh Hạ Long", "Phố cổ Hội An", "Thánh địa Mỹ Sơn", "Hoàng thành Thăng Long"],
      correctAnswer: 0,
      color: "orange",
      explanation: "Vịnh Hạ Long được UNESCO công nhận là di sản thiên nhiên thế giới vào năm 1994."
    },
    {
      id: 7,
      question: "Quốc hoa của Việt Nam là gì?",
      options: ["Hoa hồng", "Hoa sen", "Hoa đào", "Hoa mai"],
      correctAnswer: 1,
      color: "pink",
      explanation: "Hoa sen được chọn làm quốc hoa của Việt Nam vì ý nghĩa thuần khiết, thanh cao."
    },
    {
      id: 8,
      question: "Ai là tác giả của bài thơ 'Truyện Kiều'?",
      options: ["Nguyễn Trãi", "Nguyễn Du", "Hồ Xuân Hương", "Nguyễn Khuyến"],
      correctAnswer: 1,
      color: "cyan",
      explanation: "Nguyễn Du là tác giả của tác phẩm 'Truyện Kiều' - kiệt tác văn học Việt Nam."
    }
  ],
  settings: {
    timePerQuestion: 20,
    totalTime: 300,
    allowSkip: true,
    showExplanation: true,
    balloonPopAnimation: true
  }
};

export default balloonPopSampleData;
