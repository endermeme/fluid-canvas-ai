
import { MiniGame } from './types';

export const enhanceWithOpenAI = async (
  openAIKey: string | null,
  geminiGame: MiniGame, 
  topic: string
): Promise<MiniGame | null> => {
  if (!openAIKey) {
    console.log("⚠️ OpenAI: Không có API key, bỏ qua quá trình cải thiện game");
    return geminiGame;
  }
  
  try {
    console.log("🔶 OpenAI: Chuẩn bị gửi yêu cầu cải thiện...");
    console.log(`🔶 OpenAI: Game ban đầu "${geminiGame.title}" - Kích thước code: ${geminiGame.content.length.toLocaleString()} ký tự`);
    
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
    6. IMPORTANT: Verify that all JavaScript variables are properly declared with let/const/var
    7. Make sure all JavaScript code is placed inside DOMContentLoaded event
    8. OPTIMIZE the code by REMOVING any unnecessary components or features
    9. If there are any features not relevant to the game's main purpose, REMOVE them
    10. REVIEW the entire game against the topic requirements and FIX any inconsistencies
    
    IMPORTANT REQUIREMENTS:
    - Make SIGNIFICANT improvements to the code quality, not just minor fixes
    - Replace broken or non-functional sections completely if needed
    - Keep ALL code in a single HTML file with internal <style> and <script> tags
    - Do NOT change the fundamental game concept
    - Focus on ensuring smooth, bug-free gameplay first
    - KEEP ALL IMAGE URLS exactly as they are - do not modify or remove any image URLs
    - Return ONLY the complete, enhanced HTML file - nothing else
    - Make sure all code is properly formatted and indented
    - Add helpful comments to explain complex logic
    - SIMPLIFY complex code that could be written more elegantly
    - REMOVE any unnecessary or redundant code
    
    If you see that the code is completely broken or has major issues, DO NOT try to fix it piecemeal. 
    Instead, rewrite it entirely while preserving the core game concept and mechanics. Do not add comments
    explaining your changes - just return the fixed code.
    
    Remember: NEVER remove or alter any image URLs in the code. They must remain exactly as they are.
    
    Return the fully fixed and enhanced HTML code WITHOUT any additional explanations before or after.
    
    Here is the current code:
    
    ${geminiGame.content}
    `;

    console.log("🔶 OpenAI: Gửi yêu cầu đến OpenAI API (mô hình gpt-4o)...");
    console.log("🔶 OpenAI: Kích thước prompt: " + prompt.length.toLocaleString() + " ký tự");
    
    const startTime = Date.now();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ OpenAI: Lỗi API:", errorData);
      console.log("⚠️ OpenAI: Sử dụng game ban đầu do gặp lỗi khi cải thiện");
      return geminiGame; // Return original game if enhancement fails
    }

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`🔶 OpenAI: Đã nhận phản hồi sau ${timeTaken}s`);
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      console.log("🔶 OpenAI: Độ dài phản hồi: " + content.length.toLocaleString() + " ký tự");
      
      // Only continue if response has sufficient content
      if (content.length < 500) {
        console.error("❌ OpenAI: Phản hồi quá ngắn, có thể có lỗi. Sử dụng game ban đầu.");
        return geminiGame;
      }
      
      // Extract HTML document - improved extraction logic
      let enhancedHtml = "";
      
      // Method 1: Find complete HTML string
      console.log("🔶 OpenAI: Đang trích xuất HTML (phương pháp 1)...");
      const htmlMatch = content.match(/<(!DOCTYPE|html)[\s\S]*<\/html>/i);
      if (htmlMatch) {
        enhancedHtml = htmlMatch[0];
        console.log("✅ OpenAI: Trích xuất HTML thành công bằng phương pháp 1");
      } 
      // Method 2: Find from <html> to </html>
      else if (content.includes("<html") && content.includes("</html>")) {
        console.log("🔶 OpenAI: Đang trích xuất HTML (phương pháp 2)...");
        const startIndex = Math.max(0, content.indexOf("<html") - 15); // Add margin to catch DOCTYPE
        const endIndex = content.lastIndexOf("</html>") + 7;
        if (startIndex >= 0 && endIndex > startIndex) {
          enhancedHtml = content.substring(startIndex, endIndex);
          console.log("✅ OpenAI: Trích xuất HTML thành công bằng phương pháp 2");
        }
      } 
      // Method 3: Find individual pieces and reconstruct
      else if (content.includes("<head>") && content.includes("</body>")) {
        console.log("🔶 OpenAI: Đang trích xuất HTML (phương pháp 3)...");
        // Create HTML from found parts
        const headStartIndex = content.indexOf("<head>");
        const bodyEndIndex = content.lastIndexOf("</body>");
        
        if (headStartIndex >= 0 && bodyEndIndex > 0) {
          enhancedHtml = "<!DOCTYPE html>\n<html>\n" + 
            content.substring(headStartIndex, bodyEndIndex + 7) + 
            "\n</html>";
          console.log("✅ OpenAI: Tái tạo HTML thành công bằng phương pháp 3");
        }
      } 
      // Method 4: Just look for a style or script tag and assume the rest is HTML
      else if (content.includes("<style>") || content.includes("<script>")) {
        console.log("🔶 OpenAI: Đang trích xuất HTML (phương pháp 4)...");
        enhancedHtml = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n" +
          "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
          "<title>" + geminiGame.title + "</title>\n" + content + "\n</html>";
        console.log("✅ OpenAI: Tái tạo HTML thành công bằng phương pháp 4");
      }
      
      if (enhancedHtml && enhancedHtml.length > 500) {
        // Basic HTML structure validation
        console.log("🔶 OpenAI: Đang xác thực cấu trúc HTML...");
        const hasBasicStructure = enhancedHtml.includes("<body") || 
                                 enhancedHtml.includes("<script") || 
                                 enhancedHtml.includes("<style");
                                 
        if (!hasBasicStructure) {
          console.error("❌ OpenAI: Cấu trúc HTML không hợp lệ, sử dụng game ban đầu.");
          return geminiGame;
        }
        
        // Ensure basic HTML structure if missing
        if (!enhancedHtml.includes("<!DOCTYPE")) {
          enhancedHtml = "<!DOCTYPE html>\n" + enhancedHtml;
        }
        if (!enhancedHtml.includes("<html")) {
          enhancedHtml = enhancedHtml.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n<html>");
          enhancedHtml += "\n</html>";
        }
        
        console.log("✅ OpenAI: Đã xử lý HTML cải thiện thành công");
        console.log(`🔶 OpenAI: Kích thước HTML gốc: ${geminiGame.content.length.toLocaleString()} vs mới: ${enhancedHtml.length.toLocaleString()}`);
        
        // Check for key HTML components that should be present
        const containsStyle = enhancedHtml.includes("<style>");
        const containsScript = enhancedHtml.includes("<script>");
        const containsBody = enhancedHtml.includes("<body");
        console.log(`🔶 OpenAI: Kiểm tra HTML - Style: ${containsStyle}, Script: ${containsScript}, Body: ${containsBody}`);
        
        return {
          title: geminiGame.title,
          description: geminiGame.description,
          content: enhancedHtml
        };
      }
      
      console.log("⚠️ OpenAI: Không thể trích xuất HTML hợp lệ từ phản hồi, sử dụng game ban đầu");
    }
    
    console.log("⚠️ OpenAI: Không có nội dung hợp lệ từ OpenAI, trả về game ban đầu");
    return geminiGame;
  } catch (error) {
    console.error("❌ OpenAI: Lỗi khi cải thiện với OpenAI:", error);
    return geminiGame;
  }
};
