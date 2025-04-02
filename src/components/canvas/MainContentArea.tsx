
import React from 'react';
import CanvasContainer from './CanvasContainer';
import QuickGameOptions from '../games/QuickGameOptions';
import { EDUCATIONAL_GAME_OPTIONS } from '@/constants/gameOptions';

const MainContentArea: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <CanvasContainer />
      </div>
      <QuickGameOptions options={EDUCATIONAL_GAME_OPTIONS} />
    </div>
  );
};

export default MainContentArea;
