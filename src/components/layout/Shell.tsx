
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Shell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background/90 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Quiz App
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/docs" className="hover:text-primary transition-colors">
              Docs
            </Link>
            <Link to="/pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/quiz" className="hover:text-primary transition-colors">
              Quiz
            </Link>
            <Link to="/custom-game" className="hover:text-primary transition-colors">
              Custom Game
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Quiz App
        </div>
      </footer>
    </div>
  );
};

export default Shell;
