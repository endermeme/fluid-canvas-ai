
export const stackBuilderSampleData = {
  title: "Stack Builder Quiz - Xếp khối đố vui",
  description: "Kéo thả các khối theo thứ tự đúng để hoàn thành sequence",
  sequences: [
    {
      id: 1,
      question: "Sắp xếp các số theo thứ tự tăng dần:",
      blocks: [
        { id: "b1", content: "1", correctPosition: 0, color: "#FF6B6B" },
        { id: "b2", content: "3", correctPosition: 2, color: "#4ECDC4" },
        { id: "b3", content: "2", correctPosition: 1, color: "#45B7D1" },
        { id: "b4", content: "4", correctPosition: 3, color: "#96CEB4" }
      ],
      explanation: "Thứ tự đúng là: 1, 2, 3, 4"
    },
    {
      id: 2,
      question: "Sắp xếp các bước làm bánh theo thứ tự:",
      blocks: [
        { id: "b5", content: "Nướng", correctPosition: 2, color: "#FECA57" },
        { id: "b6", content: "Chuẩn bị nguyên liệu", correctPosition: 0, color: "#FF9FF3" },
        { id: "b7", content: "Ăn", correctPosition: 3, color: "#54A0FF" },
        { id: "b8", content: "Trộn bột", correctPosition: 1, color: "#5F27CD" }
      ],
      explanation: "Thứ tự đúng: Chuẩn bị → Trộn bột → Nướng → Ăn"
    },
    {
      id: 3,
      question: "Sắp xếp các hành tinh theo khoảng cách từ Mặt Trời:",
      blocks: [
        { id: "b9", content: "Mars", correctPosition: 3, color: "#FF6B6B" },
        { id: "b10", content: "Mercury", correctPosition: 0, color: "#4ECDC4" },
        { id: "b11", content: "Earth", correctPosition: 2, color: "#45B7D1" },
        { id: "b12", content: "Venus", correctPosition: 1, color: "#96CEB4" }
      ],
      explanation: "Thứ tự từ gần đến xa: Mercury → Venus → Earth → Mars"
    },
    {
      id: 4,
      question: "Sắp xếp các từ để tạo thành câu có nghĩa:",
      blocks: [
        { id: "b13", content: "học", correctPosition: 1, color: "#FECA57" },
        { id: "b14", content: "Tôi", correctPosition: 0, color: "#FF9FF3" },
        { id: "b15", content: "tiếng Anh", correctPosition: 2, color: "#54A0FF" },
        { id: "b16", content: "hàng ngày", correctPosition: 3, color: "#5F27CD" }
      ],
      explanation: "Câu đúng: Tôi học tiếng Anh hàng ngày"
    },
    {
      id: 5,
      question: "Sắp xếp các bước giải phương trình:",
      blocks: [
        { id: "b17", content: "Kiểm tra", correctPosition: 3, color: "#FF6B6B" },
        { id: "b18", content: "Đọc đề", correctPosition: 0, color: "#4ECDC4" },
        { id: "b19", content: "Tính toán", correctPosition: 2, color: "#45B7D1" },
        { id: "b20", content: "Lập phương trình", correctPosition: 1, color: "#96CEB4" }
      ],
      explanation: "Quy trình: Đọc đề → Lập phương trình → Tính toán → Kiểm tra"
    }
  ],
  settings: {
    timePerSequence: 30,
    totalTime: 300,
    pointsPerCorrect: 20,
    allowHints: true,
    showExplanation: true
  }
};

export default stackBuilderSampleData;
