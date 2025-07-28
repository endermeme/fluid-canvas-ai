import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomGame } from '@/utils/customGameExport';
import { getPresetGame } from '@/utils/presetGameExport';
import CustomGameReceiver from '@/components/quiz/custom-games/CustomGameReceiver';
import PresetGameReceiver from '@/components/quiz/preset-games/PresetGameReceiver';

const UnifiedGamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameData, setGameData] = useState<any>(null);
  const [gameType, setGameType] = useState<'custom' | 'preset' | null>(null);
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
        
        // Try custom game first
        const customGame = await getCustomGame(gameId);
        if (customGame) {
          setGameData(customGame);
          setGameType('custom');
          setLoading(false);
          return;
        }

        // Try preset game if custom not found
        const presetGame = await getPresetGame(gameId);
        if (presetGame) {
          setGameData(presetGame);
          setGameType('preset');
          setLoading(false);
          return;
        }

        // Neither found
        setError('Game not found or expired');
        setLoading(false);
      } catch (err) {
        console.error('Error loading game:', err);
        setError('Failed to load game');
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

  if (error || !gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Game not found'}</p>
        </div>
      </div>
    );
  }

  // Render appropriate component based on detected type
  if (gameType === 'custom') {
    return <CustomGameReceiver game={gameData} />;
  } else if (gameType === 'preset') {
    return <PresetGameReceiver game={gameData} />;
  }

  return null;
};

export default UnifiedGamePage;