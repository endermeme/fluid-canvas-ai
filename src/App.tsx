
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Quiz from './pages/Quiz';
import SharedGame from './pages/SharedGame';
import Home from './pages/Home';
import PresetGamesPage from './components/quiz/preset-games/PresetGamesPage';

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/quiz/shared/:gameId" element={<SharedGame />} />
      <Route path="/preset-games" element={<PresetGamesPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
