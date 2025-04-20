
import React from 'react';

interface PictionaryOptionsProps {
  options: string[];
  selectedOption: string | null;
  correctAnswer: string;
  onSelect: (option: string) => void;
}

const PictionaryOptions: React.FC<PictionaryOptionsProps> = ({
  options,
  selectedOption,
  correctAnswer,
  onSelect,
}) => {
  return (
    <div className="w-full max-w-md grid grid-cols-2 gap-2 mx-auto">
      {options.map((option: string, index: number) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className={`w-full p-3 text-center rounded-lg transition-colors ${
            selectedOption === option 
              ? selectedOption === correctAnswer
                ? 'bg-green-100 border-green-500 border'
                : 'bg-red-100 border-red-500 border'
              : selectedOption !== null && option === correctAnswer
                ? 'bg-green-100 border-green-500 border'
                : 'bg-secondary hover:bg-secondary/80 border-transparent border'
          }`}
          disabled={selectedOption !== null}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default PictionaryOptions;
