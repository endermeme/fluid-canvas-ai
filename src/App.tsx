
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import { cleanupExpiredGames } from './utils/gameExport';

import Index from './pages/Index';
import Quiz from './pages/Quiz';
import SharedGame from './pages/SharedGame';
import NotFound from './pages/NotFound';

// Default API Key placeholder - will be prompted for replacement
const DEFAULT_CLAUDE_API_KEY = '';
const API_KEY_STORAGE_KEY = 'claude-api-key';

const App = () => {
  useEffect(() => {
    // Initialize Claude API key if not already set
    if (!localStorage.getItem(API_KEY_STORAGE_KEY)) {
      localStorage.setItem(API_KEY_STORAGE_KEY, DEFAULT_CLAUDE_API_KEY);
    }
    
    // Clean up expired games when app loads
    cleanupExpiredGames();
    
    // Set up a regular cleanup interval
    const cleanupInterval = setInterval(() => {
      cleanupExpiredGames();
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/quiz" replace />} />
          <Route path="/canvas" element={<Index />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/shared/:id" element={<SharedGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
