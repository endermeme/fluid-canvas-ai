
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Interactive Quiz Platform</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create, share, and play interactive quizzes and games for education and fun
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link to="/quiz">Start Quiz</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/custom-game">Custom Games</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
