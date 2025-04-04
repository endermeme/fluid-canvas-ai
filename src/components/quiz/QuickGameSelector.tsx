
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Gamepad, Settings, Puzzle, BrainCircuit, Clock4, Dices, PenTool, HeartHandshake, Lightbulb, Sparkles, Book, GraduationCap, School, Award, Globe, Image, Apple, CheckCircle, Compass, BadgePlus, Rocket, ListOrdered, Trophy, Calculator, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIGameGenerator, MiniGame } from './AIGameGenerator';
import GameLoading from './GameLoading';
import GameError from './GameError';
import GameView from './GameView';
import GameSettings from './GameSettings';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GameSettingsData, GameType } from './types';
import { animateBlockCreation } from '@/lib/animations';
import { Link, useNavigate } from 'react-router-dom';
import OpenAIKeyModal from './OpenAIKeyModal';
import { Input } from '@/components/ui/input';

const API_KEY = 'AIzaSyAvlzK-Meq-uEiTpAs4XHnWdiAmSE1kQiA';

const QuickGameSelector: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const { toast } = useToast();
  const [gameGenerator] = useState<AIGameGenerator>(new AIGameGenerator(API_KEY));
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showOpenAIKeyModal, setShowOpenAIKeyModal] = useState(false);
  const navigate = useNavigate();
  
  // Updated game types with new templates
  const gameTypes: GameType[] = [
    {
      id: "image-quiz",
      name: "Đố qua hình ảnh",
      description: "Trả lời câu hỏi dựa trên hình ảnh",
      icon: "image",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Image Quiz</title>
  <style>
    #image-quiz-game {
      text-align: center;
      padding: 20px;
    }
    #image-container img {
      max-width: 100%;
      height: auto;
    }
    #answer-buttons button {
      margin: 10px;
      padding: 10px 20px;
    }
  </style>
</head>
<body>
  <div id="image-quiz-game">
    <h1>Image Quiz</h1>
    <div id="image-container">
      <img src="image1.jpg" alt="Quiz Image" id="quiz-image">
    </div>
    <div id="question">Câu hỏi liên quan đến hình ảnh</div>
    <div id="answer-buttons">
      <!-- Các nút trả lời -->
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const questions = [
        { image: "image1.jpg", question: "Hình ảnh này thuộc về gì?", answers: ["A", "B", "C"], correct: 0 },
        // Thêm câu hỏi tùy chỉnh
      ];
      
      let current = 0;
      
      function displayQuestion() {
        const q = questions[current];
        document.getElementById('quiz-image').src = q.image;
        document.getElementById('question').textContent = q.question;
        const answerContainer = document.getElementById('answer-buttons');
        answerContainer.innerHTML = "";
        q.answers.forEach((ans, index) => {
          const btn = document.createElement('button');
          btn.textContent = ans;
          btn.addEventListener('click', function() {
            if(index === q.correct) {
              alert("Đúng rồi!");
            } else {
              alert("Sai!");
            }
          });
          answerContainer.appendChild(btn);
        });
      }
      
      displayQuestion();
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "flying-fruit",
      name: "Trái cây bay",
      description: "Chơi game bắt trái cây bay qua màn hình",
      icon: "apple",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 15,
        timePerQuestion: 5,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Trái Cây Bay</title>
  <style>
    #flying-fruit-game {
      text-align: center;
      padding: 20px;
    }
    #fruit-container {
      position: relative;
      height: 300px;
      border: 1px solid #ccc;
      overflow: hidden;
      margin: auto;
      max-width: 600px;
    }
    .fruit {
      position: absolute;
      font-size: 1.5em;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div id="flying-fruit-game">
    <h1>Trái Cây Bay</h1>
    <div id="fruit-container">
      <!-- Các trái cây sẽ được tạo bằng JS -->
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const fruits = ["🍎", "🍌", "🍇", "🍓"];
      
      function createFruit() {
        const fruitElem = document.createElement('div');
        fruitElem.className = 'fruit';
        fruitElem.textContent = fruits[Math.floor(Math.random() * fruits.length)];
        fruitElem.style.left = Math.random() * 90 + "%";
        fruitElem.style.top = "0px";
        document.getElementById('fruit-container').appendChild(fruitElem);
        
        let pos = 0;
        const interval = setInterval(() => {
          pos += 2;
          fruitElem.style.top = pos + "px";
          if(pos > 300) {
            clearInterval(interval);
            fruitElem.remove();
          }
        }, 50);
        
        fruitElem.addEventListener('click', function() {
          alert("Bạn chọn đúng!");
          fruitElem.remove();
        });
      }
      
      setInterval(createFruit, 1000);
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "true-false",
      name: "Đúng hay sai",
      description: "Trả lời đúng hay sai các phát biểu",
      icon: "check-circle",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 20,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Đúng Hay Sai</title>
  <style>
    #truefalse-game {
      text-align: center;
      padding: 20px;
    }
    #statement {
      font-size: 1.5em;
      margin: 20px 0;
    }
    button {
      padding: 10px 20px;
      margin: 5px;
    }
  </style>
