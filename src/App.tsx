
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Quiz from './pages/Quiz';
import PresetGamesPage from './components/quiz/preset-games/PresetGamesPage';
import GameSharePage from './pages/GameSharePage';
import GameHistoryPage from './pages/GameHistoryPage';
import SharedGame from './pages/SharedGame';
import TeacherDashboard from './components/quiz/share/TeacherDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/custom-game" element={<Quiz />} />
      <Route path="/preset-games" element={<PresetGamesPage />} />
      <Route path="/game/:gameId" element={<GameSharePage />} />
      <Route path="/game/:gameType/:slug/:gameId" element={<GameSharePage />} />
      <Route path="/game-history" element={<GameHistoryPage />} />
      <Route path="/quiz/shared/:id" element={<SharedGame />} />
      <Route path="/play/:gameId" element={<SharedGame />} />
      <Route path="/play/:gameType/:slug/:gameId" element={<SharedGame />} />
      <Route path="/game/:gameId/dashboard" element={<TeacherDashboard />} />
      <Route path="/play/:gameType/:slug/:gameId/dashboard" element={<TeacherDashboard />} />
    </Routes>
  );
}

export default App;
