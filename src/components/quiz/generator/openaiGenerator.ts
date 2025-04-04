
import { MiniGame } from './types';

export const enhanceWithOpenAI = async (
  openAIKey: string | null,
  geminiGame: MiniGame, 
  topic: string
): Promise<MiniGame | null> => {
  if (!openAIKey) return geminiGame;
  
  try {
    console.log("Preparing OpenAI enhancement request...");
    
    // Get game type from topic for better context
    const gameTypeContext = "";
    
    const prompt = `
    You are a master web developer specializing in creating bug-free, interactive web games.
    
    I'm going to provide you with HTML code for a mini-game on the topic of "${topic}".
    ${gameTypeContext}
    
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
        'Authorization': `Bearer ${openAIKey}`
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
};
