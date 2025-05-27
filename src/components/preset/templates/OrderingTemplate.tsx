
import React from 'react';
import ActualOrderingTemplate from '../../quiz/preset-games/templates/OrderingTemplate';

interface OrderingTemplateProps {
  content: any;
  topic: string;
}

const OrderingTemplate: React.FC<OrderingTemplateProps> = ({ content, topic }) => {
  return <ActualOrderingTemplate content={content} topic={topic} />;
};

export default OrderingTemplate;
