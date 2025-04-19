
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Quiz from '@/pages/Quiz';
import PresetGamesPage from '@/pages/PresetGamesPage';
import CustomGamesPage from '@/pages/CustomGamesPage';
import GameHistoryPage from '@/pages/GameHistoryPage';
import PlayGamePage from '@/pages/PlayGamePage';
import NotFoundPage from '@/pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/preset-games" element={<PresetGamesPage />} />
        <Route path="/custom-games" element={<CustomGamesPage />} />
        <Route path="/game-history" element={<GameHistoryPage />} />
        <Route path="/play/:type/:slug/:id" element={<PlayGamePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
