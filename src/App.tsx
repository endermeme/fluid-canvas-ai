
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Quiz from './pages/Quiz';
import PresetGamesPage from './components/quiz/preset-games/PresetGamesPage';
import CustomGameSharePage from './pages/CustomGameSharePage';
import PresetGameSharePage from './pages/PresetGameSharePage';
import GameHistoryPage from './pages/GameHistoryPage';
import GameController from './components/quiz/custom-games/GameController';
import TeacherDashboard from './components/quiz/share/TeacherDashboard';
import GameDashboard from './components/quiz/share/GameDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/preset-games" element={<PresetGamesPage />} />
      <Route path="/custom-game/:gameId" element={<CustomGameSharePage />} />
      <Route path="/preset-game/:gameId" element={<PresetGameSharePage />} />
      <Route path="/game/:gameType/:slug/:gameId" element={<PresetGameSharePage />} />
      <Route path="/game-history" element={<GameHistoryPage />} />
      <Route path="/custom-game" element={<GameController />} />
      <Route path="/game/:gameId/dashboard" element={<GameDashboard />} />
      <Route path="/game/:gameId/teacher" element={<TeacherDashboard />} />
      <Route path="/play/:gameType/:slug/:gameId/dashboard" element={<GameDashboard />} />
    </Routes>
  );
}

export default App;
