import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[999] bg-[#5a7a4a] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 animate-bounce">
          <span className="text-8xl">🦁</span>
        </div>
        <h2 className="text-3xl font-display text-white mb-4">Safari do Lucca</h2>
        <div className="flex gap-2 justify-center">
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
