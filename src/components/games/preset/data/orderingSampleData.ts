
export const orderingSampleData = {
  title: "Sắp xếp câu",
  description: "Sắp xếp các từ để tạo thành câu hoàn chỉnh",
  sentences: [
    {
      words: ["Tôi", "học", "tiếng", "Việt", "mỗi", "ngày"],
      correctOrder: [0, 1, 2, 3, 4, 5]
    },
    {
      words: ["Hà Nội", "là", "thủ đô", "của", "Việt Nam"],
      correctOrder: [0, 1, 2, 3, 4]
    },
    {
      words: ["Chúng tôi", "đi", "chơi", "công viên", "vào", "cuối tuần"],
      correctOrder: [0, 1, 2, 3, 4, 5]
    },
    {
      words: ["Món ăn", "này", "rất", "ngon", "và", "bổ dưỡng"],
      correctOrder: [0, 1, 2, 3, 4, 5]
    },
    {
      words: ["Em", "thích", "đọc", "sách", "vào", "buổi tối"],
      correctOrder: [0, 1, 2, 3, 4, 5]
    }
  ],
  settings: {
    timeLimit: 180,
    showHints: true,
    difficulty: "medium"
  }
};
