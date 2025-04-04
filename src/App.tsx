
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import { cleanupExpiredGames } from './utils/gameExport';
import APIKeyButton from './components/APIKeyButton';

// Lazy load các trang để tối ưu hiệu suất
const Index = lazy(() => import('./pages/Index'));
const Quiz = lazy(() => import('./pages/Quiz'));
const SharedGame = lazy(() => import('./pages/SharedGame'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Fallback khi đang tải các trang
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-pulse text-primary">Đang tải...</div>
  </div>
);

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
      <APIKeyButton />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/canvas" element={<Index />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/shared/:id" element={<SharedGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

// Sử dụng memo để tránh render lại khi không cần thiết
const App = React.memo(() => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </ThemeProvider>
  );
});

export default App;
