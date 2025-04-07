import { MiniGame } from './types';
import { GameSettingsData } from '../types';
import { getGameTypeByTopic } from '../gameTypes';

export const generateWithGemini = async (
  model: any, 
  topic: string, 
  settings?: GameSettingsData
): Promise<MiniGame | null> => {
  // Get game type from topic to provide better context for the AI
  const gameType = getGameTypeByTopic(topic);
  const gameDescription = gameType ? gameType.description : "interactive learning game";
  
  console.log(`🔷 Gemini: Starting game generation for "${topic}" - Type: ${gameType?.name || "Not specified"}`);
  console.log(`🔷 Gemini: Settings: ${JSON.stringify(settings || {})}`);
  
  const settingsPrompt = settings ? `
    Create with these settings:
    - Difficulty: ${settings.difficulty}
    - Number of questions/challenges: ${settings.questionCount}
    - Time per question/challenge: ${settings.timePerQuestion} seconds
    - Category: ${settings.category}
  ` : '';

  // Additional instructions for specific game types
  let gameSpecificInstructions = '';
  
  if (gameType?.id === 'crossword') {
    gameSpecificInstructions = `
    ## Special Instructions for Crossword Puzzle
    
    For this crossword puzzle game:
    
    1. **Grid Size and Complexity**:
       - Create a manageable grid size (5x5 to 10x10 maximum)
       - Only use simple words related to the topic "${topic}"
       - Include ${settings?.questionCount || 10} words maximum
       - Ensure words intersect in a valid crossword pattern
    
    2. **User Interface Requirements**:
       - Each cell should be clearly visible and sized appropriately (minimum 40px on mobile)
       - Show clue numbers in the grid that correspond to the clues list
       - Provide separate lists for "Across" and "Down" clues
       - Allow users to navigate between cells using keyboard arrow keys or touch
       - Highlight the active word (all cells of the current word) when a cell is selected
    
    3. **Technical Implementation**:
       - Store each letter in a separate input field or equivalent data structure
       - Track filled cells and validate each word when all its cells are filled
       - Auto-advance to the next cell when a letter is entered
       - Auto-jump to the next word when current word is completed
       - Allow one letter per cell, enforce uppercase letters only
       - Prevent non-alphabetic characters from being entered
    
    4. **Responsive Design**:
       - Scale the grid appropriately on different screen sizes
       - On small screens, make sure the grid is still usable (minimum cell size of 40px)
       - Allow zooming or scrolling if needed for very small screens
    
    5. **Feedback System**:
       - Visual feedback when a word is correctly completed
       - Validate each word individually instead of waiting for the entire puzzle
       - Show progress indicator (e.g., 5/12 words completed)
    
    6. **Hint System**:
       - Provide an optional hint button that reveals one letter in the current word
       - Limit hints to prevent trivializing the game (e.g., 3 hints maximum)
    
    7. **Common Bugs to Avoid**:
       - ENSURE letters in intersecting words stay consistent
       - PREVENT input focus from being lost when using keyboard navigation
       - HANDLE touch inputs properly for mobile users
       - MAKE SURE all words and clues are properly initialized in the data structure
       - TEST that crossword validation works for all words in all directions
    `;
  }

  const prompt = `
    # Single-File Interactive Educational Mini-Game

    ## Goal
    Create a fully **interactive educational mini-game** that runs entirely in a **single HTML file** (with embedded CSS and JavaScript). The game should be self-contained (no external libraries) and provide an engaging experience about the topic "${topic}".

    ${gameSpecificInstructions}

    ## Game Types
    Your mini-game should support different game modes, offering a unique interaction style. These include:
    - **Quiz** (multiple-choice questions)
    - **Flashcards** (flip cards to reveal information)
    - **Unjumble** (rearrange letters or words to form the correct answer)
    - **Fill-in-the-Blank** (provide the missing word or phrase)
    - **True/False** (verify statements as true or false)
    - **Word Magnets** (drag and drop words to form sentences or answers)
    - **Speaking Cards** (cards that prompt the user to speak or read aloud)
    - **Memorize** (memory matching game with cards or items)
    - **Rank Order** (arrange items in the correct order)
    - **Math Quiz** (solve math questions/problems)
    - **Explain Why** (answer open-ended "why" questions with reasoning)
    - **Would You Rather** (choose between two scenarios and justify the choice)
    - **Riddles** (solve riddles or puzzles)

    Choose the most appropriate game mode for the topic "${topic}".
    ${settingsPrompt}

    ## Technical Requirements
    - **Single-File Solution:** All HTML, CSS, and JavaScript must be contained in one **single HTML file**. Do **not** use any external scripts, stylesheets, or libraries (no CDN links or imports). Everything (code, style, logic) should be embedded in the file.
    - **Responsive Design:** The game must be **fully responsive** and function well on mobile phones, tablets, and desktop browsers.
      - Use CSS media queries and flexible layouts so that components scale and rearrange appropriately on different screen sizes.
      - All interactive elements (buttons, cards, etc.) must be **touch-friendly**. Use a minimum target size of about **44px by 44px** for touch controls to ensure they are easy to tap.
    - **DOM Ready Script:** Wrap all JavaScript logic inside a \`DOMContentLoaded\` event listener. This ensures that the DOM is fully loaded before any script runs, preventing undefined element errors.
    - **Proper Variable Declaration:** Declare all variables using \`let\`, \`const\`, or \`var\` as appropriate. **Do not** use undeclared variables or rely on implicit globals. This is to maintain clean scope and avoid reference errors.
    - **High Contrast & Accessibility:** Use **bright, high-contrast colors** for game elements to make them visually distinct. Text should use an easily readable font with a size of at least **16px** for body text (larger for headings or important text).
      - Ensure sufficient color contrast between text and background for readability (consider users with visual impairments).
      - If sounds are used (optional), include captions or visual indicators for deaf or hard-of-hearing users.
    - **Visual Feedback:** Provide immediate visual feedback for user interactions:
      - Highlight selected answers or the card being flipped.
      - Indicate correct vs incorrect answers with color changes (e.g., green for correct, red for incorrect) or small animations.
      - Use simple animations (like a brief button press effect or a card flip animation) to enhance the experience. Keep animations subtle and avoid distracting the user from the content.
    - **Full-Screen Usage:** Design the layout so that the game fills the entire browser viewport without unnecessary scrolling:
      - Use CSS to ensure the main game container stretches to 100% width/height or uses flexbox/grid to center content appropriately.
      - Avoid any fixed elements that cause overflow. If overflow is needed (e.g., for a scrollable list of options), implement it intentionally and make it clear to the user.
    - **Game Logic & Flow:** Implement the logic for a complete game experience:
      - **Content Generation:** Based on the chosen game type and topic "${topic}", generate the appropriate questions, puzzles, or cards.
      - **User Interaction:** Allow the user to interact with the game (answer questions, flip cards, drag-drop words, etc. depending on the game type).
      - **Feedback:** After an answer is submitted or an action is taken, immediately show whether it was correct (for quizzes, true/false, etc.) or provide the correct answer/explanation if applicable.
      - **Score Tracking:** Keep track of the user's score or progress. For quiz-like games, count correct answers; for subjective ones like "Explain Why" or "Would You Rather," you might not score but you can acknowledge completion.
      - **Navigation:** Include "Next" and "Previous" controls where appropriate (e.g., to go to the next flashcard or question). Ensure the user can navigate through all game content.
      - **Completion Screen:** When the game (or a round of the game) is over, display a summary or **game-over screen**. This could show the final score, a message based on performance, or simply a congratulatory note for finishing.
      - Ensure the game can be restarted without reloading the page (for example, show a "Play Again" option).
    - **Image Usage:** If the game requires images (for example, images in flashcards or as part of questions):
      - Use only images that can be loaded via **Google image URLs** or other public domain sources. *Do not use any external image hosting that might not load*.
      - Each \`<img>\` tag should have descriptive \`alt\` text for accessibility (in case the image fails to load or for screen reader users).
      - Implement a fallback for images: for example, check if an image fails to load and display a placeholder or an error message in place of the image.
    - **Cross-Device Input Handling:** Make sure the game controls work with both **mouse/keyboard** and **touch** inputs:
      - For clickable elements (buttons, cards), ensure they respond to a click event (desktop) as well as touch events (mobile). Generally, using standard \`<button>\` or \`<input>\` elements and click events should cover both.
      - If implementing drag-and-drop (e.g., for Word Magnets), account for touch events (touchstart, touchmove, touchend) in addition to mouse events, or use pointer events that unify both.
      - **Keyboard support:** Users on desktop should be able to use keyboard controls where it makes sense (e.g., pressing Enter to submit an answer, arrow keys to navigate between choices or cards, etc.). Add appropriate \`tabindex\` to custom elements if needed so that they can be focused and activated via keyboard.
    - **Browser Compatibility:** The code should work on all modern browsers (Chrome, Firefox, Edge, Safari) without errors. Use standard web APIs and avoid anything experimental or specific to one browser.
      - Use CSS prefixes if needed for certain features (though modern standard features are preferred).
      - Ensure the layout and interaction work on both iOS and Android devices in addition to desktop.
    - **Performance:** Keep the code efficient. Since everything is in one file, avoid heavy operations or large data that could slow down the game on lower-end devices. Use efficient loops and data structures for game logic.
    - **Error-Free & Canvas Compatibility:** The code must be **error-free** (no JavaScript errors in the console, no broken HTML/CSS) and should run smoothly. If using an HTML5 \`<canvas>\` for any drawing or game logic, ensure it is properly implemented and compatible with the rest of the code. (Canvas is not required for these game types, but if used, it must degrade gracefully or not hinder other functionality.)

    ## Output Format
    The final answer (the content generated by the AI model) must be provided as a **minimal JSON object** with the following structure:
    - **\`title\`**: (string) The title of the game.
    - **\`description\`**: (string) A short description of the game.
    - **\`content\`**: (string) The full HTML code of the mini-game.

    **Important details for the output JSON:**
    - Do **not** include any markdown formatting, code block delimiters, or explanatory text outside the JSON. The response should be *only* the JSON object.
    - The JSON should be properly formatted and escape any special characters. In particular:
      - Ensure that quotes (\`"\`) within the HTML content are escaped (e.g., \`\\"\`).
      - Newline characters in the HTML content string should be properly represented so that the JSON remains valid. The model can either use \`\\n\` within the string or actually break the string into lines as long as it remains valid JSON syntax.
      - No control characters or invalid Unicode should appear in the output.
    - The \`content\` string must contain a **complete, valid HTML document**:
      - Include a proper \`<!DOCTYPE html>\` declaration and \`<html>\`, \`<head>\`, \`<body>\` tags.
      - All CSS should be inside a \`<style>\` tag within the \`<head>\` or \`<body>\` (either is fine, but typically in \`<head>\`).
      - All JavaScript should be inside a \`<script>\` tag (preferably placed just before the closing \`</body>\` tag for best practice, or in \`<head>\` if using \`DOMContentLoaded\` properly).
      - Make sure the HTML is well-formed (properly nested tags, closed tags, etc.) to avoid any parsing errors.

    DELIVER THE RESPONSE AS A SINGLE VALID JSON OBJECT WITH NO MARKDOWN OR BACKTICKS.
  `;

  try {
    console.log("🔷 Gemini: Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("🔷 Gemini: Response received, extracting JSON...");
    console.log("🔷 Gemini: Response length:", text.length);
    
    // Enhanced JSON extraction and cleaning
    try {
      // First prepare the text by trimming unnecessary parts
      const preparedText = text.trim()
        // Remove markdown code blocks if present
        .replace(/```json\s+/g, '')
        .replace(/```\s*$/g, '')
        // Remove leading/trailing whitespace
        .trim();
      
      // Method 1: Try JSON.parse directly if it's valid JSON
      try {
        // Check if the entire response is a valid JSON
        const gameData = JSON.parse(preparedText);
        console.log("🔷 Gemini: Valid JSON, extraction successful");
        
        return {
          title: gameData.title || topic,
          description: gameData.description || "",
          content: gameData.content || ''
        };
      } catch (directParseError) {
        console.log("🔷 Gemini: Cannot parse directly, trying method 2...");
        console.log("🔷 Gemini: Parse error:", directParseError.message);
      }
      
      // Method 2: Use regex to find and extract JSON object
      const jsonMatch = text.match(/{[\s\S]*?(?:}(?=[,\s]|$))/);
      if (jsonMatch) {
        // Clean the JSON string - replace problematic characters
        const cleanedJson = jsonMatch[0]
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
          .replace(/\\(?!["\\/bfnrt])/g, "\\\\") // Fix invalid escape sequences
          .replace(/([^\\])"/g, '$1\\"') // Escape unescaped quotes
          .replace(/([^\\])'/g, '$1"') // Replace single quotes with double quotes
          .replace(/\\n/g, "\\n") // Properly escape newlines
          .replace(/\\r/g, "\\r") // Properly escape carriage returns
          .replace(/\\t/g, "\\t") // Properly escape tabs
          .replace(/\\\\/g, "\\\\") // Fix double backslashes
          .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
          .replace(/[\u2018\u2019]/g, "'"); // Replace smart quotes
        
        console.log("🔷 Gemini: Parsing JSON from response (method 2)...");
        try {
          // Try with JSON5 parsing approach (more lenient)
          const jsonString = `(${cleanedJson})`;
          const gameData = eval(jsonString); // Using eval as a last resort for malformed JSON
          
          console.log(`🔷 Gemini: Successfully created game "${gameData.title || 'No title'}"`);
          console.log(`🔷 Gemini: Description: ${gameData.description || 'No description'}`);
          console.log(`🔷 Gemini: Code size: ${(gameData.content?.length || 0).toLocaleString()} characters`);
          
          return {
            title: gameData.title || topic,
            description: gameData.description || "",
            content: gameData.content || ''
          };
        } catch (jsonError) {
          console.error("❌ Gemini: JSON parsing error (method 2):", jsonError);
          console.log("🔷 Gemini: Using manual extraction method...");
        }
      }
      
      // Method 3: Manual extraction as final fallback
      console.log("🔷 Gemini: Using manual extraction method (regex)...");
      
      // Extract content with a more robust pattern
      let content = '';
      const contentStart = text.indexOf('"content"');
      if (contentStart !== -1) {
        // Find the first quote after "content":
        const firstQuotePos = text.indexOf('"', contentStart + 10);
        if (firstQuotePos !== -1) {
          // Now find the closing quote, accounting for escaped quotes
          let pos = firstQuotePos + 1;
          let foundClosingQuote = false;
          let level = 0;
          
          while (pos < text.length) {
            if (text[pos] === '"' && text[pos-1] !== '\\') {
              if (level === 0) {
                foundClosingQuote = true;
                break;
              }
              level--;
            }
            pos++;
          }
          
          if (foundClosingQuote) {
            content = text.substring(firstQuotePos + 1, pos)
              .replace(/\\"/g, '"')
              .replace(/\\n/g, '\n')
              .replace(/\\t/g, '\t')
              .replace(/\\\\/g, '\\');
          }
        }
      }
      
      // If we couldn't extract content, try a different approach
      if (!content) {
        const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*}|"\s*$)/);
        if (contentMatch) {
          content = contentMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\');
        }
      }
      
      if (content) {
        console.log("🔷 Gemini: Successful extraction using regex");
        return {
          title: topic,
          description: "",
          content: content
        };
      }
      
      // Last resort: Extract any HTML content
      const htmlMatch = text.match(/<html[\s\S]*<\/html>/i);
      if (htmlMatch) {
        console.log("🔷 Gemini: Successful HTML extraction");
        return {
          title: topic,
          description: "",
          content: htmlMatch[0]
        };
      }
      
      throw new Error("Cannot extract JSON or HTML from response");
    } catch (extractionError) {
      console.error("❌ Gemini: Extraction error:", extractionError);
      return null;
    }
  } catch (error) {
    console.error("❌ Gemini: Error generating with Gemini:", error);
    throw error; // Rethrow for retry mechanism
  }
};

export const tryGeminiGeneration = async (
  model: any,
  topic: string, 
  settings?: GameSettingsData, 
  retryCount = 0
): Promise<MiniGame | null> => {
  const maxRetries = 5; // Maximum number of retries
  
  if (retryCount >= maxRetries) {
    console.log(`⚠️ Gemini: Reached maximum retries (${maxRetries})`);
    return null;
  }
  
  try {
    console.log(`⏳ Gemini: Attempt ${retryCount + 1} for topic: "${topic}"`);
    return await generateWithGemini(model, topic, settings);
  } catch (error) {
    console.error(`❌ Gemini: Attempt ${retryCount + 1} failed:`, error);
    // Wait a bit before retrying (increasing wait time with each retry)
    const waitTime = (retryCount + 1) * 1500; // Increase wait time between retries
    console.log(`⏳ Gemini: Waiting ${waitTime/1000} seconds before retrying...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return tryGeminiGeneration(model, topic, settings, retryCount + 1);
  }
};
