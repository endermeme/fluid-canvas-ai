
import React from 'react';
import CatchObjectsGame from './CatchObjectsGame';

interface CatchObjectsTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const CatchObjectsTemplate: React.FC<CatchObjectsTemplateProps> = (props) => {
  return <CatchObjectsGame {...props} />;
};

export default CatchObjectsTemplate;
