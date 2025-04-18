import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizPage from './pages/QuizPage';
import PresetGamesPage from './pages/PresetGamesPage';
import SharedGame from './components/quiz/custom-games/SharedGame';
import CustomGame from './pages/CustomGame';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/preset-games" element={<PresetGamesPage />} />
        <Route path="/game/:id" element={<SharedGame />} />
        <Route path="/play/:gameType/:slug/:gameId" element={<SharedGame />} />
		<Route path="/play/custom-game/:slug/:gameId" element={<SharedGame />} />
        <Route path="/custom-game" element={<CustomGame />} />
      </Routes>
    </Router>
  );
};

export default App;
