import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getCustomGame } from '@/utils/customGameExport';
import { CustomStoredGame } from '@/types/customGame';
import CustomGameReceiver from '@/components/quiz/custom-games/CustomGameReceiver';

const CustomGameSharePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const [game, setGame] = useState<CustomStoredGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) {
        setError('Game ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadedGame = await getCustomGame(gameId);
        
        if (!loadedGame) {
          setError('Game not found or expired');
          return;
        }

        setGame(loadedGame);
      } catch (err) {
        console.error('Error loading custom game:', err);
        setError('Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Game not found'}</p>
        </div>
      </div>
    );
  }

  return <CustomGameReceiver game={game} />;
};

export default CustomGameSharePage;