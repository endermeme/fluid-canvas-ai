
import React from 'react';
import { Card } from '@/components/ui/card';

interface HintPanelProps {
  firstBlock: string;
}

const HintPanel: React.FC<HintPanelProps> = ({ firstBlock }) => {
  return (
    <Card className="hint-panel">
      <p className="hint-text">
        Gợi ý: Khối đầu tiên phải là "<strong>{firstBlock}</strong>"
      </p>
    </Card>
  );
};

export default HintPanel;
