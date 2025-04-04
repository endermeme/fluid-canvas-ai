import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameSettingsData } from './types';

export interface MiniGame {
  title: string;
  description: string;
  content: string;
}

export class AIGameGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private openAIKey: string | null = null;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    this.openAIKey = localStorage.getItem('openai_api_key');
  }

  setOpenAIKey(key: string) {
    if (key && key.trim() !== '') {
      this.openAIKey = key;
      localStorage.setItem('openai_api_key', key);
      return true;
    }
    return false;
  }

  hasOpenAIKey(): boolean {
    return this.openAIKey !== null && this.openAIKey !== '';
  }

  async generateMiniGame(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    try {
      console.log(`Starting game generation for topic: "${topic}" with settings:`, settings);
      
      // Try first with Gemini
      const geminiResult = await this.tryGeminiGeneration(topic, settings);
      
      if (geminiResult) {
        console.log("Successfully generated game with Gemini");
        
        // If OpenAI key is available, enhance the game
        if (this.hasOpenAIKey()) {
          console.log("OpenAI key available, enhancing game...");
          const enhancedGame = await this.enhanceWithOpenAI(geminiResult, topic);
          
          // Only use the enhanced game if enhancing was successful
          if (enhancedGame && enhancedGame.content && enhancedGame.content.length > 100) {
            console.log("Successfully enhanced game with OpenAI");
            return enhancedGame;
          } else {
            console.log("OpenAI enhancement failed or returned invalid content, using Gemini result");
            return geminiResult;
          }
        }
        
        return geminiResult;
      }
      
      console.log("Gemini generation failed, creating fallback game");
      return this.createFallbackGame(topic);
      
    } catch (error) {
      console.error("Error in generateMiniGame:", error);
      return this.createFallbackGame(topic);
    }
  }
  
  private async tryGeminiGeneration(topic: string, settings?: GameSettingsData, retryCount = 0): Promise<MiniGame | null> {
    if (retryCount >= 2) {
      console.log("Max retries reached for Gemini generation");
      return null;
    }
    
    try {
      console.log(`Gemini attempt ${retryCount + 1} for topic: "${topic}"`);
      return await this.generateWithGemini(topic, settings);
    } catch (error) {
      console.error(`Gemini attempt ${retryCount + 1} failed:`, error);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.tryGeminiGeneration(topic, settings, retryCount + 1);
    }
  }
  
  private async generateWithGemini(topic: string, settings?: GameSettingsData): Promise<MiniGame | null> {
    const inferGameType = (topic: string): string => {
      const lowerTopic = topic.toLowerCase();
      
      // Check if the topic itself describes a game mechanic
      if (lowerTopic.includes('ghép cặp thông tin') || lowerTopic.includes('ghép đôi') || lowerTopic.includes('từ và nghĩa')) {
        return "trò chơi ghép cặp từ với nghĩa";
      }
      if (lowerTopic.includes('xáo trộn chữ cái') || lowerTopic.includes('xáo chữ')) {
        return "trò chơi xáo trộn chữ cái để người chơi sắp xếp lại";
      }
      if (lowerTopic.includes('sắp xếp từ') || lowerTopic.includes('sắp xếp câu')) {
        return "trò chơi sắp xếp các từ để tạo thành câu hoàn chỉnh";
      }
      if (lowerTopic.includes('tìm cặp đôi') || lowerTopic.includes('tìm cặp giống nhau')) {
        return "trò chơi tìm cặp đôi giống nhau";
      }
      if (lowerTopic.includes('thẻ hai mặt') || lowerTopic.includes('thẻ ghi nhớ')) {
        return "trò chơi thẻ ghi nhớ hai mặt, một mặt câu hỏi, một mặt trả lời";
      }
      if (lowerTopic.includes('câu hỏi trắc nghiệm') || lowerTopic.includes('trắc nghiệm')) {
        return "trò chơi câu hỏi trắc nghiệm nhiều lựa chọn";
      }
      if (lowerTopic.includes('từ nam châm') || lowerTopic.includes('nam châm từ')) {
        return "trò chơi kéo thả các từ như nam châm để tạo thành câu hoàn chỉnh";
      }
      if (lowerTopic.includes('ô chữ')) {
        return "trò chơi ô chữ với các gợi ý";
      }
      if (lowerTopic.includes('đánh vần')) {
        return "trò chơi đánh vần từ bằng cách điền từng chữ cái";
      }
      if (lowerTopic.includes('đúng hay sai') || lowerTopic.includes('true false')) {
        return "trò chơi đúng hay sai, người chơi chọn đúng hoặc sai cho mỗi câu hỏi";
      }
      if (lowerTopic.includes('ghi nhớ') || lowerTopic.includes('trí nhớ')) {
        return "trò chơi thử thách trí nhớ, ghi nhớ các mục hiển thị";
      }
      
      // Default to quiz if no specific game type is detected
      return topic;
    };

    const gamePrompt = inferGameType(topic);
    const settingsPrompt = settings ? `
      Hãy tạo với các cài đặt sau:
      - Độ khó: ${settings.difficulty}
      - Số lượng câu hỏi/thử thách: ${settings.questionCount}
      - Thời gian cho mỗi câu hỏi/thử thách: ${settings.timePerQuestion} giây
      - Thể loại: ${settings.category}
    ` : '';

    const prompt = `
      Tạo một minigame tương tác hoàn chỉnh để học về chủ đề "${gamePrompt}".
      ${settingsPrompt}
      
      HƯỚNG DẪN CHI TIẾT:
      1. TẠO MỘT FILE HTML ĐẦY ĐỦ:
         - Bao gồm đầy đủ HTML, CSS và JavaScript trong một file HTML duy nhất
         - Sử dụng thẻ <style> cho CSS và thẻ <script> cho JavaScript
      
      2. YÊU CẦU KỸ THUẬT:
         - Code phải sạch sẽ và có indentation đúng
         - Game phải responsive, hoạt động tốt trên cả điện thoại và máy tính
         - KHÔNG sử dụng thư viện bên ngoài hay CDN
         - Game phải chiếm toàn bộ màn hình
      
      3. TÍNH NĂNG GAME:
         - Giao diện hấp dẫn với màu sắc và animation
         - Tính năng tương tác như đếm điểm, hiển thị thời gian
         - Có màn hình kết thúc game và nút chơi lại
      
      Trả về một đối tượng JSON với định dạng sau:
      {
        "title": "Tên minigame",
        "description": "Mô tả ngắn gọn về minigame",
        "content": "<đây là toàn bộ mã HTML đầy đủ, bao gồm cả CSS và JavaScript>"
      }
      
      QUAN TRỌNG: Trả về JSON hoàn chỉnh. Mã HTML phải là một trang web hoàn chỉnh và có thể chạy độc lập.
    `;

    try {
      console.log("Sending request to Gemini API...");
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log("Received Gemini response, extracting JSON...");
      
      // Clean and extract the JSON object
      const jsonMatch = text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        try {
          // Remove problematic escape sequences
          const cleanedJson = jsonMatch[0]
            .replace(/\\(?!["\\/bfnrt])/g, "")
            .replace(/\\\\/g, "\\")
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"');
          
          console.log("Parsing JSON from Gemini response...");
          const gameData = JSON.parse(cleanedJson);
          
          return {
            title: gameData.title || `Game về ${topic}`,
            description: gameData.description || `Minigame về chủ đề ${topic}`,
            content: gameData.content || this.getBasicGame(topic).content
          };
        } catch (jsonError) {
          console.error("Error parsing Gemini JSON:", jsonError);
          
          // Manual extraction as fallback
          const titleMatch = text.match(/"title"\s*:\s*"([^"]*)"/);
          const descriptionMatch = text.match(/"description"\s*:\s*"([^"]*)"/);
          const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*}|"\s*$)/);
          
          if (titleMatch && contentMatch) {
            return {
              title: titleMatch[1] || `Game về ${topic}`,
              description: descriptionMatch ? descriptionMatch[1] : `Minigame về chủ đề ${topic}`,
              content: contentMatch[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\t/g, '\t')
                .replace(/\\\\/g, '\\')
            };
          }
        }
      }
      
      console.error("Failed to extract game content from Gemini response");
      return null;
    } catch (error) {
      console.error("Error generating with Gemini:", error);
      throw error; // Rethrow for retry mechanism
    }
  }
  
  private async enhanceWithOpenAI(geminiGame: MiniGame, topic: string): Promise<MiniGame | null> {
    if (!this.openAIKey) return geminiGame;
    
    try {
      console.log("Preparing OpenAI enhancement request...");
      const prompt = `
      You are a master web developer specializing in creating bug-free, interactive web games.
      
      I'm going to provide you with HTML code for a mini-game on the topic of "${topic}".
      Your task is to improve this code by:
      
      1. IDENTIFY AND FIX ALL BUGS AND ERRORS in the code - this is your highest priority
      2. Make sure all game mechanics work correctly
      3. Ensure all game features are properly implemented and working 
      4. Complete any unfinished or partially implemented features
      5. Ensure the game is fully responsive and runs well on mobile
      
      IMPORTANT REQUIREMENTS:
      - Make SIGNIFICANT improvements to the code quality, not just minor fixes
      - Replace broken or non-functional sections completely if needed  
      - Keep ALL code in a single HTML file with internal <style> and <script> tags
      - Do NOT change the fundamental game concept
      - Focus on ensuring smooth, bug-free gameplay first
      - Return ONLY the complete, enhanced HTML file - nothing else
      - Make sure all code is properly formatted and indented
      - Add helpful comments to explain complex logic
      
      If you see that the code is completely broken or has major issues, DO NOT try to fix it piecemeal. 
      Instead, rewrite it entirely while preserving the core game concept and mechanics. Do not add comments
      explaining your changes - just return the fixed code.
      
      Return the fully fixed and enhanced HTML code WITHOUT any additional explanations before or after.
      
      Here is the current code:
      
      ${geminiGame.content}
      `;

      console.log("Sending request to OpenAI API (gpt-4o model)...");
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("OpenAI API error:", errorData);
        return geminiGame; // Return original game if enhancement fails
      }

      console.log("Received OpenAI response");
      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        console.log("OpenAI content length:", content.length);
        
        // Only continue if response has sufficient content
        if (content.length < 500) {
          console.error("OpenAI response too short, likely an error. Using original game.");
          return geminiGame;
        }
        
        // Extract HTML document - improved extraction logic
        let enhancedHtml = "";
        
        // Method 1: Find complete HTML string
        const htmlMatch = content.match(/<(!DOCTYPE|html)[\s\S]*<\/html>/i);
        if (htmlMatch) {
          enhancedHtml = htmlMatch[0];
          console.log("Successfully extracted HTML from OpenAI response using method 1");
        } 
        // Method 2: Find from <html> to </html>
        else if (content.includes("<html") && content.includes("</html>")) {
          const startIndex = Math.max(0, content.indexOf("<html") - 15); // Add margin to catch DOCTYPE
          const endIndex = content.lastIndexOf("</html>") + 7;
          if (startIndex >= 0 && endIndex > startIndex) {
            enhancedHtml = content.substring(startIndex, endIndex);
            console.log("Successfully extracted HTML from OpenAI response using method 2");
          }
        } 
        // Method 3: Find individual pieces and reconstruct
        else if (content.includes("<head>") && content.includes("</body>")) {
          // Create HTML from found parts
          const headStartIndex = content.indexOf("<head>");
          const bodyEndIndex = content.lastIndexOf("</body>");
          
          if (headStartIndex >= 0 && bodyEndIndex > 0) {
            enhancedHtml = "<!DOCTYPE html>\n<html>\n" + 
              content.substring(headStartIndex, bodyEndIndex + 7) + 
              "\n</html>";
            console.log("Successfully reconstructed HTML from OpenAI response using method 3");
          }
        }
        
        if (enhancedHtml && enhancedHtml.length > 500) {
          // Basic HTML structure validation
          if (!enhancedHtml.includes("<body") || !enhancedHtml.includes("</body>") || 
              !enhancedHtml.includes("<head") || !enhancedHtml.includes("</head>")) {
            console.error("OpenAI response has invalid HTML structure, using original game.");
            return geminiGame;
          }
          
          console.log("Successfully processed OpenAI enhanced HTML");
          return {
            title: geminiGame.title,
            description: geminiGame.description,
            content: enhancedHtml
          };
        }
        
        // Last method: Use entire response if it's long enough and contains HTML
        if (content.length > 1000 && 
            (content.includes("<style>") || content.includes("<script>")) && 
            (content.includes("<body") || content.includes("<html"))) {
          
          console.log("Using complete OpenAI response as HTML");
          return {
            title: geminiGame.title,
            description: geminiGame.description,
            content: "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>" + 
              geminiGame.title + "</title>\n" + content + "\n</html>"
          };
        }
        
        console.log("Could not extract valid HTML from OpenAI response, using original game");
      }
      
      console.log("No valid content from OpenAI, returning original game");
      return geminiGame;
    } catch (error) {
      console.error("Error enhancing with OpenAI:", error);
      return geminiGame;
    }
  }

  private createFallbackGame(topic: string): MiniGame {
    console.log("Creating fallback game for topic:", topic);
    return this.getBasicGame(topic);
  }

  private getBasicGame(topic: string): MiniGame {
    return {
      title: `Quiz về ${topic}`,
      description: `Minigame quiz đơn giản về chủ đề ${topic}`,
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz về ${topic}</title>
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
        <h1>Quiz về ${topic}</h1>
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
  }
}
