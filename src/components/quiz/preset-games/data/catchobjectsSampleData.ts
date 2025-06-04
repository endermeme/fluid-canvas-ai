
export const catchObjectsSampleData = {
  title: "Catch the Objects Quiz - Bắt vật thể đố vui",
  description: "Bắt các vật thể có đáp án đúng rơi từ trên cao",
  questions: [
    {
      id: 1,
      question: "Bắt các loại trái cây:",
      correctObjects: ["🍎", "🍌", "🍊", "🍇"],
      wrongObjects: ["🥕", "🥔", "🧅", "🌽"],
      category: "trái cây"
    },
    {
      id: 2,
      question: "Bắt các con số chẵn:",
      correctObjects: ["2", "4", "6", "8"],
      wrongObjects: ["1", "3", "5", "7"],
      category: "số chẵn"
    },
    {
      id: 3,
      question: "Bắt các phương tiện giao thông:",
      correctObjects: ["🚗", "✈️", "🚲", "🚌"],
      wrongObjects: ["🏠", "🌳", "📚", "⚽"],
      category: "phương tiện"
    },
    {
      id: 4,
      question: "Bắt các con vật:",
      correctObjects: ["🐶", "🐱", "🐭", "🐰"],
      wrongObjects: ["🌺", "🎵", "📱", "⚽"],
      category: "động vật"
    },
    {
      id: 5,
      question: "Bắt các màu xanh:",
      correctObjects: ["🟢", "💚", "🥒", "🥬"],
      wrongObjects: ["🔴", "🟡", "🟠", "🟣"],
      category: "màu xanh"
    },
    {
      id: 6,
      question: "Bắt các nhạc cụ:",
      correctObjects: ["🎸", "🎹", "🥁", "🎺"],
      wrongObjects: ["📚", "⚽", "🍎", "🚗"],
      category: "nhạc cụ"
    }
  ],
  settings: {
    gameTime: 90,
    objectSpeed: 2,
    spawnRate: 1.5,
    pointsPerCorrect: 10,
    pointsPerWrong: -5,
    basketSize: 80,
    objectSize: 40
  }
};

export default catchObjectsSampleData;
