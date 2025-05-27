
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = 'AIzaSyAcCyfdmqeT9DNJZ4Qh-iNgw9hqXE5Epqw';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GAME_SYSTEM_PROMPT = `You are a game developer that creates HTML Canvas games. 
Return ONLY complete HTML code with embedded CSS and JavaScript.
No markdown, no explanations, no comments.
Create a playable game based on user requirements.
Use HTML5 Canvas and vanilla JavaScript.
Include game controls and score system.
Make it responsive and mobile-friendly.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    console.log('🎮 Generating custom game with prompt:', prompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${GAME_SYSTEM_PROMPT}\n\nUser request: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('🎮 Gemini API Error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const gameHTML = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('🎮 Game generated successfully:', {
      htmlLength: gameHTML.length,
      hasCanvas: gameHTML.includes('<canvas'),
      hasHTML: gameHTML.includes('<html')
    });

    // Process markdown to HTML if needed
    let processedHTML = gameHTML
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^\s*#.*$/gm, '')
      .replace(/^\s*\*.*$/gm, '')
      .trim();

    if (!processedHTML.includes('<!DOCTYPE') && processedHTML.includes('<html')) {
      processedHTML = '<!DOCTYPE html>\n' + processedHTML;
    }

    if (!processedHTML.includes('<canvas') && !processedHTML.includes('<html')) {
      throw new Error('Generated content is not a valid HTML game');
    }

    return new Response(JSON.stringify({ 
      gameHTML: processedHTML,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('🎮 Error in generate-custom-game function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