</head>
<body>
  <div id="truefalse-game">
    <h1>Đúng Hay Sai</h1>
    <div id="statement">Phát biểu ở đây</div>
    <button id="true-btn">Đúng</button>
    <button id="false-btn">Sai</button>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const statements = [
        { text: "Trái đất là hình cầu.", correct: true },
        { text: "Mặt trời quay quanh trái đất.", correct: false },
        // Thêm phát biểu tùy chỉnh
      ];
      
      let current = 0;
      const statementElem = document.getElementById('statement');
      
      function displayStatement() {
        statementElem.textContent = statements[current].text;
      }
      
      document.getElementById('true-btn').addEventListener('click', function() {
        if(statements[current].correct) {
          alert("Đúng rồi!");
        } else {
          alert("Sai!");
        }
      });
      
      document.getElementById('false-btn').addEventListener('click', function() {
        if(!statements[current].correct) {
          alert("Đúng rồi!");
        } else {
          alert("Sai!");
        }
      });
      
      displayStatement();
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "maze-chase",
      name: "Rượt đuổi mê cung",
      description: "Điều khiển nhân vật qua mê cung",
      icon: "compass",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 5,
        timePerQuestion: 60,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Rượt Đuổi Mê Cung</title>
  <style>
    #maze-chase-game {
      text-align: center;
      padding: 20px;
    }
    #maze {
      width: 300px;
      height: 300px;
      background: #eee;
      margin: auto;
      position: relative;
    }
    .player {
      width: 20px;
      height: 20px;
      background: blue;
      position: absolute;
      top: 0;
      left: 0;
    }
  </style>
</head>
<body>
  <div id="maze-chase-game">
    <h1>Rượt Đuổi Mê Cung</h1>
    <div id="maze">
      <!-- Mê cung sẽ được tạo bằng JS hoặc HTML tĩnh -->
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const maze = document.getElementById('maze');
      const player = document.createElement('div');
      player.className = 'player';
      maze.appendChild(player);
      
      document.addEventListener('keydown', function(e) {
        let top = parseInt(player.style.top);
        let left = parseInt(player.style.left);
        switch(e.key) {
          case 'ArrowUp':
            top = Math.max(0, top - 10);
            break;
          case 'ArrowDown':
            top = Math.min(280, top + 10);
            break;
          case 'ArrowLeft':
            left = Math.max(0, left - 10);
            break;
          case 'ArrowRight':
            left = Math.min(280, left + 10);
            break;
        }
        player.style.top = top + "px";
        player.style.left = left + "px";
      });
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "balloon-pop",
      name: "Bắn bong bóng",
      description: "Bắn bong bóng bay lên từ dưới màn hình",
      icon: "rocket",
      defaultSettings: {
        difficulty: 'easy',
        questionCount: 15,
        timePerQuestion: 5,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Bắn Bong Bóng</title>
  <style>
    #balloon-pop-game {
      text-align: center;
      padding: 20px;
    }
    #balloon-container {
      position: relative;
      height: 300px;
      border: 1px solid #ccc;
      overflow: hidden;
      margin: auto;
      max-width: 600px;
    }
    .balloon {
      position: absolute;
      font-size: 1.5em;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div id="balloon-pop-game">
    <h1>Bắn Bong Bóng</h1>
    <div id="balloon-container">
      <!-- Bong bóng sẽ được tạo bằng JS -->
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.textContent = "🎈";
        balloon.style.left = Math.random() * 90 + "%";
        balloon.style.top = "300px";
        document.getElementById('balloon-container').appendChild(balloon);
        
        let pos = 300;
        const interval = setInterval(() => {
          pos -= 2;
          balloon.style.top = pos + "px";
          if(pos < 0) {
            clearInterval(interval);
            balloon.remove();
          }
        }, 50);
        
        balloon.addEventListener('click', function() {
          alert("Bắn trúng!");
          clearInterval(interval);
          balloon.remove();
        });
      }
      
      setInterval(createBalloon, 1000);
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "whack-a-mole",
      name: "Đập chuột chũi",
      description: "Đập chuột chũi khi chúng xuất hiện",
      icon: "dices",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 3,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Đập Chuột Chũi</title>
  <style>
    .mole-grid {
      display: grid;
      grid-template-columns: repeat(3, 100px);
      grid-gap: 10px;
      justify-content: center;
      max-width: 350px;
      margin: auto;
    }
    .mole-hole {
      width: 100px;
      height: 100px;
      background: #eee;
      position: relative;
      border: 1px solid #ccc;
    }
    .mole {
      position: absolute;
      bottom: 0;
      width: 80px;
      height: 80px;
      left: 10px;
      cursor: pointer;
      background-color: brown;
      border-radius: 50% 50% 50% 50%;
    }
  </style>
