
# Project Structure Documentation

## Core Components

### Quiz Pages
- `src/pages/Quiz.tsx` - Main quiz page that handles quick game creation
- `src/components/quiz/preset-games/PresetGamesPage.tsx` - Custom games with AI generation interface

### Game Generation
- `src/components/quiz/preset-games/CustomGameForm.tsx` - Form for creating custom games with AI
- `src/components/quiz/generator/AIGameGenerator.ts` - AI integration for game generation
- `src/components/quiz/generator/geminiGenerator.ts` - Gemini API integration

### Game UI Components
- `src/components/quiz/GameView.tsx` - Displays the generated game
- `src/components/quiz/GameLoading.tsx` - Loading animation for game generation
- `src/components/quiz/GameError.tsx` - Error display for failed game generation

### Chat Interface
- `src/components/chat/ChatInterface.tsx` - Chat interface for interacting with AI

## Navigation and Layout
- `src/App.tsx` - Main routing component
- `src/pages/Home.tsx` - Home page with navigation to game creation

## Game Templates
- `src/components/quiz/preset-games/templates/` - Different game templates (Quiz, Flashcards, etc.)
