import React, { useState, useEffect } from 'react';
import { GUEST_PHOTOS } from '../constants';
import { Camera, X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const GuestGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ name: string; photo: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filtrar apenas convidados com fotos
  const guestsWithPhotos = Object.entries(GUEST_PHOTOS).map(([name, photo]) => ({
    name,
    photo
  }));

  // Auto-play do carrossel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % guestsWithPhotos.length);
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying, guestsWithPhotos.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % guestsWithPhotos.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + guestsWithPhotos.length) % guestsWithPhotos.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl text-blue-700">
            <Camera size={24} />
          </div>
          <h2 className="text-2xl font-display text-slate-800">Galeria dos Convidados</h2>
        </div>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="p-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 transition-all"
          title={isAutoPlaying ? "Pausar" : "Reproduzir"}
        >
          {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      <p className="text-slate-600 mb-8 leading-relaxed">
        Conheça quem vai fazer parte dessa aventura no Safari do Lucca! 🦁
      </p>

      {/* Carrossel Principal */}
      <div className="relative mb-8 bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl overflow-hidden shadow-xl">
        <div className="aspect-[4/3] md:aspect-video relative">
          {/* Imagem Atual */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative max-w-md w-full">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
                <img
                  src={guestsWithPhotos[currentIndex].photo}
                  alt={guestsWithPhotos[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Nome */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-orange-200 whitespace-nowrap">
                <p className="text-xl font-bold text-slate-800">{guestsWithPhotos[currentIndex].name}</p>
              </div>
            </div>
          </div>

          {/* Botões de Navegação */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          >
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          >
            <ChevronRight size={24} className="text-slate-700" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 p-6">
          {guestsWithPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-orange-500'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grid de Miniaturas */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-700 mb-4">Todos os Convidados</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
          {guestsWithPhotos.map(({ name, photo }, index) => (
            <button
              key={name}
              onClick={() => setCurrentIndex(index)}
              className={`group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 ${
                index === currentIndex ? 'ring-4 ring-orange-400' : ''
              }`}
            >
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay com nome ao passar o mouse */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                <span className="text-white text-[8px] md:text-[10px] font-bold truncate w-full text-center">
                  {name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contador de Convidados */}
      <div className="p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl border border-orange-100 text-center">
        <p className="text-sm text-slate-600 mb-1">Total de Convidados Especiais</p>
        <p className="text-3xl font-bold text-orange-600">{guestsWithPhotos.length}</p>
        <p className="text-xs text-slate-500 mt-1">
          Mostrando {currentIndex + 1} de {guestsWithPhotos.length}
        </p>
      </div>
    </div>
  );
};

export default GuestGallery;
