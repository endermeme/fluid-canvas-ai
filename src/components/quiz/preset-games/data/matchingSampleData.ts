
export const matchingSampleData = {
  title: "Nối từ - Tiếng Việt và tiếng Anh",
  description: "Nối các từ tiếng Việt với nghĩa tiếng Anh tương ứng",
  pairs: [
    {
      left: "Mèo",
      right: "Cat"
    },
    {
      left: "Chó",
      right: "Dog"
    },
    {
      left: "Gà",
      right: "Chicken"
    },
    {
      left: "Vịt",
      right: "Duck"
    },
    {
      left: "Bò",
      right: "Cow"
    },
    {
      left: "Ngựa",
      right: "Horse"
    },
    {
      left: "Lợn",
      right: "Pig"
    },
    {
      left: "Chuột",
      right: "Mouse"
    }
  ],
  settings: {
    timeLimit: 60,
    shuffleItems: true,
    difficulty: "medium", // easy, medium, hard
    maxCharLength: 20,    // Maximum characters per item to prevent wrapping
    gridSize: {           // Responsive grid size based on difficulty
      rows: 4,
      columns: 2
    },
    spacing: "medium",    // Spacing between items: small, medium, large
    scoreSystem: {        // Points system
      correct: 10,
      incorrect: -2,
      timeBonus: true
    },
    layout: "horizontal"  // horizontal, vertical, or grid
  }
};
