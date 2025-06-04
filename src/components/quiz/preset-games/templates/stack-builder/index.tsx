
import React from 'react';
import StackBuilderGame from './StackBuilderGame';

interface StackBuilderTemplateProps {
  data?: any;
  content?: any;
  topic: string;
  onBack?: () => void;
  onShare?: () => void;
}

const StackBuilderTemplate: React.FC<StackBuilderTemplateProps> = (props) => {
  return <StackBuilderGame {...props} />;
};

export default StackBuilderTemplate;
