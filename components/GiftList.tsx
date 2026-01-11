
import React from 'react';
import { PARTY_DATA } from '../constants';
import { Gift, ExternalLink } from 'lucide-react';

const GiftList: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-xl text-purple-700">
          <Gift size={24} />
        </div>
        <h2 className="text-2xl font-display text-slate-800">Sugestões de Presentes</h2>
      </div>

      <p className="text-slate-600 mb-8 leading-relaxed">
        Sua presença é o nosso maior presente! Mas se você quiser mimar o Lucca com algum item da nossa expedição, aqui estão algumas ideias:
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {PARTY_DATA.giftList.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <span className="font-medium text-slate-700">{item.name}</span>
            </div>
            {item.link !== "#" && (
              <a href={item.link} className="text-purple-500 hover:text-purple-700">
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100 text-center">
        <p className="text-purple-800 font-bold mb-2">💡 Dica de Tamanho</p>
        <p className="text-purple-700/80 text-sm">O Lucca veste tamanho 6 para roupas e calça número 28.</p>
      </div>
    </div>
  );
};

export default GiftList;
