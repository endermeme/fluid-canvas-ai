
import React from 'react';
import BalloonPopGame from './BalloonPopGame';

interface BalloonPopTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const BalloonPopTemplate: React.FC<BalloonPopTemplateProps> = (props) => {
  return <BalloonPopGame {...props} />;
};

export default BalloonPopTemplate;
