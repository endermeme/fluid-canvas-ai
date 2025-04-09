
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Quiz from './pages/Quiz';
import SharedGame from './pages/SharedGame';
import Home from './pages/Home';
import PresetGamesPage from './components/quiz/preset-games/PresetGamesPage';
import NotFound from './pages/NotFound';

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
    path: "/quiz/shared/:gameId",
    element: <SharedGame />
  },
  {
    path: "/preset-games",
    element: <PresetGamesPage />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
