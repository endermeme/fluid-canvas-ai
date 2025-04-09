
# AI Game Creator - Project Structure

This is a React application that allows users to create interactive educational games using AI.

## Key Files and Components

### Main Pages
- `src/pages/Home.tsx` - The landing page with app introduction
- `src/pages/Quiz.tsx` - Main game creation interface with AI
- `src/pages/SharedGame.tsx` - Page for viewing shared games

### Core Components
- `src/components/quiz/GameView.tsx` - Displays the generated game in fullscreen
- `src/components/quiz/GameSettings.tsx` - Settings UI for game configuration
- `src/components/quiz/QuizGenerator.tsx` - Core component that generates games using AI

### Custom Game Creation
- `src/components/quiz/custom-games/CustomGameForm.tsx` - Form for custom game creation
- `src/components/quiz/custom-games/GameController.tsx` - Controls game creation flow

### Preset Games System
- `src/components/quiz/preset-games/PresetGamesPage.tsx` - Main page for preset games
- `src/components/quiz/preset-games/GameSelector.tsx` - UI for selecting game types
- `src/components/quiz/preset-games/PresetGameManager.tsx` - Manages preset game generation and display

### Game Templates
- `src/components/quiz/preset-games/templates/` - Contains templates for different game types
- `src/components/quiz/preset-games/data/` - Contains sample data for different game types

### Game Generator
- `src/components/quiz/generator/AIGameGenerator.ts` - The main AI game generator class
- `src/components/quiz/generator/geminiGenerator.ts` - Integration with Google's Gemini AI
- `src/components/quiz/generator/responseParser.ts` - Parses responses from the AI
- `src/components/quiz/generator/promptBuilder.ts` - Builds prompts for the AI

### Game Types and Settings
- `src/components/quiz/types.ts` - Type definitions for games and settings
- `src/components/quiz/gameTypes.ts` - Predefined game types configuration

### Quick Game Selection
- `src/components/quiz/quick-game-selector/CustomGameForm.tsx` - Streamlined form for quick game creation
- `src/components/quiz/quick-game-selector/GameGrid.tsx` - Grid display of game options
- `src/components/quiz/quick-game-selector/CustomGameDialog.tsx` - Dialog for entering game topics

### Utilities
- `src/utils/gameExport.ts` - Handles game sharing functionality
- `src/hooks/useCanvasState.ts` - Manages canvas state for interactive elements
- `src/lib/animations.ts` - Animation utilities for UI elements

## User Flow
1. User has two main paths:
   - Custom game creation via Quiz page
   - Preset game selection via Preset Games page
2. For custom games:
   - User enters game details in the CustomGameForm
   - AI generates a custom game based on the user's input
3. For preset games:
   - User selects a game type from predefined options
   - User customizes game parameters and topic
   - AI generates a game based on the selected type and parameters
4. The game is displayed fullscreen in the GameView component
5. User can play, restart and share the game with others

## Features
- Direct game creation from the main interface
- Multiple game templates for different learning activities
- Game play count tracking for user engagement metrics
- AI-powered educational game generation using Google's Gemini
- Time management features including per-question timers, total game time, and bonus time
- Fullscreen game display for better user experience

## Technology Stack
- React
- React Router
- Tailwind CSS
- Shadcn/UI Components
- Google Gemini AI for game generation
