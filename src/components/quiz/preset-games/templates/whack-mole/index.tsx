
import React from 'react';
import WhackMoleGame from './WhackMoleGame';

interface WhackMoleTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const WhackMoleTemplate: React.FC<WhackMoleTemplateProps> = (props) => {
  return <WhackMoleGame {...props} />;
};

export default WhackMoleTemplate;
