
import React, { useRef, useEffect, useState } from 'react';
import { PARTY_DATA } from '../constants';
import FloatingBubbles from './FloatingBubbles';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, centerX: 0, centerY: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
          centerX: rect.width / 2,
          centerY: rect.height / 2
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative h-[70vh] min-h-[550px] overflow-hidden bg-[#5a7a4a] flex items-center justify-center text-white"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/leaf.png")' }}></div>

      {/* Bolinhas com física espalhadas pela tela */}
      {dimensions.width > 0 && (
        <FloatingBubbles
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
        />
      )}

      <div className="text-center z-30 px-4 flex flex-col items-center pointer-events-none relative">
        {/* Photo Container */}
        <div className="relative mb-8 group">
          {/* Foto do Lucca no centro */}
          <div className="absolute -inset-4 bg-orange-400/30 rounded-full blur-xl animate-pulse"></div>
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-slate-200">
            {/* Foto do Lucca */}
            <img 
              src="/Lucca.png" 
              alt="Lucca" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Badge 1 ano fora do círculo, na parte inferior */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-2 rounded-full flex items-center gap-1 font-bold shadow-lg">
            <span className="text-xl">🎂</span>
            <span className="text-sm whitespace-nowrap">1 ano</span>
          </div>
        </div>

        <div className="inline-block mb-4 px-8 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-bold tracking-[0.2em] text-xs uppercase shadow-xl">
          Exploração de Aniversário
        </div>
        <h1 className="text-5xl md:text-7xl font-display mb-2 drop-shadow-2xl">Safari do {PARTY_DATA.celebrant}</h1>
        <p className="text-xl md:text-2xl font-medium opacity-90 mb-6 italic">Meu Primeiro Aninho de Aventuras!</p>
        <div className="w-32 h-1.5 bg-orange-400 mx-auto rounded-full shadow-inner"></div>
      </div>

      {/* Decorative Jungle Leaves Bottom */}
      <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 pointer-events-none opacity-40">
        <span className="text-8xl -mb-6">🌿</span>
        <span className="text-8xl -mb-6">🍃</span>
        <span className="text-8xl -mb-6">🌿</span>
      </div>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-1">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 fill-[#fdfbf7]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,147.3,126,211.55,108.66Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
