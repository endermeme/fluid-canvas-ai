
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import { cleanupExpiredGames } from './utils/gameExport';

import Index from './pages/Index';
import Quiz from './pages/Quiz';
import SharedGame from './pages/SharedGame';
import NotFound from './pages/NotFound';

// Create a separate component for the app content
// This ensures hooks are called within the proper component context
const AppContent = () => {
  React.useEffect(() => {
    // Clean up expired games when app loads
    cleanupExpiredGames();
    
    // Set up a regular cleanup interval
    const cleanupInterval = setInterval(() => {
      cleanupExpiredGames();
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden">
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/canvas" element={<Index />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/shared/:id" element={<SharedGame />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

// Main App component that wraps ThemeProvider around the AppContent
const App = () => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </ThemeProvider>
  );
};

export default App;
