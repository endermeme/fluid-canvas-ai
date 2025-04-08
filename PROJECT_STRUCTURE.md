
# AI Game Creator - Project Structure

This is a React application that allows users to create interactive educational games using AI.

## Key Files and Components

### Main Pages
- `src/pages/Home.tsx` - The landing page with app introduction
- `src/pages/Quiz.tsx` - Main game creation interface with AI
- `src/pages/SharedGame.tsx` - Page for viewing shared games

### Core Components
- `src/components/quiz/QuizGenerator.tsx` - Core component that generates games using AI
- `src/components/quiz/GameView.tsx` - Displays the generated game
- `src/components/chat/ChatInterface.tsx` - Chat interface for interacting with the AI

### Utilities
- `src/utils/gameExport.ts` - Handles game sharing functionality
- `src/hooks/useCanvasState.ts` - Manages canvas state for interactive elements

## User Flow
1. User visits the Quiz page
2. User clicks "Create Custom Game" to open the chat interface
3. User types a topic or game request
4. AI generates a custom game based on the user's input
5. The game is displayed in the game view
6. User can share the game with others

## Technology Stack
- React
- React Router
- Tailwind CSS
- Shadcn/UI Components
- Google Gemini AI for game generation
