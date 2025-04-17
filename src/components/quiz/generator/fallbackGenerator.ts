
import { MiniGame } from './types';

export const createFallbackGame = (topic: string): MiniGame => {
  
  // HTML content for the fallback game
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fallback Game about ${topic}</title>
    </head>
    <body>
      <div class="container">
        <h1>Learning about ${topic}</h1>
        <p>Sorry, we couldn't generate a custom game. Let's try a simple quiz instead!</p>
        
        <div class="quiz-container">
          <div id="question-container">
            <p class="question" id="question-text">Loading questions about ${topic}...</p>
            <div class="options" id="options-container">
              <!-- Options will be inserted here by JS -->
            </div>
            <p class="feedback" id="feedback"></p>
          </div>
          <button class="btn next-btn" id="next-btn" style="display:none;">Next Question</button>
          <button class="btn" id="restart-btn" style="display:none;">Try Again</button>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // CSS content for the fallback game
  const cssContent = `
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 16px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      color: #333;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 24px;
      max-width: 600px;
      width: 100%;
      text-align: center;
    }
    h1 {
      color: #4a5568;
      margin-top: 0;
    }
    p {
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .btn {
      background-color: #4299e1;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .btn:hover {
      background-color: #3182ce;
    }
    .quiz-container {
      margin-top: 24px;
      width: 100%;
    }
    .question {
      font-weight: bold;
      margin-bottom: 12px;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .option {
      background-color: #e2e8f0;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.3s;
    }
    .option:hover {
      background-color: #cbd5e0;
    }
    .option.selected {
      background-color: #bee3f8;
    }
    .option.correct {
      background-color: #c6f6d5;
    }
    .option.incorrect {
      background-color: #fed7d7;
    }
    .feedback {
      margin-top: 16px;
      font-weight: bold;
    }
    .next-btn {
      margin-top: 16px;
    }
    @media (max-width: 480px) {
      .container {
        padding: 16px;
      }
    }
  `;
  
  // JavaScript content for the fallback game
  const jsContent = `
    document.addEventListener('DOMContentLoaded', function() {
      // Simple fallback quiz about the topic
      // We'll generate some generic questions that could apply to any topic
      const topic = "${topic}";
      
      const questions = [
        {
          question: "What is the main purpose of studying " + topic + "?",
          options: [
            "To understand its fundamental principles",
            "To apply it in real-world scenarios",
            "To solve related problems efficiently",
            "All of the above"
          ],
          correctIndex: 3
        },
        {
          question: "Which of these might be considered a key element of " + topic + "?",
          options: [
            "Research and investigation",
            "Practical application",
            "Historical context",
            "Technical details"
          ],
          correctIndex: Math.floor(Math.random() * 4) // Random correct answer
        },
        {
          question: "How might professionals use knowledge of " + topic + " in their work?",
          options: [
            "To make informed decisions",
            "To develop new methodologies",
            "To educate others on the subject",
            "To improve existing systems"
          ],
          correctIndex: Math.floor(Math.random() * 4) // Random correct answer
        }
      ];
      
      let currentQuestionIndex = 0;
      let score = 0;
      
      // DOM elements
      const questionText = document.getElementById('question-text');
      const optionsContainer = document.getElementById('options-container');
      const feedbackElement = document.getElementById('feedback');
      const nextButton = document.getElementById('next-btn');
      const restartButton = document.getElementById('restart-btn');
      
      // Load the first question
      loadQuestion();
      
      function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
          showResults();
          return;
        }
        
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Add new options
        question.options.forEach((option, index) => {
          const optionElement = document.createElement('div');
          optionElement.className = 'option';
          optionElement.textContent = option;
          optionElement.dataset.index = index;
          optionElement.addEventListener('click', selectOption);
          optionsContainer.appendChild(optionElement);
        });
        
        // Hide feedback and next button
        feedbackElement.textContent = '';
        nextButton.style.display = 'none';
      }
      
      function selectOption(e) {
        // Prevent selecting after an answer is chosen
        if (nextButton.style.display === 'block') return;
        
        const selectedIndex = parseInt(e.target.dataset.index);
        const correctIndex = questions[currentQuestionIndex].correctIndex;
        
        // Remove any previous selections
        document.querySelectorAll('.option').forEach(option => {
          option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Mark this option as selected
        e.target.classList.add('selected');
        
        // Check if correct
        if (selectedIndex === correctIndex) {
          e.target.classList.add('correct');
          feedbackElement.textContent = 'Correct!';
          score++;
        } else {
          e.target.classList.add('incorrect');
          // Also highlight the correct answer
          document.querySelectorAll('.option')[correctIndex].classList.add('correct');
          feedbackElement.textContent = 'Incorrect. Try again!';
        }
        
        // Show next button
        nextButton.style.display = 'block';
      }
      
      function showResults() {
        questionText.textContent = "Quiz Complete!";
        optionsContainer.innerHTML = '';
        feedbackElement.textContent = "Your score: " + score + " out of " + questions.length;
        nextButton.style.display = 'none';
        restartButton.style.display = 'block';
      }
      
      // Event listeners
      nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion();
      });
      
      restartButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        restartButton.style.display = 'none';
        loadQuestion();
      });
    });
  `;

  // Simple fallback game when all else fails
  return {
    title: `Fallback game about ${topic}`,
    description: "A basic game when the AI generator encounters an issue",
    content: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fallback Game about ${topic}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 16px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #333;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 24px;
            max-width: 600px;
            width: 100%;
            text-align: center;
          }
          h1 {
            color: #4a5568;
            margin-top: 0;
          }
          p {
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .btn {
            background-color: #4299e1;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
          }
          .btn:hover {
            background-color: #3182ce;
          }
          .quiz-container {
            margin-top: 24px;
            width: 100%;
          }
          .question {
            font-weight: bold;
            margin-bottom: 12px;
          }
          .options {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .option {
            background-color: #e2e8f0;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            text-align: left;
            transition: background-color 0.3s;
          }
          .option:hover {
            background-color: #cbd5e0;
          }
          .option.selected {
            background-color: #bee3f8;
          }
          .option.correct {
            background-color: #c6f6d5;
          }
          .option.incorrect {
            background-color: #fed7d7;
          }
          .feedback {
            margin-top: 16px;
            font-weight: bold;
          }
          .next-btn {
            margin-top: 16px;
          }
          @media (max-width: 480px) {
            .container {
              padding: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Learning about ${topic}</h1>
          <p>Sorry, we couldn't generate a custom game. Let's try a simple quiz instead!</p>
          
          <div class="quiz-container">
            <div id="question-container">
              <p class="question" id="question-text">Loading questions about ${topic}...</p>
              <div class="options" id="options-container">
                <!-- Options will be inserted here by JS -->
              </div>
              <p class="feedback" id="feedback"></p>
            </div>
            <button class="btn next-btn" id="next-btn" style="display:none;">Next Question</button>
            <button class="btn" id="restart-btn" style="display:none;">Try Again</button>
          </div>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            // Simple fallback quiz about the topic
            // We'll generate some generic questions that could apply to any topic
            const topic = "${topic}";
            
            const questions = [
              {
                question: "What is the main purpose of studying " + topic + "?",
                options: [
                  "To understand its fundamental principles",
                  "To apply it in real-world scenarios",
                  "To solve related problems efficiently",
                  "All of the above"
                ],
                correctIndex: 3
              },
              {
                question: "Which of these might be considered a key element of " + topic + "?",
                options: [
                  "Research and investigation",
                  "Practical application",
                  "Historical context",
                  "Technical details"
                ],
                correctIndex: Math.floor(Math.random() * 4) // Random correct answer
              },
              {
                question: "How might professionals use knowledge of " + topic + " in their work?",
                options: [
                  "To make informed decisions",
                  "To develop new methodologies",
                  "To educate others on the subject",
                  "To improve existing systems"
                ],
                correctIndex: Math.floor(Math.random() * 4) // Random correct answer
              }
            ];
            
            let currentQuestionIndex = 0;
            let score = 0;
            
            // DOM elements
            const questionText = document.getElementById('question-text');
            const optionsContainer = document.getElementById('options-container');
            const feedbackElement = document.getElementById('feedback');
            const nextButton = document.getElementById('next-btn');
            const restartButton = document.getElementById('restart-btn');
            
            // Load the first question
            loadQuestion();
            
            function loadQuestion() {
              if (currentQuestionIndex >= questions.length) {
                showResults();
                return;
              }
              
              const question = questions[currentQuestionIndex];
              questionText.textContent = question.question;
              
              // Clear previous options
              optionsContainer.innerHTML = '';
              
              // Add new options
              question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.textContent = option;
                optionElement.dataset.index = index;
                optionElement.addEventListener('click', selectOption);
                optionsContainer.appendChild(optionElement);
              });
              
              // Hide feedback and next button
              feedbackElement.textContent = '';
              nextButton.style.display = 'none';
            }
            
            function selectOption(e) {
              // Prevent selecting after an answer is chosen
              if (nextButton.style.display === 'block') return;
              
              const selectedIndex = parseInt(e.target.dataset.index);
              const correctIndex = questions[currentQuestionIndex].correctIndex;
              
              // Remove any previous selections
              document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected', 'correct', 'incorrect');
              });
              
              // Mark this option as selected
              e.target.classList.add('selected');
              
              // Check if correct
              if (selectedIndex === correctIndex) {
                e.target.classList.add('correct');
                feedbackElement.textContent = 'Correct!';
                score++;
              } else {
                e.target.classList.add('incorrect');
                // Also highlight the correct answer
                document.querySelectorAll('.option')[correctIndex].classList.add('correct');
                feedbackElement.textContent = 'Incorrect. Try again!';
              }
              
              // Show next button
              nextButton.style.display = 'block';
            }
            
            function showResults() {
              questionText.textContent = "Quiz Complete!";
              optionsContainer.innerHTML = '';
              feedbackElement.textContent = "Your score: " + score + " out of " + questions.length;
              nextButton.style.display = 'none';
              restartButton.style.display = 'block';
            }
            
            // Event listeners
            nextButton.addEventListener('click', () => {
              currentQuestionIndex++;
              loadQuestion();
            });
            
            restartButton.addEventListener('click', () => {
              currentQuestionIndex = 0;
              score = 0;
              restartButton.style.display = 'none';
              loadQuestion();
            });
          });
        </script>
      </body>
      </html>
    `,
    htmlContent: htmlContent,
    cssContent: cssContent,
    jsContent: jsContent,
    isSeparatedFiles: true
  };
};
