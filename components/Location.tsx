
import React from 'react';
import { PARTY_DATA } from '../constants';
import { MapPin, Navigation, Info } from 'lucide-react';

const Location: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-100 p-3 rounded-2xl text-green-700 shadow-sm">
          <MapPin size={28} />
        </div>
        <div>
            <h2 className="text-2xl font-display text-slate-800">Local da Expedição</h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Conjunto Ouro Verde</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed text-lg">
            Nossa base de exploradores será no <span className="font-bold text-green-700">{PARTY_DATA.location.name}</span>. 
            Identifique o prédio pela fachada mostrada ao lado!
          </p>
          
          <div className="p-6 bg-green-50/50 rounded-3xl border border-green-100 space-y-4">
            <div className="flex gap-3">
                <Info className="text-green-600 shrink-0" size={20} />
                <div className="text-sm text-green-800">
                    <p className="font-bold mb-1">Dica de Acesso:</p>
                    <p>O salão de festas fica dentro do condomínio. Avisar na portaria que você é convidado do **Lucca**.</p>
                </div>
            </div>
            <div className="pt-2 border-t border-green-200/50">
                <p className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Endereço Completo:</p>
                <p className="text-slate-600 text-sm leading-relaxed">{PARTY_DATA.location.address}</p>
            </div>
          </div>

          <a 
            href={PARTY_DATA.location.mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-green-200 w-full justify-center md:w-auto active:scale-95"
          >
            <Navigation size={20} />
            Iniciar Navegação GPS
          </a>
        </div>

        <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group">
                {/* Foto da fachada do condomínio */}
                <img 
                  src="/Fachada.png" 
                  alt="Fachada do Condomínio Ouro Verde"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Foto da Fachada do Condomínio</p>
                </div>
            </div>
            <p className="text-center text-xs text-slate-400 italic font-medium">Fácil localização no Capão Raso!</p>
        </div>
      </div>
    </div>
  );
};

export default Location;