</head>
<body>
  <div id="whack-a-mole-game">
    <h1>Đập Chuột Chũi</h1>
    <div class="mole-grid">
      <!-- Các lỗ sẽ được tạo bằng JS -->
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const grid = document.querySelector('.mole-grid');
      const holes = 9;
      
      for(let i = 0; i < holes; i++){
        const hole = document.createElement('div');
        hole.className = 'mole-hole';
        grid.appendChild(hole);
      }
      
      function popMole() {
        const holesElements = document.querySelectorAll('.mole-hole');
        const randomHole = holesElements[Math.floor(Math.random() * holesElements.length)];
        const mole = document.createElement('div');
        mole.className = 'mole';
        randomHole.appendChild(mole);
        
        mole.addEventListener('click', function() {
          alert("Bắt được chuột chũi!");
          mole.remove();
        });
        
        setTimeout(() => {
          mole.remove();
        }, 1000);
      }
      
      setInterval(popMole, 1500);
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "watch-memorize",
      name: "Xem và ghi nhớ",
      description: "Ghi nhớ các vật phẩm và vị trí của chúng",
      icon: "brain-circuit",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 3,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Xem và Ghi Nhớ</title>
  <style>
    #watch-memorize-game {
      text-align: center;
      padding: 20px;
    }
    #items {
      display: flex;
      justify-content: center;
      margin: 20px;
    }
    .item {
      margin: 10px;
      padding: 10px;
      border: 1px solid #ccc;
    }
    #recall {
      padding: 10px 20px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div id="watch-memorize-game">
    <h1>Xem và Ghi Nhớ</h1>
    <div id="items">
      <!-- Các vật phẩm sẽ được tạo bằng JS -->
    </div>
    <button id="recall">Ghi nhớ</button>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const items = ["🍎", "🚗", "🐶", "📚"];
      const itemsContainer = document.getElementById('items');
      
      items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'item';
        span.textContent = item;
        itemsContainer.appendChild(span);
      });
      
      document.getElementById('recall').addEventListener('click', function() {
        alert("Nhớ được các vật phẩm!");
      });
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "rank-order",
      name: "Xếp theo thứ tự",
      description: "Sắp xếp các mục theo thứ tự đúng",
      icon: "list-ordered",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 30,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Xếp Theo Thứ Tự</title>
  <style>
    #rank-order-game {
      text-align: center;
      padding: 20px;
    }
    #items, #order-area {
      display: flex;
      justify-content: center;
      margin: 20px;
    }
    .item {
      margin: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      cursor: pointer;
      background: #f9f9f9;
    }
    #order-area {
      border: 1px dashed #aaa;
      min-height: 50px;
      padding: 10px;
    }
  </style>
