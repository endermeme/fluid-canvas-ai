
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameOptions } from '@/components/quiz/GameOptionsSelector';

export interface MiniGame {
  title: string;
  description: string;
  htmlContent: string;
}

export class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateMiniGame(userMessage: string, options?: GameOptions): Promise<MiniGame | null> {
    try {
      console.log("Đang tạo minigame cho chủ đề:", userMessage);
      console.log("Tùy chọn:", options);
      
      const difficultyMap: Record<string, string> = {
        'easy': 'dễ, phù hợp cho người mới bắt đầu',
        'medium': 'trung bình, có thách thức nhưng vẫn phù hợp cho hầu hết người chơi',
        'hard': 'khó, có nhiều thách thức và yêu cầu kỹ năng nhất định',
        'advanced': 'nâng cao, rất khó và thử thách, dành cho người chơi có kinh nghiệm'
      };
      
      const contentTypeMap: Record<string, string> = {
        'educational': 'giáo dục, học tập và kiến thức',
        'entertainment': 'giải trí và vui chơi',
        'puzzle': 'giải đố và thử thách tư duy',
        'brain': 'rèn luyện trí não và phát triển tư duy',
        'art': 'nghệ thuật và sáng tạo',
        'custom': 'tùy chỉnh theo sở thích cá nhân'
      };
      
      const ageGroupMap: Record<string, string> = {
        'kids': 'trẻ em (3-7 tuổi)',
        'children': 'thiếu nhi (8-12 tuổi)',
        'teen': 'thiếu niên (13-17 tuổi)',
        'adult': 'người lớn (18+ tuổi)',
        'all': 'phù hợp mọi lứa tuổi'
      };
      
      const difficulty = options?.difficulty ? difficultyMap[options.difficulty] || 'trung bình' : 'trung bình';
      const contentType = options?.contentType ? contentTypeMap[options.contentType] || 'giải trí' : 'giải trí';
      const ageGroup = options?.ageGroup ? ageGroupMap[options.ageGroup] || 'mọi lứa tuổi' : 'mọi lứa tuổi';

      const puzzleTemplate = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minigame: ${userMessage}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a3d62 0%, #3c6382 100%);
            color: white;
            padding: 20px;
        }
        
        .game-header {
            text-align: center;
            margin-bottom: 20px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .game-header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        .game-header p {
            font-size: 16px;
            opacity: 0.8;
        }

        #game-container {
            width: 400px;
            height: 400px;
            position: relative;
            background-color: #0c2461;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            overflow: hidden;
            border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .puzzle-piece {
            position: absolute;
            background-size: 400px 400px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .puzzle-piece:hover {
            transform: scale(1.02);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 10;
        }
        
        .puzzle-piece.correct {
            border: 1px solid rgba(0, 255, 0, 0.5);
            box-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
        }

        .game-controls {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            width: 100%;
            max-width: 400px;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
        }
        
        .stat {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .stat-label {
            font-size: 12px;
            opacity: 0.7;
        }
        
        .stat-value {
            font-size: 18px;
            font-weight: bold;
        }

        #start-button {
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            width: 100%;
        }

        #start-button:hover {
            background: linear-gradient(135deg, #5e64d8 0%, #9fa4ff 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        
        #start-button:disabled {
            background: #7f8c8d;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .message-area {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-weight: bold;
            color: #f39c12;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .difficulty-select {
            margin-top: 10px;
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        
        .difficulty-option {
            padding: 8px 15px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .difficulty-option.active {
            background: rgba(46, 204, 113, 0.4);
            font-weight: bold;
        }
        
        .win-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
            display: none;
        }
        
        .win-animation.active {
            display: block;
        }
        
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #f39c12;
            opacity: 0.8;
            border-radius: 10px;
            animation: fall 4s linear infinite;
        }
        
        @keyframes fall {
            0% {
                transform: translateY(-100px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    </style>
</head>
<body>
    <div class="game-header">
        <h1>Xếp Hình: ${userMessage}</h1>
        <p>Xếp các mảnh ghép vào đúng vị trí</p>
    </div>
    
    <div id="game-container"></div>
    
    <div class="game-controls">
        <div class="stats">
            <div class="stat">
                <span class="stat-label">Điểm</span>
                <span class="stat-value" id="score-value">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">Di chuyển</span>
                <span class="stat-value" id="moves-value">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">Thời gian</span>
                <span class="stat-value" id="time-value">00:00</span>
            </div>
        </div>
        
        <div class="message-area" id="message">Nhấn Start để bắt đầu trò chơi!</div>
        
        <button id="start-button">Bắt Đầu</button>
        
        <div class="difficulty-select">
            <div class="difficulty-option active" data-size="3">Dễ (3x3)</div>
            <div class="difficulty-option" data-size="4">Thường (4x4)</div>
            <div class="difficulty-option" data-size="5">Khó (5x5)</div>
        </div>
    </div>
    
    <div class="win-animation" id="win-animation"></div>

    <script>
        // Game variables
        let pieces = [];
        let score = 0;
        let moves = 0;
        let gameStarted = false;
        let gameTime = 0;
        let timerInterval;
        let gridSize = 3;
        let selectedPiece = null;
        let correctPieces = 0;
        
        // Game elements
        const gameContainer = document.getElementById('game-container');
        const message = document.getElementById('message');
        const scoreValue = document.getElementById('score-value');
        const movesValue = document.getElementById('moves-value');
        const timeValue = document.getElementById('time-value');
        const startButton = document.getElementById('start-button');
        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        const winAnimation = document.getElementById('win-animation');
        
        // Set up difficulty selection
        difficultyOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (gameStarted) return;
                
                // Remove active class from all options
                difficultyOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');
                
                // Set the grid size
                gridSize = parseInt(option.dataset.size);
            });
        });
        
        // Image options for the puzzle
        const imageOptions = [
            // Use placeholder images
            'https://source.unsplash.com/random/800x800/?nature',
            'https://source.unsplash.com/random/800x800/?animal',
            'https://source.unsplash.com/random/800x800/?architecture',
            'https://source.unsplash.com/random/800x800/?travel',
            'https://source.unsplash.com/random/800x800/?food'
        ];
        
        // Pick a random image for each game
        const getRandomImage = () => {
            return imageOptions[Math.floor(Math.random() * imageOptions.length)];
        };
        
        // Convert seconds to MM:SS format
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
        };
        
