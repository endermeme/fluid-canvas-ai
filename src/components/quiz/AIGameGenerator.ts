import { GameSettingsData } from './types';

export interface MiniGame {
  title: string;
  description: string;
  html: string;
}

export class AIGameGenerator {
  private apiKey: string;
  private openaiKey: string | null = null;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // Try to load OpenAI key from localStorage
    this.openaiKey = localStorage.getItem('openai_api_key');
  }
  
  public setOpenAIKey(key: string): boolean {
    if (!key.trim()) {
      localStorage.removeItem('openai_api_key');
      this.openaiKey = null;
      return false;
    }
    
    try {
      localStorage.setItem('openai_api_key', key.trim());
      this.openaiKey = key.trim();
      return true;
    } catch (e) {
      console.error('Failed to save OpenAI key:', e);
      return false;
    }
  }
  
  public hasOpenAIKey(): boolean {
    return !!this.openaiKey;
  }
  
  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 30000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }
  
  private async generateWithGemini(topic: string, settings: GameSettingsData): Promise<MiniGame | null> {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
      
      const difficultyDesc = {
        easy: "very simple for young children (6-8 years old)",
        medium: "moderately challenging for children (9-12 years old)",
        hard: "challenging for teenagers (13-16 years old)"
      }[settings.difficulty] || "moderately challenging for children";
      
      const categoryDesc = {
        general: "general knowledge",
        math: "mathematics",
        science: "science",
        history: "history",
        geography: "geography",
        arts: "arts and music",
        sports: "sports"
      }[settings.category] || "general knowledge";
      
      const prompt = `
        Create an interactive HTML5 educational minigame about "${topic}" with the following specifications:
        - Difficulty level: ${difficultyDesc}
        - Category: ${categoryDesc}
        - Number of questions/challenges: ${settings.questionCount}
        - Time per question: ${settings.timePerQuestion} seconds
        
        The game should:
        1. Be completely self-contained in a single HTML file with inline JavaScript and CSS
        2. Be visually appealing with a clean, modern design suitable for children
        3. Include a title screen, game mechanics, scoring system, and end screen
        4. Work in any modern browser without external dependencies
        5. Be educational and engaging
        6. Include Vietnamese language instructions and content
        7. Have clear instructions for players
        8. Include sound effects (optional) and visual feedback
        9. Be responsive and work on both desktop and mobile devices
        
        Return ONLY the complete HTML code without any explanations or markdown formatting.
      `;
      
      const response = await this.fetchWithTimeout(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      }, 60000);
      
      if (!response.ok) {
        console.error('Gemini API error:', await response.text());
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the HTML content from the response
      const htmlContent = data.candidates[0].content.parts[0].text;
      
      // Extract title from HTML (looking for <title> tag)
      const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : topic;
      
      // Extract meta description or create one
      const descriptionMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
      const description = descriptionMatch ? descriptionMatch[1] : `Educational game about ${topic}`;
      
      return {
        title,
        description,
        html: htmlContent
      };
    } catch (error) {
      console.error('Error generating game with Gemini:', error);
      return null;
    }
  }
  
  private async enhanceWithOpenAI(miniGame: MiniGame): Promise<MiniGame> {
    if (!this.openaiKey) {
      return miniGame;
    }
    
    try {
      const response = await this.fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert HTML5 game developer specializing in educational games. Your task is to improve the provided HTML5 game code to make it more engaging, visually appealing, and educational."
            },
            {
              role: "user",
              content: `Please improve this educational HTML5 game. Focus on:
              1. Fixing any bugs or issues
              2. Improving the visual design and animations
              3. Enhancing game mechanics for better engagement
              4. Adding better feedback and instructions
              5. Ensuring it works well on mobile devices
              
              Here's the current code:
              
              ${miniGame.html}`
            }
          ],
          temperature: 0.7,
          max_tokens: 4096
        })
      }, 60000);
      
      if (!response.ok) {
        console.error('OpenAI API error:', await response.text());
        return miniGame; // Return original if enhancement fails
      }
      
      const data = await response.json();
      const enhancedHtml = data.choices[0].message.content.replace(/```html|```/g, '').trim();
      
      return {
        ...miniGame,
        html: enhancedHtml
      };
    } catch (error) {
      console.error('Error enhancing game with OpenAI:', error);
      return miniGame; // Return original if enhancement fails
    }
  }
  
  public async generateMiniGame(topic: string, settings: GameSettingsData): Promise<MiniGame | null> {
    try {
      // First generate with Gemini
      const miniGame = await this.generateWithGemini(topic, settings);
      
      if (!miniGame) {
        throw new Error('Failed to generate game with Gemini');
      }
      
      // If OpenAI key is available, enhance the game
      if (this.openaiKey) {
        return await this.enhanceWithOpenAI(miniGame);
      }
      
      return miniGame;
    } catch (error) {
      console.error('Error in generateMiniGame:', error);
      return null;
    }
  }
}
