
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Quiz from './pages/Quiz';
import SharedGame from './pages/SharedGame';
import Home from './pages/Home';
import PresetGamesPage from './components/quiz/preset-games/PresetGamesPage';
import NotFound from './pages/NotFound';
import ShareGamePage from './components/quiz/share/ShareGamePage';
import GameDashboard from './components/quiz/share/GameDashboard';
import GameHistory from './components/quiz/share/GameHistory';

// Create a browser router instead of using BrowserRouter component
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/quiz",
    element: <Quiz />
  },
  {
    path: "/quiz/shared/:id",
    element: <SharedGame />
  },
  {
    path: "/preset-games",
    element: <PresetGamesPage />
  },
  {
    path: "/game/:gameId",
    element: <ShareGamePage />
  },
  {
    path: "/game/:gameId/dashboard",
    element: <GameDashboard />
  },
  {
    path: "/game-history",
    element: <GameHistory />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
