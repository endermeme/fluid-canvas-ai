
const tetrisQuizSampleData = {
  title: "Tetris Quiz - Toán học hình học",
  questions: [
    {
      question: "Tổng các góc trong tam giác bằng bao nhiêu độ?",
      options: ["90°", "180°", "270°", "360°"],
      correctAnswer: 1,
      explanation: "Tổng ba góc trong một tam giác luôn bằng 180°."
    },
    {
      question: "Hình vuông có bao nhiêu trục đối xứng?",
      options: ["2", "4", "6", "8"],
      correctAnswer: 1,
      explanation: "Hình vuông có 4 trục đối xứng: 2 đường chéo và 2 đường trung trực các cạnh."
    },
    {
      question: "Công thức tính diện tích hình tròn là gì?",
      options: ["πr", "2πr", "πr²", "2πr²"],
      correctAnswer: 2,
      explanation: "Diện tích hình tròn được tính bằng công thức πr²."
    },
    {
      question: "Trong hình thoi, các cạnh có đặc điểm gì?",
      options: ["Bằng nhau", "Vuông góc", "Song song", "Khác nhau"],
      correctAnswer: 0,
      explanation: "Hình thoi có 4 cạnh bằng nhau."
    },
    {
      question: "Đường chéo hình chữ nhật có tính chất gì?",
      options: ["Bằng nhau", "Vuông góc", "Song song", "Cắt nhau tại trung điểm"],
      correctAnswer: 0,
      explanation: "Hai đường chéo của hình chữ nhật bằng nhau và cắt nhau tại trung điểm."
    },
    {
      question: "Thể tích khối lập phương cạnh a được tính như thế nào?",
      options: ["a²", "a³", "3a", "6a²"],
      correctAnswer: 1,
      explanation: "Thể tích khối lập phương cạnh a là a³."
    },
    {
      question: "Góc nội tiếp chắn nửa đường tròn có số đo bao nhiêu?",
      options: ["45°", "60°", "90°", "120°"],
      correctAnswer: 2,
      explanation: "Góc nội tiếp chắn nửa đường tròn luôn là góc vuông (90°)."
    },
    {
      question: "Hình lục giác đều có tổng các góc trong bằng bao nhiêu?",
      options: ["540°", "720°", "900°", "1080°"],
      correctAnswer: 1,
      explanation: "Tổng các góc trong của hình lục giác là (6-2) × 180° = 720°."
    }
  ],
  settings: {
    timePerQuestion: 45,
    totalTime: 720,
    dropSpeed: 500
  }
};

export default tetrisQuizSampleData;
