
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = 'AIzaSyA7wP0XfY-JJBhZJMy2Kt1z9IQ6b3vEo5c';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const GAME_SYSTEM_PROMPT = `You are a game developer that creates HTML Canvas games. 
Return ONLY complete HTML code with embedded CSS and JavaScript.
No markdown, no explanations, no comments.
Create a playable game based on user requirements.
Use HTML5 Canvas and vanilla JavaScript.
Include game controls and score system.
Make it responsive and mobile-friendly.`;

export async function generateGame(userPrompt: string): Promise<string> {
  try {
    console.log('🎮 Sending request to Gemini:', { userPrompt });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${GAME_SYSTEM_PROMPT}\n\nUser request: ${userPrompt}` }]
        }
      ],
    });

    console.log('🎮 Gemini response received:', {
      responseLength: response.text?.length || 0,
      hasHTML: response.text?.includes('<html') || false
    });

    let gameHTML = response.text || '';
    
    // Xử lý markdown thành HTML nếu cần
    gameHTML = processMarkdownToHTML(gameHTML);
    
    // Validate HTML
    if (!gameHTML.includes('<canvas') && !gameHTML.includes('<html')) {
      throw new Error('Response không chứa HTML game hợp lệ');
    }

    console.log('🎮 Game HTML processed:', {
      finalLength: gameHTML.length,
      hasCanvas: gameHTML.includes('<canvas'),
      hasHTML: gameHTML.includes('<html')
    });

    return gameHTML;
  } catch (error) {
    console.error('🎮 Gemini API Error:', error);
    throw new Error(`Lỗi tạo game: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function processMarkdownToHTML(content: string): string {
  // Loại bỏ markdown code blocks
  content = content.replace(/```html\n?/g, '').replace(/```\n?/g, '');
  
  // Loại bỏ các ký tự markdown khác nếu có
  content = content.replace(/^\s*#.*$/gm, ''); // Headers
  content = content.replace(/^\s*\*.*$/gm, ''); // Lists
  
  // Nếu không có DOCTYPE, thêm vào
  if (!content.includes('<!DOCTYPE') && content.includes('<html')) {
    content = '<!DOCTYPE html>\n' + content;
  }
  
  return content.trim();
}
