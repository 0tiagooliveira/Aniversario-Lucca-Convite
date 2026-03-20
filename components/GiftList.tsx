
import React, { useState, useEffect } from 'react';
import { PARTY_DATA } from '../constants';
import { Gift, ExternalLink, Check, X } from 'lucide-react';

const GiftList: React.FC = () => {
  const [gifts, setGifts] = useState(PARTY_DATA.giftList);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  // Carregar presentes reservados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('giftReservations');
    if (saved) {
      const reservations = JSON.parse(saved);
      setGifts(prev => prev.map(gift => ({
        ...gift,
        reservedBy: reservations[gift.id]
      })));
    }
  }, []);

  const categories = ['Todos', ...Array.from(new Set(gifts.map(g => g.category).filter(Boolean)))];

  const filteredGifts = filterCategory === 'Todos' 
    ? gifts 
    : gifts.filter(g => g.category === filterCategory);

  const reserveGift = (giftId: string) => {
    if (!userName.trim()) {
      alert('Por favor, digite seu nome!');
      return;
    }

    const updated = gifts.map(g => 
      g.id === giftId ? { ...g, reservedBy: userName } : g
    );
    
    setGifts(updated);
    
    // Salvar no localStorage
    const reservations: Record<string, string> = {};
    updated.forEach(g => {
      if (g.reservedBy) reservations[g.id] = g.reservedBy;
    });
    localStorage.setItem('giftReservations', JSON.stringify(reservations));
    
    setSelectedGift(null);
    setUserName('');
  };

  const cancelReservation = (giftId: string) => {
    const updated = gifts.map(g => 
      g.id === giftId ? { ...g, reservedBy: undefined } : g
    );
    
    setGifts(updated);
    
    // Atualizar localStorage
    const reservations: Record<string, string> = {};
    updated.forEach(g => {
      if (g.reservedBy) reservations[g.id] = g.reservedBy;
    });
    localStorage.setItem('giftReservations', JSON.stringify(reservations));
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-xl text-purple-700">
          <Gift size={24} />
        </div>
        <h2 className="text-2xl font-display text-slate-800">Sugestões de Presentes</h2>
      </div>

      <p className="text-slate-600 mb-6 leading-relaxed">
        Sua presença é o nosso maior presente! Mas se você quiser mimar o Lucca com algum item da nossa expedição, aqui estão algumas ideias:
      </p>

      {/* Filtro de Categorias */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filterCategory === cat
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Presentes */}
      <div className="grid sm:grid-cols-2 gap-3">
        {filteredGifts.map((item) => (
          <div 
            key={item.id} 
            className={`p-4 rounded-2xl border-2 transition-all ${
              item.reservedBy
                ? 'bg-green-50 border-green-200'
                : 'bg-slate-50 border-slate-100 hover:border-purple-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-xl mt-0.5">
                  {item.reservedBy ? '✅' : '🎁'}
                </span>
                <div className="flex-1">
                  <span className="font-medium text-slate-700 block">{item.name}</span>
                  {item.category && (
                    <span className="text-xs text-slate-500 bg-white/50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
              {item.link !== "#" && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 mt-1">
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            {item.reservedBy ? (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-green-700 font-semibold">
                  🎉 {item.reservedBy} vai dar esse!
                </p>
                <button
                  onClick={() => cancelReservation(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Cancelar reserva"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSelectedGift(item.id)}
                className="mt-3 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md"
              >
                Vou dar esse! 🎁
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Confirmação */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Reservar Presente 🎁</h3>
            <p className="text-slate-600 mb-6">
              Digite seu nome para reservar este presente:
            </p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-purple-500 focus:outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => reserveGift(selectedGift)}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-full font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Confirmar
              </button>
              <button
                onClick={() => {
                  setSelectedGift(null);
                  setUserName('');
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-6 rounded-full font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100 text-center">
        <p className="text-purple-800 font-bold mb-2">💡 Dica de Tamanho</p>
        <p className="text-purple-700/80 text-sm">O Lucca veste tamanho 1-2 anos para roupas e calça número 22-24.</p>
      </div>
    </div>
  );
};

export default GiftList;