</head>
<body>
  <div id="rank-order-game">
    <h1>Xếp Theo Thứ Tự</h1>
    <div id="items">
      <!-- Các mục sẽ được tạo bằng JS -->
    </div>
    <div id="order-area" ondrop="drop(event)" ondragover="allowDrop(event)">
      <!-- Kéo thả các mục vào đây -->
      Sắp xếp thành câu...
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const itemsData = [
        "Một", "Hai", "Ba", "Bốn"
        // Thêm các mục tùy chỉnh
      ];
      
      const itemsContainer = document.getElementById('items');
      const orderArea = document.getElementById('order-area');
      
      itemsData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = item;
        div.draggable = true;
        div.addEventListener('dragstart', function(e) {
          e.dataTransfer.setData('text/plain', item);
        });
        itemsContainer.appendChild(div);
      });
      
      orderArea.addEventListener('dragover', function(e) {
        e.preventDefault();
      });
      
      orderArea.addEventListener('drop', function(e) {
        e.preventDefault();
        const item = e.dataTransfer.getData('text/plain');
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = item;
        orderArea.appendChild(div);
      });
    });
    
    function allowDrop(ev) {
      ev.preventDefault();
    }
    
    function drop(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text/plain");
      ev.target.textContent += " " + data;
    }
  </script>
