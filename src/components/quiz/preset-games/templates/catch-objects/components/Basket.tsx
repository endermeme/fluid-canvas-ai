
import React from 'react';

interface BasketProps {
  position: number;
  size: number;
}

const Basket: React.FC<BasketProps> = ({ position, size }) => {
  return (
    <div
      className="basket"
      style={{
        left: `${position}%`,
        width: `${size}px`,
      }}
    >
      <div className="basket-body">
        <div className="basket-handle"></div>
        🧺
      </div>
    </div>
  );
};

export default Basket;
