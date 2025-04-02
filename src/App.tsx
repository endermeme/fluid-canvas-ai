
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import { cleanupExpiredGames } from './utils/gameExport';

import Index from './pages/Index';
import Quiz from './pages/Quiz';
import SharedGame from './pages/SharedGame';
import NotFound from './pages/NotFound';

const App = () => {
  useEffect(() => {
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
          <Route path="/" element={<Navigate to="/canvas" replace />} />
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
