
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Quiz from './pages/Quiz';
import SharedGame from './pages/SharedGame';
import Home from './pages/Home';

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
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