</body>
</html>
      `
    },
    {
      id: "winlose-quiz",
      name: "Đố vui ăn điểm",
      description: "Trả lời câu đố để nhận điểm",
      icon: "trophy",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'general',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Đố Vui Ăn Điểm</title>
  <style>
    #winlose-quiz-game {
      text-align: center;
      padding: 20px;
      max-width: 600px;
      margin: auto;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0  0 10px rgba(0,0,0,0.1);
    }
    #question {
      font-size: 1.5em;
      margin-bottom: 20px;
    }
    #options button {
      margin: 10px;
      padding: 10px 20px;
    }
    #bet {
      margin: 20px;
    }
  </style>
</head>
<body>
  <div id="winlose-quiz-game">
    <h1>Đố Vui Ăn Điểm</h1>
    <div id="question"></div>
    <div id="options"></div>
    <div>
      <label for="bet">Số điểm đặt cược: </label>
      <input type="number" id="bet" value="10" min="1">
    </div>
    <div id="score">Điểm: 0</div>
    <button id="next">Tiếp theo</button>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const questions = [
        { question: "2 + 3 = ?", options: ["4", "5", "6"], answer: 1 },
        // Thêm câu hỏi tùy chỉnh
      ];
      let current = 0;
      let score = 0;
      
      function displayQuestion() {
        const qDiv = document.getElementById('question');
        const optionsDiv = document.getElementById('options');
        qDiv.textContent = questions[current].question;
        optionsDiv.innerHTML = '';
        questions[current].options.forEach((opt, index) => {
          const btn = document.createElement('button');
          btn.textContent = opt;
          btn.addEventListener('click', function() {
            const bet = parseInt(document.getElementById('bet').value) || 0;
            if(index === questions[current].answer) {
              score += bet;
              alert("Đúng rồi! Bạn được cộng " + bet + " điểm.");
            } else {
              score -= bet;
              alert("Sai rồi! Bạn mất " + bet + " điểm.");
            }
            document.getElementById('score').textContent = "Điểm: " + score;
          });
          optionsDiv.appendChild(btn);
        });
      }
      
      document.getElementById('next').addEventListener('click', function() {
        current++;
        if(current < questions.length) {
          displayQuestion();
        } else {
          alert("Kết thúc trò chơi!");
        }
      });
      
      displayQuestion();
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "maths-generator",
      name: "Tạo đề toán",
      description: "Giải các bài toán ngẫu nhiên",
      icon: "calculator",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 10,
        timePerQuestion: 30,
        category: 'math',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Tạo Đề Toán</title>
  <style>
    #maths-generator-game {
      text-align: center;
      padding: 20px;
      max-width: 600px;
      margin: auto;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    #question {
      font-size: 1.5em;
      margin-bottom: 20px;
    }
    #answer {
      padding: 10px;
      font-size: 1em;
    }
    #submit {
      padding: 10px 20px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div id="maths-generator-game">
    <h1>Tạo Đề Toán</h1>
    <div id="question">Nhấn nút để tạo câu hỏi toán</div>
    <input type="text" id="answer" placeholder="Nhập đáp án">
    <button id="submit">Xác nhận</button>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      let a, b, op, correctAnswer;
      function generateQuestion() {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        const ops = ["+", "-", "*"];
        op = ops[Math.floor(Math.random() * ops.length)];
        if(op === "+") {
          correctAnswer = a + b;
        } else if(op === "-") {
          correctAnswer = a - b;
        } else if(op === "*") {
          correctAnswer = a * b;
        }
        document.getElementById('question').textContent = a + " " + op + " " + b + " = ?";
      }
      
      document.getElementById('submit').addEventListener('click', function() {
        const userAnswer = parseInt(document.getElementById('answer').value);
        if(userAnswer === correctAnswer) {
          alert("Đúng rồi!");
        } else {
          alert("Sai, đáp án đúng là " + correctAnswer);
        }
        generateQuestion();
        document.getElementById('answer').value = "";
      });
      
      generateQuestion();
    });
  </script>
</body>
</html>
      `
    },
    {
      id: "word-magnets",
      name: "Nam châm từ",
      description: "Sắp xếp từ để tạo thành câu có nghĩa",
      icon: "book-text",
      defaultSettings: {
        difficulty: 'medium',
        questionCount: 8,
        timePerQuestion: 40,
        category: 'arts',
      },
      template: `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Nam Châm Từ</title>
  <style>
    #word-magnets-game {
      text-align: center;
      padding: 20px;
    }
    #magnet-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: 20px;
    }
    .magnet {
      margin: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      background: #f9f9f9;
      cursor: grab;
    }
    #sentence {
      margin-top: 20px;
      min-height: 50px;
      border: 1px dashed #aaa;
      padding: 10px;
    }
  </style>
</head>
<body>
  <div id="word-magnets-game">
    <h1>Nam Châm Từ</h1>
    <div id="magnet-container">
      <!-- Các từ sẽ được tạo bằng JS -->
    </div>
    <div id="sentence" ondrop="drop(event)" ondragover="allowDrop(event)">
      Sắp xếp thành câu...
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const words = ["Tôi", "yêu", "lập", "trình"];
      const container = document.getElementById('magnet-container');
      words.forEach(word => {
        const div = document.createElement('div');
        div.className = 'magnet';
        div.textContent = word;
        div.draggable = true;
        div.addEventListener('dragstart', function(e) {
          e.dataTransfer.setData('text/plain', word);
        });
        container.appendChild(div);
      });
    });
    
    function allowDrop(ev) {
      ev.preventDefault();
    }
    
    function drop(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text/plain");
      ev.target.textContent += " " + data;
    }
  </script>
</body>
</html>
      `
    }
  ];

  useEffect(() => {
    const gameButtons = containerRef.current?.querySelectorAll('.game-button');
    gameButtons?.forEach((button, index) => {
      setTimeout(() => {
        if (button instanceof HTMLElement) {
          animateBlockCreation(button);
        }
      }, index * 80);
    });
  }, []);

  const handleTitleClick = () => {
    setTitleClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setTimeout(() => {
          setShowOpenAIKeyModal(true);
          return 0;
        }, 100);
      }
      return newCount;
    });
  };

  const handleSaveOpenAIKey = (key: string) => {
    gameGenerator.setOpenAIKey(key);
  };

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'brain-circuit': return <BrainCircuit size={36} />;
      case 'puzzle': return <Puzzle size={36} />;
      case 'lightbulb': return <Lightbulb size={36} />;
      case 'clock': return <Clock4 size={36} />;
      case 'dices': return <Dices size={36} />;
      case 'heart-handshake': return <HeartHandshake size={36} />;
      case 'pen-tool': return <PenTool size={36} />;
      case 'book': return <Book size={36} />;
      case 'graduation-cap': return <GraduationCap size={36} />;
      case 'globe': return <Globe size={36} />;
      case 'award': return <Award size={36} />;
      case 'school': return <School size={36} />;
      case 'image': return <Image size={36} />;
      case 'apple': return <Apple size={36} />;
      case 'check-circle': return <CheckCircle size={36} />;
      case 'compass': return <Compass size={36} />;
      case 'rocket': return <Rocket size={36} />;
      case 'list-ordered': return <ListOrdered size={36} />;
      case 'trophy': return <Trophy size={36} />;
      case 'calculator': return <Calculator size={36} />;
      case 'book-text': return <BookText size={36} />;
      default: return <Gamepad size={36} />;
    }
  };

  const handleTopicSelect = (gameType: GameType) => {
    setSelectedTopic(gameType.name);
    setCurrentGameType(gameType);
    setShowSettings(true);
  };
  
  const handleCustomGame = () => {
    if (!customTopic.trim()) {
      toast({
        title: "Chủ Đề Trống",
        description: "Vui lòng nhập chủ đề cho minigame tùy chỉnh",
        variant: "destructive",
      });
      return;
    }
    navigate(`/quiz?topic=${encodeURIComponent(customTopic)}&autostart=true`);
  };
  
  const handleStartGame = async (settings: GameSettingsData) => {
    setShowSettings(false);
    if (!selectedTopic) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // For template games, we'll use the built-in template
      if (currentGameType && currentGameType.template) {
        const game: MiniGame = {
          title: currentGameType.name,
          description: currentGameType.description || "Minigame tương tác",
          content: currentGameType.template
        };
        
        setSelectedGame(game);
        toast({
          title: "Minigame Đã Sẵn Sàng",
          description: `Đã tải minigame "${selectedTopic}"`,
        });
      } else {
        // For custom games, use AI generation
        const game = await gameGenerator.generateMiniGame(selectedTopic, settings);
        
        if (game) {
          setSelectedGame(game);
          toast({
            title: "Minigame Đã Sẵn Sàng",
            description: `Đã tạo minigame về "${selectedTopic}"`,
          });
        } else {
          throw new Error('Không thể tạo minigame');
        }
      }
    } catch (error) {
      console.error('Lỗi Tạo Minigame:', error);
      setErrorMessage('Không thể tạo minigame. Vui lòng thử lại hoặc chọn chủ đề khác.');
      toast({
        title: "Lỗi Tạo Minigame",
        description: "Có vấn đề khi tạo minigame. Vui lòng thử lại với chủ đề khác.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSettings = () => {
    setShowSettings(false);
    setSelectedTopic("");
    setCurrentGameType(null);
  };

  if (isLoading) {
    return <GameLoading />;
  }

  if (errorMessage) {
    return <GameError 
      errorMessage={errorMessage} 
      onRetry={() => setErrorMessage(null)} 
      topic="minigame" 
    />;
  }

  if (selectedGame) {
    return (
      <div className="h-full relative">
        <GameView miniGame={selectedGame} />
        <div className="absolute top-4 right-4">
          <h3 
            className="text-sm font-medium text-primary/60 cursor-pointer select-none" 
            onClick={handleTitleClick}
            title="Trợ Lý Tạo Web"
          >
            Trợ Lý Tạo Web
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center h-full w-full bg-gradient-to-b from-background to-background/80 p-6">
      <div className="text-primary mb-2 animate-float-in">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse-soft"></div>
          <School size={56} className="relative z-10 text-primary" />
        </div>
      </div>
      
      <h2 
        className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in cursor-pointer"
        onClick={handleTitleClick}
      >
        Minigames Giáo Dục
      </h2>
      
      {/* Custom game input */}
      <div className="w-full max-w-3xl mb-6 flex items-center gap-2">
        <Input
          placeholder="Nhập chủ đề minigame tùy chỉnh..."
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          className="border-primary/20 focus:border-primary/40 bg-white/5"
        />
        <Button 
          onClick={handleCustomGame}
          variant="default"
          className="whitespace-nowrap flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80"
        >
          <BadgePlus size={18} />
          Game Tùy Chỉnh
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl w-full">
        {gameTypes.map((gameType) => (
          <Button 
            key={gameType.id}
            variant="outline" 
            className="game-button flex flex-col h-28 justify-center items-center gap-2 transition-all duration-300 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:border-primary/60 hover:shadow-lg hover:bg-primary/5 active:scale-95 opacity-0 group"
            onClick={() => handleTopicSelect(gameType)}
          >
            <div className="text-primary/80 p-2 rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary">
              {getIconComponent(gameType.icon)}
            </div>
            <span className="font-medium text-sm">{gameType.name}</span>
          </Button>
        ))}
      </div>
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-lg border-white/20">
          <GameSettings 
            topic={selectedTopic}
            onStart={handleStartGame}
            initialSettings={currentGameType?.defaultSettings}
            onCancel={handleCancelSettings}
            inModal={true}
            gameType={currentGameType}
          />
        </DialogContent>
      </Dialog>

      <OpenAIKeyModal 
        isOpen={showOpenAIKeyModal}
        onClose={() => setShowOpenAIKeyModal(false)}
        onSave={handleSaveOpenAIKey}
        currentKey={localStorage.getItem('openai_api_key')}
      />
    </div>
  );
};

export default QuickGameSelector;
