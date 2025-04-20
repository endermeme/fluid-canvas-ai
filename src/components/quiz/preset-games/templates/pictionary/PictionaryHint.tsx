
import React from 'react';

interface PictionaryHintProps {
  hint: string;
  show: boolean;
}

const PictionaryHint: React.FC<PictionaryHintProps> = ({ hint, show }) => {
  if (!show) return null;

  return (
    <div className="mb-4 p-3 bg-primary/10 rounded-lg text-center max-w-md mx-auto">
      <p className="font-medium">Gợi ý:</p>
      <p>{hint}</p>
    </div>
  );
};

export default PictionaryHint;
