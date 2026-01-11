
import React, { useState, useEffect } from 'react';
import { GUEST_LIST, GUEST_PHOTOS } from '../constants';
import { CheckCircle2, UserCheck, Users, Search } from 'lucide-react';

const RSVPForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [step, setStep] = useState<'search' | 'confirm' | 'success'>('search');

  const filteredGuests = GUEST_LIST.filter(g => 
    g.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (name: string) => {
    setSelectedGuest(name);
    setStep('confirm');
  };

  // Escuta evento global para seleção a partir de outros componentes (ex: bolinhas no Hero)
  useEffect(() => {
    const handler = (e: any) => {
      const name = e?.detail ?? e; // compatibilidade
      if (typeof name === 'string') {
        setSelectedGuest(name);
        setStep('confirm');
        setSearchTerm('');
      }
    };

    window.addEventListener('selectGuest', handler as EventListener);
    return () => window.removeEventListener('selectGuest', handler as EventListener);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar mensagem personalizada para WhatsApp
    const message = `Olá! Sou *${selectedGuest}* e estou confirmando minha presença no Safari do Lucca! 🦁🎉\n\nNúmero de pessoas: ${guestCount}\n\nMal posso esperar para celebrar esse dia especial! 🎂`;
    
    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir WhatsApp em nova aba
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5541998263223&text=${encodedMessage}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
    
    setStep('success');
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
      <div className="bg-orange-500 p-6 text-white">
        <div className="flex items-center gap-3">
          <UserCheck size={28} />
          <h2 className="text-2xl font-display">Confirmar Presença</h2>
        </div>
        <p className="opacity-90 text-sm mt-1">Sua confirmação é essencial para a nossa expedição!</p>
      </div>

      <div className="p-6 md:p-8">
        {step === 'search' && (
          <div className="space-y-4">
            <p className="text-slate-600">Encontre seu nome na lista oficial de convidados:</p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Digite seu nome..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredGuests.length > 0 ? (
                filteredGuests.map(name => (
                  <button
                    key={name}
                    onClick={() => handleSelect(name)}
                    className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-orange-300 hover:bg-orange-50 transition-all font-medium text-slate-700 flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-3">
                      {GUEST_PHOTOS[name] ? (
                        <img 
                          src={GUEST_PHOTOS[name]} 
                          alt={name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-orange-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-orange-200">
                          {name.charAt(0)}
                        </div>
                      )}
                      <span>{name}</span>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 text-orange-500 text-sm">Selecionar →</span>
                  </button>
                ))
              ) : (
                <p className="text-center py-8 text-slate-400 italic">Nenhum convidado encontrado.</p>
              )}
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl">
              <div className="bg-orange-500 text-white p-2 rounded-full">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-orange-700 font-bold uppercase tracking-wider">Convidado Selecionado</p>
                <p className="text-lg font-bold text-slate-800">{selectedGuest}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-slate-700">Quantas pessoas virão com você?</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      guestCount === num 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => setStep('search')}
                className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
              >
                Voltar
              </button>
              <button 
                type="submit"
                className="flex-[2] py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-orange-200"
              >
                Confirmar Expedição!
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="py-10 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-display text-slate-800">Presença Confirmada!</h3>
            <p className="text-slate-600 max-w-xs mx-auto">
              Oba! {selectedGuest}, estamos muito felizes que você virá ao Safari do Lucca! 🦒
            </p>
            <button 
              onClick={() => {
                setStep('search');
                setSelectedGuest(null);
                setSearchTerm('');
              }}
              className="mt-6 text-orange-600 font-bold hover:underline"
            >
              Confirmar para outra pessoa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RSVPForm;