        // Create puzzle pieces
        const createPieces = (image) => {
            pieces = [];
            gameContainer.innerHTML = '';
            
            const pieceWidth = 400 / gridSize;
            const pieceHeight = 400 / gridSize;
            
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    const piece = document.createElement('div');
                    piece.classList.add('puzzle-piece');
                    piece.style.width = \`\${pieceWidth}px\`;
                    piece.style.height = \`\${pieceHeight}px\`;
                    piece.style.backgroundImage = \`url('\${image}')\`;
                    piece.style.backgroundPosition = \`-\${col * pieceWidth}px -\${row * pieceHeight}px\`;
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    piece.dataset.correctRow = row;
                    piece.dataset.correctCol = col;
                    
                    // Initial position based on correct placement
                    piece.style.left = \`\${col * pieceWidth}px\`;
                    piece.style.top = \`\${row * pieceHeight}px\`;
                    
                    piece.addEventListener('click', () => handlePieceClick(piece));
                    pieces.push(piece);
                    gameContainer.appendChild(piece);
                }
            }
        };
        
        // Shuffle the puzzle pieces
        const shufflePieces = () => {
            const positions = pieces.map(piece => {
                return { 
                    left: piece.style.left, 
                    top: piece.style.top 
                };
            });
            
            // Randomly swap positions
            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }
            
            // Apply new positions
            pieces.forEach((piece, index) => {
                piece.style.left = positions[index].left;
                piece.style.top = positions[index].top;
            });
            
            // Check if puzzle is accidentally solved after shuffle
            setTimeout(checkWinCondition, 500);
        };
        
        // Handle piece click
        const handlePieceClick = (piece) => {
            if (!gameStarted) return;
            
            // If no piece selected yet, select this one
            if (selectedPiece === null) {
                selectedPiece = piece;
                piece.style.opacity = '0.7';
                piece.style.transform = 'scale(1.05)';
                piece.style.zIndex = '20';
            } else {
                // If this piece is already selected, unselect it
                if (selectedPiece === piece) {
                    selectedPiece.style.opacity = '1';
                    selectedPiece.style.transform = 'scale(1)';
                    selectedPiece.style.zIndex = '1';
                    selectedPiece = null;
                    return;
                }
                
                // Swap positions with previously selected piece
                const tempLeft = selectedPiece.style.left;
                const tempTop = selectedPiece.style.top;
                
                selectedPiece.style.left = piece.style.left;
                selectedPiece.style.top = piece.style.top;
                
                piece.style.left = tempLeft;
                piece.style.top = tempTop;
                
                // Reset selected piece appearance
                selectedPiece.style.opacity = '1';
                selectedPiece.style.transform = 'scale(1)';
                selectedPiece.style.zIndex = '1';
                
                selectedPiece = null;
                
                moves++;
                movesValue.textContent = moves;
                
                // Check if any piece is now in correct position
                updateCorrectPieceStatus();
                
                // Check if puzzle is solved
                checkWinCondition();
            }
        };
        
        // Update which pieces are in correct positions
        const updateCorrectPieceStatus = () => {
            correctPieces = 0;
            const pieceWidth = 400 / gridSize;
            const pieceHeight = 400 / gridSize;
            
            pieces.forEach(piece => {
                const currentRow = Math.round(parseInt(piece.style.top) / pieceHeight);
                const currentCol = Math.round(parseInt(piece.style.left) / pieceWidth);
                
                if (
                    parseInt(piece.dataset.correctRow) === currentRow && 
                    parseInt(piece.dataset.correctCol) === currentCol
                ) {
                    piece.classList.add('correct');
                    correctPieces++;
                } else {
                    piece.classList.remove('correct');
                }
            });
        };
        
        // Check if the puzzle is solved
        const checkWinCondition = () => {
            if (correctPieces === pieces.length) {
                // All pieces in correct position!
                gameStarted = false;
                clearInterval(timerInterval);
                
                // Calculate score based on grid size, moves, and time
                const basePoints = gridSize * gridSize * 10;
                const movesPenalty = Math.floor(moves / 2);
                const timePenalty = Math.floor(gameTime / 10);
                
                score = Math.max(basePoints - movesPenalty - timePenalty, 10);
                scoreValue.textContent = score;
                
                message.textContent = \`Chúc mừng! Bạn đã hoàn thành với \${moves} bước!\`;
                startButton.textContent = 'Chơi Lại';
                startButton.disabled = false;
                
                showWinAnimation();
            }
        };
        
        // Show confetti animation when player wins
        const showWinAnimation = () => {
            winAnimation.innerHTML = '';
            winAnimation.classList.add('active');
            
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                
                // Random position
                confetti.style.left = \`\${Math.random() * 100}%\`;
                
                // Random color
                const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'];
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                // Random size
                const size = Math.random() * 12 + 5;
                confetti.style.width = \`\${size}px\`;
                confetti.style.height = \`\${size}px\`;
                
                // Random animation delay
                confetti.style.animationDelay = \`\${Math.random() * 4}s\`;
                
                winAnimation.appendChild(confetti);
            }
            
            setTimeout(() => {
                winAnimation.classList.remove('active');
            }, 4000);
        };
        
        // Start game function
        const startGame = () => {
            startButton.disabled = true;
            startButton.textContent = 'Đang chơi...';
            message.textContent = 'Xếp các mảnh ghép vào đúng vị trí!';
            
            score = 0;
            moves = 0;
            gameTime = 0;
            correctPieces = 0;
            scoreValue.textContent = '0';
            movesValue.textContent = '0';
            timeValue.textContent = '00:00';
            
            // Reset win animation
            winAnimation.classList.remove('active');
            
            // Get random image and create pieces
            const randomImage = getRandomImage();
            createPieces(randomImage);
            
            // Delay shuffle to allow image to load
            setTimeout(() => {
                shufflePieces();
                gameStarted = true;
                
                // Start timer
                clearInterval(timerInterval);
                timerInterval = setInterval(() => {
                    gameTime++;
                    timeValue.textContent = formatTime(gameTime);
                }, 1000);
            }, 500);
        };
        
        // Attach event listener to start button
        startButton.addEventListener('click', startGame);
    </script>
</body>
</html>`;

      // Now we'll use the template directly instead of generating it with AI
      const prompt = `Create a minigame about "${userMessage}" that is:
- focused on image puzzles
- difficulty level: ${difficulty}
- content type: ${contentType}
- suitable for ${ageGroup}
`;

      // Log the prompt for debugging
      console.log("Prompt for minigame:", prompt);
      
      // Use the template as the response
      const htmlContent = puzzleTemplate;

      // Create the MiniGame object
      return {
        title: `Xếp Hình: ${userMessage}`,
        description: `Trò chơi xếp hình về ${userMessage}`,
        htmlContent: htmlContent
      };
    } catch (error) {
      console.error('Lỗi tạo Minigame:', error);
      return null;
    }
  }

  parseMiniGameResponse(rawText: string, topic: string): MiniGame | null {
    try {
      console.log("Đang phân tích kết quả minigame:", rawText);
      
      // Tìm nội dung HTML
      let htmlContent = '';
      const htmlMatch = rawText.match(/```html([\s\S]*?)```/);
      
      if (htmlMatch && htmlMatch[1]) {
        htmlContent = htmlMatch[1].trim();
      } else if (!rawText.includes('```')) {
        // Nếu không có định dạng markdown, xử lý text thô
        htmlContent = rawText.trim();
      }
      
      if (!htmlContent) {
        console.error('Không tìm thấy nội dung HTML hợp lệ');
        return null;
      }

      // Tạo đối tượng MiniGame
      return {
        title: `Minigame: ${topic}`,
        description: `Minigame tương tác về chủ đề ${topic}`,
        htmlContent: htmlContent
      };
    } catch (error) {
      console.error("Lỗi phân tích kết quả minigame:", error);
      return null;
    }
  }
}
