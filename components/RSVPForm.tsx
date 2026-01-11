
import React, { useState, useEffect } from 'react';
import { GUEST_LIST, GUEST_PHOTOS } from '../constants';
import { CheckCircle2, UserCheck, Users, Search, Plus, X } from 'lucide-react';

const RSVPForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [companions, setCompanions] = useState<string[]>([]);
  const [step, setStep] = useState<'search' | 'confirm' | 'success'>('search');

  const filteredGuests = GUEST_LIST.filter(g => 
    g.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (name: string) => {
    setSelectedGuest(name);
    setCompanions([]);
    setStep('confirm');
  };

  // Escuta evento global para seleção a partir de outros componentes (ex: bolinhas no Hero)
  useEffect(() => {
    const handler = (e: any) => {
      const name = e?.detail ?? e; // compatibilidade
      if (typeof name === 'string') {
        setSelectedGuest(name);
        setCompanions([]);
        setStep('confirm');
        setSearchTerm('');
      }
    };

    window.addEventListener('selectGuest', handler as EventListener);
    return () => window.removeEventListener('selectGuest', handler as EventListener);
  }, []);

  const addCompanion = () => {
    if (companions.length < 4) {
      setCompanions([...companions, '']);
    }
  };

  const removeCompanion = (index: number) => {
    setCompanions(companions.filter((_, i) => i !== index));
  };

  const updateCompanion = (index: number, value: string) => {
    const updated = [...companions];
    updated[index] = value;
    setCompanions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalPeople = 1 + companions.filter(c => c.trim()).length;
    const companionsList = companions.filter(c => c.trim()).length > 0 
      ? '\n\nAcompanhantes:\n' + companions.filter(c => c.trim()).map((c, i) => `${i + 1}. ${c}`).join('\n')
      : '';
    
    // Criar mensagem personalizada para WhatsApp
    const message = `Olá! Sou *${selectedGuest}* e estou confirmando minha presença no Safari do Lucca! 🦁🎉\n\nTotal de pessoas: ${totalPeople}${companionsList}\n\nMal posso esperar para celebrar esse dia especial! 🎂`;
    
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

        {step === 'confirm' && selectedGuest && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Convidado com foto */}
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border-2 border-orange-200">
              {GUEST_PHOTOS[selectedGuest] ? (
                <img 
                  src={GUEST_PHOTOS[selectedGuest]} 
                  alt={selectedGuest}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                  {selectedGuest.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs text-orange-700 font-bold uppercase tracking-wider mb-1">Convidado Principal</p>
                <p className="text-2xl font-bold text-slate-800">{selectedGuest}</p>
              </div>
            </div>

            {/* Acompanhantes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700">Quem vai com você?</label>
                {companions.length < 4 && (
                  <button
                    type="button"
                    onClick={addCompanion}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold rounded-full transition-all text-sm"
                  >
                    <Plus size={16} />
                    Adicionar
                  </button>
                )}
              </div>

              {companions.length === 0 && (
                <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 rounded-xl">
                  Clique em "Adicionar" para incluir acompanhantes
                </p>
              )}

              {companions.map((companion, index) => (
                <div key={index} className="flex gap-3 items-center animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={companion}
                      onChange={(e) => updateCompanion(index, e.target.value)}
                      placeholder={`Nome do acompanhante ${index + 1}`}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCompanion(index)}
                    className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-all"
                    title="Remover"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              {/* Total de pessoas */}
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                <p className="text-sm text-green-700 font-semibold mb-1">Total de Pessoas</p>
                <p className="text-3xl font-bold text-green-600">
                  {1 + companions.filter(c => c.trim()).length}
                </p>
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
