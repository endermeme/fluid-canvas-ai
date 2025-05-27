
import { supabase } from '@/integrations/supabase/client';

const GAME_SYSTEM_PROMPT = `You are a game developer that creates HTML Canvas games. 
Return ONLY complete HTML code with embedded CSS and JavaScript.
No markdown, no explanations, no comments.
Create a playable game based on user requirements.
Use HTML5 Canvas and vanilla JavaScript.
Include game controls and score system.
Make it responsive and mobile-friendly.`;

export async function generateGame(userPrompt: string): Promise<string> {
  try {
    console.log('🎮 Sending request to edge function:', { userPrompt });
    
    const { data, error } = await supabase.functions.invoke('generate-custom-game', {
      body: { prompt: userPrompt }
    });

    if (error) {
      console.error('🎮 Edge function error:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data.success) {
      console.error('🎮 Game generation failed:', data.error);
      throw new Error(data.error || 'Unknown error');
    }

    console.log('🎮 Game generated successfully:', {
      htmlLength: data.gameHTML?.length || 0,
      hasCanvas: data.gameHTML?.includes('<canvas') || false,
      hasHTML: data.gameHTML?.includes('<html') || false
    });

    return data.gameHTML;

  } catch (error) {
    console.error('🎮 Gemini Service Error:', error);
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
