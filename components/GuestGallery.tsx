import React, { useState } from 'react';
import { GUEST_PHOTOS } from '../constants';
import { Camera, X } from 'lucide-react';

const GuestGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ name: string; photo: string } | null>(null);

  // Filtrar apenas convidados com fotos
  const guestsWithPhotos = Object.entries(GUEST_PHOTOS).map(([name, photo]) => ({
    name,
    photo
  }));

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-xl text-blue-700">
          <Camera size={24} />
        </div>
        <h2 className="text-2xl font-display text-slate-800">Galeria dos Convidados</h2>
      </div>

      <p className="text-slate-600 mb-8 leading-relaxed">
        Conheça quem vai fazer parte dessa aventura no Safari do Lucca! 🦁
      </p>

      {/* Grid de Fotos */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {guestsWithPhotos.map(({ name, photo }) => (
          <button
            key={name}
            onClick={() => setSelectedPhoto({ name, photo })}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay com nome ao passar o mouse */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <span className="text-white text-xs font-bold truncate w-full text-center">
                {name}
              </span>
            </div>
            {/* Borda animada */}
            <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-orange-400 transition-all rounded-2xl"></div>
          </button>
        ))}
      </div>

      {/* Contador de Convidados */}
      <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl border border-orange-100 text-center">
        <p className="text-sm text-slate-600 mb-1">Total de Convidados Especiais</p>
        <p className="text-3xl font-bold text-orange-600">{guestsWithPhotos.length}</p>
      </div>

      {/* Modal de Visualização */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-2xl w-full animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-600 hover:bg-orange-500 hover:text-white transition-all z-10 hover:rotate-90"
            >
              <X size={24} />
            </button>
            
            {/* Card da Foto */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-square max-h-[70vh]">
                <img 
                  src={selectedPhoto.photo} 
                  alt={selectedPhoto.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center bg-gradient-to-b from-white to-orange-50">
                <h3 className="text-3xl font-bold text-slate-800 mb-2">{selectedPhoto.name}</h3>
                <p className="text-slate-500">Convidado Especial 🎉</p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                    Safari do Lucca 🦁
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestGallery;
