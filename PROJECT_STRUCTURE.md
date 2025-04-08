
# Project Structure Documentation

## Core Components

### Pages
- `src/pages/Quiz.tsx` - Main entry point for the quiz feature, handles game creation and rendering
- `src/pages/SharedGame.tsx` - Displays shared games with unique IDs
- `src/pages/Home.tsx` - Landing page of the application

### Game Creation
- `src/components/quiz/CustomGameForm.tsx` - Form for creating custom AI-generated games
- `src/components/quiz/GameSettings.tsx` - Settings panel for game configuration
- `src/components/quiz/GameView.tsx` - Renders the actual game UI after generation

### AI Generation
- `src/components/quiz/generator/AIGameGenerator.ts` - Core class for handling game generation logic
- `src/components/quiz/generator/geminiGenerator.ts` - Integration with Gemini AI model
- `src/components/quiz/generator/promptBuilder.ts` - Creates prompts for the AI model
- `src/components/quiz/generator/responseParser.ts` - Parses AI responses into usable game content
- `src/components/quiz/generator/types.ts` - Type definitions for game generation

### UI Components
- `src/components/chat/ChatInterface.tsx` - Chat interface for interacting with the AI
- `src/components/ui/*` - Shadcn UI components used throughout the application

## File Organization

- `/src/pages` - Top-level page components
- `/src/components` - Reusable UI components
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and helpers
- `/src/utils` - Additional utility functions
