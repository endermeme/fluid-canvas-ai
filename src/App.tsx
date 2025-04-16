
import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Shell from "@/components/layout/Shell";
import Home from "@/pages/Home";
import Docs from "@/pages/Docs";
import Pricing from "@/pages/Pricing";
import Quiz from "@/pages/Quiz";
import GameDashboard from "@/pages/GameDashboard";
import SharedGame from "@/components/quiz/share/SharedGame";
import GameHistory from "@/pages/GameHistory"; 
import PresetGamesPage from "@/components/quiz/preset-games/PresetGamesPage";
import CustomGame from "@/pages/CustomGame";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <Shell />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "docs",
              element: <Docs />,
            },
            {
              path: "pricing",
              element: <Pricing />,
            },
          ],
        },
        {
          path: "/quiz",
          element: <Quiz />,
        },
        {
          path: "/game/:id/dashboard",
          element: <GameDashboard />,
        },
        {
          path: "/share/:id",
          element: <SharedGame />,
        },
        {
          path: "/game-history",
          element: <GameHistory />,
        },
        {
          path: "/preset-games",
          element: <PresetGamesPage />,
        },
        {
          path: "/custom-game",
          element: <CustomGame />,
        },
      ])}
    />
  );
}

export default App;
