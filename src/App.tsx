
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';

import Index from './pages/Index';
import Quiz from './pages/Quiz';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
