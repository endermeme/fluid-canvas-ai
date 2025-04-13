
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Quiz from './pages/Quiz';
import PresetGamesPage from './components/quiz/preset-games/PresetGamesPage';
import GameSharePage from './pages/GameSharePage';
import GameHistoryPage from './pages/GameHistoryPage';
import CustomGameCreator from './components/quiz/custom-games/CustomGameCreator';
import SharedGame from './pages/SharedGame';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/preset-games" element={<PresetGamesPage />} />
      <Route path="/game/:gameId" element={<GameSharePage />} />
      <Route path="/game-history" element={<GameHistoryPage />} />
      <Route path="/custom-game" element={<CustomGameCreator />} />
      <Route path="/share/:id" element={<SharedGame />} />
    </Routes>
  );
}

export default App;
