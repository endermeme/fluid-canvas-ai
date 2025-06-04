
import React from 'react';
import SpinWheelGame from './SpinWheelGame';

interface SpinWheelTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const SpinWheelTemplate: React.FC<SpinWheelTemplateProps> = (props) => {
  return <SpinWheelGame {...props} />;
};

export default SpinWheelTemplate;
