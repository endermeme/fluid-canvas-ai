
# AI Game Creator - Project Structure

This is a React application that allows users to create interactive educational games using AI.

## Key Files and Components

### Main Pages
- `src/pages/Home.tsx` - The landing page with app introduction
- `src/pages/Quiz.tsx` - Main game creation interface with AI (redesigned with direct game creation)
- `src/pages/SharedGame.tsx` - Page for viewing shared games

### Core Components
- `src/components/quiz/QuizGenerator.tsx` - Core component that generates games using AI
- `src/components/quiz/GameView.tsx` - Displays the generated game in fullscreen
- `src/components/quiz/preset-games/CustomGameForm.tsx` - Form for custom game creation

### Game Generator
- `src/components/quiz/generator/AIGameGenerator.ts` - The main AI game generator class
- `src/components/quiz/generator/geminiGenerator.ts` - Integration with Google's Gemini AI
- `src/components/quiz/generator/responseParser.ts` - Parses responses from the AI
- `src/components/quiz/generator/promptBuilder.ts` - Builds prompts for the AI

### Utilities
- `src/utils/gameExport.ts` - Handles game sharing functionality
- `src/hooks/useCanvasState.ts` - Manages canvas state for interactive elements
- `src/lib/animations.ts` - Animation utilities for UI elements

## User Flow
1. User visits the Quiz page
2. User enters game details in the CustomGameForm
3. AI generates a custom game based on the user's input
4. The game is displayed fullscreen in the GameView component
5. User can play and share the game with others

## Features
- Direct game creation from the main interface
- Canvas mode always enabled for better visuals
- Intuitive UI with guidance on how to create effective games
- AI-powered educational game generation using Google's Gemini
- Fullscreen game display for better user experience

## Technology Stack
- React
- React Router
- Tailwind CSS
- Shadcn/UI Components
- Google Gemini AI for game generation
