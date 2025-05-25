
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Quiz from './pages/Quiz';
import PresetGamesPage from './components/preset/PresetGamesPage';
import GameSharePage from './pages/GameSharePage';
import GameHistoryPage from './pages/GameHistoryPage';
import GameController from './components/custom/GameController';
import TeacherDashboard from './components/shared/TeacherDashboard';
import IframeTest from './pages/iframe-test';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/preset-games" element={<PresetGamesPage />} />
      <Route path="/game/:gameId" element={<GameSharePage />} />
      <Route path="/game/:gameType/:slug/:gameId" element={<GameSharePage />} />
      <Route path="/game-history" element={<GameHistoryPage />} />
      <Route path="/custom-game" element={<GameController />} />
      <Route path="/game/:gameId/dashboard" element={<TeacherDashboard />} />
      <Route path="/play/:gameType/:slug/:gameId/dashboard" element={<TeacherDashboard />} />
      <Route path="/iframe-test" element={<IframeTest />} />
    </Routes>
  );
}

export default App;
