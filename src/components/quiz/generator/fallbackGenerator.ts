
import { MiniGame } from './types';
import { getGameTypeByTopic } from '../gameTypes';

export const createFallbackGame = (topic: string): MiniGame => {
  console.log("Creating fallback game for topic:", topic);
  return getBasicGame(topic);
};

export const getBasicGame = (topic: string): MiniGame => {
  // Get game type from topic to create appropriate fallback
  const gameType = getGameTypeByTopic(topic);
  const gameTitle = gameType ? `${gameType.name} về ${topic}` : `Quiz về ${topic}`;
  
  return {
    title: gameTitle,
    description: `Minigame đơn giản về chủ đề ${topic}`,
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
        }

        #game-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            padding: 20px;
            width: 90%;
            max-width: 600px;
            margin: 20px auto;
            text-align: center;
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }

        #question {
            font-size: 1.2rem;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }

        .options {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 20px;
        }

        @media (min-width: 480px) {
            .options {
                grid-template-columns: 1fr 1fr;
            }
        }

        .option {
            padding: 10px;
            background-color: #e9ecef;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .option:hover {
            background-color: #dee2e6;
        }

        .option.selected {
            background-color: #4dabf7;
            color: white;
        }

        .option.correct {
            background-color: #40c057;
            color: white;
        }

        .option.wrong {
            background-color: #fa5252;
            color: white;
        }

        #next-btn, #restart-btn {
            padding: 10px 20px;
            background-color: #4dabf7;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
        }

        #next-btn:hover, #restart-btn:hover {
            background-color: #339af0;
        }

        #score-container {
            font-size: 1.2rem;
            margin-top: 20px;
        }

        #progress-bar {
            width: 100%;
            height: 10px;
            background-color: #dee2e6;
            border-radius: 5px;
            margin-bottom: 20px;
            overflow: hidden;
        }

        #progress {
            height: 100%;
            background-color: #4dabf7;
            width: 0%;
            transition: width 0.5s;
        }
    </style>
</head>
<body>
    <div id="game-container">
        <h1>${gameTitle}</h1>
        <div id="progress-bar">
            <div id="progress"></div>
        </div>
        <div id="question"></div>
        <div class="options" id="options">
            <!-- Options will be inserted here -->
        </div>
        <button id="next-btn" style="display:none;">Câu tiếp theo</button>
        <div id="score-container" style="display:none;">
            <p>Điểm của bạn: <span id="score">0</span>/<span id="total">0</span></p>
            <button id="restart-btn">Chơi lại</button>
        </div>
    </div>

    <script>
        // Quiz data
        const quizData = [
            {
                question: "Câu hỏi 1 về ${topic}?",
                options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                correct: 0
            },
            {
                question: "Câu hỏi 2 về ${topic}?",
                options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                correct: 1
            },
            {
                question: "Câu hỏi 3 về ${topic}?",
                options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                correct: 2
            }
        ];

        // Game variables
        let currentQuestion = 0;
        let score = 0;
        let optionSelected = false;

        // DOM elements
        const questionEl = document.getElementById('question');
        const optionsEl = document.getElementById('options');
        const nextBtn = document.getElementById('next-btn');
        const scoreEl = document.getElementById('score');
        const totalEl = document.getElementById('total');
        const scoreContainer = document.getElementById('score-container');
        const restartBtn = document.getElementById('restart-btn');
        const progressBar = document.getElementById('progress');

        // Load quiz
        function loadQuiz() {
            optionSelected = false;
            nextBtn.style.display = 'none';
            
            const currentQuizData = quizData[currentQuestion];
            questionEl.innerText = currentQuizData.question;
            
            optionsEl.innerHTML = '';
            currentQuizData.options.forEach((option, index) => {
                const optionEl = document.createElement('div');
                optionEl.innerText = option;
                optionEl.classList.add('option');
                optionEl.addEventListener('click', () => selectOption(optionEl, index));
                optionsEl.appendChild(optionEl);
            });
            
            // Update progress bar
            progressBar.style.width = \`\${(currentQuestion / quizData.length) * 100}%\`;
        }

        // Select option
        function selectOption(optionEl, index) {
            if (optionSelected) return;
            
            optionSelected = true;
            const currentQuizData = quizData[currentQuestion];
            
            // Check if the selected option is correct
            if (index === currentQuizData.correct) {
                optionEl.classList.add('correct');
                score++;
            } else {
                optionEl.classList.add('wrong');
                // Highlight the correct answer
                optionsEl.children[currentQuizData.correct].classList.add('correct');
            }
            
            // Show next button
            nextBtn.style.display = 'block';
        }

        // Go to next question or end quiz
        function nextQuestion() {
            currentQuestion++;
            
            if (currentQuestion < quizData.length) {
                loadQuiz();
            } else {
                endQuiz();
            }
        }

        // End quiz and show score
        function endQuiz() {
            questionEl.innerText = \`Quiz hoàn thành!\`;
            optionsEl.innerHTML = '';
            nextBtn.style.display = 'none';
            
            scoreEl.innerText = score;
            totalEl.innerText = quizData.length;
            scoreContainer.style.display = 'block';
            
            // Update progress bar to 100%
            progressBar.style.width = '100%';
        }

        // Restart quiz
        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            optionSelected = false;
            scoreContainer.style.display = 'none';
            loadQuiz();
        }

        // Event listeners
        nextBtn.addEventListener('click', nextQuestion);
        restartBtn.addEventListener('click', restartQuiz);

        // Initialize quiz
        loadQuiz();
    </script>
</body>
</html>`
  };
};
