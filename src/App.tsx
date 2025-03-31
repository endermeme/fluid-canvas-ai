
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import { cleanupExpiredGames } from './utils/gameExport';
import axios from 'axios';

import Index from './pages/Index';
import Quiz from './pages/Quiz';
import SharedGame from './pages/SharedGame';
import NotFound from './pages/NotFound';

// Default API Key placeholder - will be prompted for replacement
const DEFAULT_CLAUDE_API_KEY = '';
const API_KEY_STORAGE_KEY = 'claude-api-key';

// Setup our proxy route handler
if (!window.proxyInitialized) {
  window.proxyInitialized = true;
  
  // Handle all API proxy requests
  const originalFetch = window.fetch;
  window.fetch = async function(input, init) {
    if (typeof input === 'string' && input === '/api/claude-proxy') {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const { prompt, apiKey } = body;
      
      try {
        // Make direct request to Claude API
        const response = await axios.post(
          'https://api.anthropic.com/v1/messages',
          {
            model: 'claude-3-sonnet-20240229',
            max_tokens: 4000,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            response_format: { type: "json_object" }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01'
            }
          }
        );

        // Return a synthesized response that matches our API
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            content: response.data.content[0].text
          })
        });
      } catch (error) {
        console.error("Proxy error:", error);
        return Promise.resolve({
          ok: false,
          status: error.response?.status || 500,
          json: async () => ({
            error: error.message
          })
        });
      }
    }
    
    // Pass through all other requests
    return originalFetch.apply(window, [input, init]);
  };
}

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
