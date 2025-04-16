
import React from 'react';

const Docs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Documentation</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to use our quiz platform with these helpful guides.
        </p>
        <div className="prose max-w-none">
          <h2>Getting Started</h2>
          <p>This page contains documentation about the quiz platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Docs;
