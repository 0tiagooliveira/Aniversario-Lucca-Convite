import React, { useMemo, useState } from 'react';
import { GUEST_PHOTOS } from '../constants';
import { CheckCircle2, PartyPopper, Users, Search } from 'lucide-react';

type ConfirmationType = 'pending' | 'confirmed' | 'confirmedByFamily';

interface GuestStatus {
  type: ConfirmationType;
  by?: string;
}

interface EntryGateProps {
  statuses: Record<string, GuestStatus>;
  onConfirmEntry: (payload: { primaryGuest: string; familyGuests: string[] }) => void;
}

type Guest = { key: string; label: string };

const GUESTS: Guest[] = [
  { key: 'Marisa', label: 'Marisa' },
  { key: 'Cleide', label: 'Cleide' },
  { key: 'Tete', label: 'Teté' },
  { key: 'Wesley', label: 'Wesley' },
  { key: 'Luiza', label: 'Luiza' },
  { key: 'Geovana', label: 'Geovana' },
  { key: 'Bruno', label: 'Bruno' },
  { key: 'Silvana', label: 'Silvana' },
  { key: 'Cassiane', label: 'Cassiane' },
  { key: 'Arthur', label: 'Arthur' },
  { key: 'Raiane', label: 'Raiane' },
  { key: 'Alexandre', label: 'Alexandre' },
  { key: 'Felipe', label: 'Felipe' },
  { key: 'Monique', label: 'Monique' },
  { key: 'Rose', label: 'Rose' },
  { key: 'Antony', label: 'Antony' },
  { key: 'Lucas', label: 'Lucas' },
  { key: 'Gabriela', label: 'Gabriela' },
  { key: 'Rogerio', label: 'Rogério' },
  { key: 'Leandro', label: 'Leandro' },
  { key: 'Acedina', label: 'Acedina' },
  { key: 'Beth', label: 'Beth' },
  { key: 'Renato', label: 'Renato' },
  { key: 'Leonardo', label: 'Leonardo' },
  { key: 'Andreia', label: 'Andréia' },
  { key: 'Marido Andreia', label: 'Marido Andréia' },
  { key: 'Sabrina', label: 'Sabrina' },
  { key: 'Papai', label: 'Papai' },
  { key: 'Mamae', label: 'Mamãe' },
  { key: 'Anselmo', label: 'Anselmo' }
];

const PHOTO_KEYS: Record<string, string> = {
  Tete: 'Teté',
  Mamae: 'Mamãe',
  Andreia: 'Andréia',
  Rogerio: 'Rogério',
  Cassiane: 'Cassiane'
};

const FAMILY_GROUPS: string[][] = [
  ['Tete', 'Wesley', 'Cleide'],
  ['Geovana', 'Bruno'],
  ['Silvana', 'Cassiane', 'Rogerio', 'Alexandre', 'Raiane', 'Arthur'],
  ['Felipe', 'Monique'],
  ['Rose', 'Lucas', 'Gabriela', 'Leandro', 'Antony']
];

const getGuestLabel = (guestKey: string) => {
  return GUESTS.find((guest) => guest.key === guestKey)?.label || guestKey;
};

const statusLabel = (status?: GuestStatus) => {
  if (!status) return 'Aguardando confirmacao';
  if (status.type === 'confirmed') return 'Confirmou';
  if (status.type === 'confirmedByFamily' && status.by) return `Confirmado por ${getGuestLabel(status.by)}`;
  return 'Aguardando confirmacao';
};

const EntryGate: React.FC<EntryGateProps> = ({ statuses, onConfirmEntry }) => {
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [familyGoing, setFamilyGoing] = useState<boolean | null>(null);
  const [selectedFamilyGuests, setSelectedFamilyGuests] = useState<string[]>([]);
  const [extraGuestName, setExtraGuestName] = useState('');
  const [step, setStep] = useState<'selection' | 'success'>('selection');

  const filteredGuests = useMemo(() => {
    return GUESTS.filter((guest) => guest.label.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const selectedGuestData = useMemo(() => {
    if (!selectedGuest) return null;
    return GUESTS.find((guest) => guest.key === selectedGuest) || null;
  }, [selectedGuest]);

  const familyGroup = useMemo(() => {
    if (!selectedGuest) return [];
    const found = FAMILY_GROUPS.find((group) => group.includes(selectedGuest));
    if (!found) return [];
    return found.filter((member) => member !== selectedGuest);
  }, [selectedGuest]);

  const alreadyConfirmedFamily = useMemo(() => {
    return familyGroup.filter((member) => statuses[member]?.type !== 'pending');
  }, [familyGroup, statuses]);

  const toggleFamilyGuest = (name: string) => {
    setSelectedFamilyGuests((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const resetFlow = () => {
    setSelectedGuest(null);
    setFamilyGoing(null);
    setSelectedFamilyGuests([]);
    setExtraGuestName('');
  };

  const handleConfirm = () => {
    if (!selectedGuest) return;
    const familyGuests = familyGoing ? selectedFamilyGuests : [];
    setStep('success');
    setTimeout(() => {
      onConfirmEntry({ primaryGuest: selectedGuest, familyGuests });
    }, 2300);
  };

  const totalPeople =
    1 + (familyGoing && familyGroup.length > 0 ? selectedFamilyGuests.length : 0) + (extraGuestName.trim() ? 1 : 0);

  if (step === 'success' && selectedGuestData) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7e6,_#fde7c7_40%,_#f6f1e8)] px-4 py-8 md:py-12">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-[2rem] border border-orange-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(120,84,28,0.2)]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 42 }).map((_, index) => (
                <span
                  key={index}
                  className="absolute h-2 w-2 animate-[confetti-fall_1.8s_ease-in_forwards] rounded-sm"
                  style={{
                    left: `${(index * 13) % 100}%`,
                    top: '-10px',
                    backgroundColor: ['#fb923c', '#f59e0b', '#22c55e', '#38bdf8'][index % 4],
                    animationDelay: `${(index % 8) * 0.08}s`,
                    transform: `rotate(${index * 11}deg)`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={44} />
              </div>
              <h2 className="text-3xl font-display text-slate-800">Presenca confirmada!</h2>
              <p className="mt-3 text-slate-600">
                {selectedGuestData.label}, voce acabou de confirmar sua presenca no aniversario do Lucca. Que alegria ter voce nessa aventura! 🎉
              </p>
              <p className="mt-5 text-sm font-semibold text-orange-600">Abrindo o convite completo...</p>
            </div>
          </div>
        </div>

        <style>{`@keyframes confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(420px) rotate(540deg); opacity: 0; } }`}</style>
      </div>
    );
  }

  // Tela 1: Seleção de Guest
  if (!selectedGuest) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7e6,_#fde7c7_40%,_#f6f1e8)] px-4 py-8 md:py-12">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-[2rem] border border-orange-200/70 bg-white/90 shadow-[0_24px_80px_rgba(120,84,28,0.15)] backdrop-blur p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                <PartyPopper size={32} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">🎈 Aniversario do Lucca 🎉</p>
                <h1 className="mt-1 text-3xl md:text-4xl font-display text-slate-800">Confirme para Entrar</h1>
                <p className="mt-2 text-slate-600">
Precisamos da sua confirmacao para liberar o convite completo.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
                <label className="text-sm font-semibold text-slate-600">Encontre seu nome na lista oficial de convidados:</label>
                
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Digite seu nome..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                  {filteredGuests.map((guest) => {
                    const guestStatus = statuses[guest.key] ?? { type: 'pending' as ConfirmationType };
                    const photoKey = PHOTO_KEYS[guest.key] || guest.key;
                    const photo = GUEST_PHOTOS[photoKey] || GUEST_PHOTOS[guest.label];

                    return (
                      <button
                        key={guest.key}
                        onClick={() => {
                          setSelectedGuest(guest.key);
                          setFamilyGoing(null);
                          setSelectedFamilyGuests([]);
                          setExtraGuestName('');
                        }}
                        className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left transition-all hover:border-orange-300 hover:bg-orange-50"
                      >
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <img src={photo} alt={guest.label} className="h-11 w-11 rounded-full border-2 border-orange-200 object-cover" />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-orange-200 bg-orange-100 font-bold text-orange-700">
                              {guest.label.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800">{guest.label}</p>
                            <p className="text-xs text-slate-500">{statusLabel(guestStatus)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {guestStatus.type !== 'pending' && (
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700">
                              ✓ Confirmado
                            </span>
                          )}
                          <span className="text-sm font-semibold text-orange-500 opacity-0 transition-opacity group-hover:opacity-100">→</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela 2: Confirmação de Guest e Família
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7e6,_#fde7c7_40%,_#f6f1e8)] px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-[2rem] border border-orange-200/70 bg-white/90 shadow-[0_24px_80px_rgba(120,84,28,0.15)] backdrop-blur p-6 md:p-10">
          <div className="flex items-start gap-4 mb-8">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
              <PartyPopper size={32} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">🎈 Aniversario do Lucca 🎉</p>
              <h1 className="mt-1 text-3xl md:text-4xl font-display text-slate-800">Confirme sua Presenca</h1>
              <p className="mt-2 text-slate-600">Detalhes do convidado principal</p>
            </div>
            <button
              onClick={resetFlow}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-orange-300 hover:text-orange-600 whitespace-nowrap"
            >
              ← Voltar
            </button>
          </div>

          <div className="space-y-4">
            {selectedGuestData && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Convidado Principal</p>
                  <div className="mt-3 flex items-center gap-4">
                    {(() => {
                      const photoKey = PHOTO_KEYS[selectedGuestData.key] || selectedGuestData.key;
                      const photo = GUEST_PHOTOS[photoKey] || GUEST_PHOTOS[selectedGuestData.label];

                      if (photo) {
                        return (
                          <img
                            src={photo}
                            alt={selectedGuestData.label}
                            className="h-24 w-24 rounded-full border-4 border-orange-200 object-cover shadow-md"
                          />
                        );
                      }

                      return (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-200 bg-orange-100 text-4xl font-bold text-orange-700 shadow-md">
                          {selectedGuestData.label.charAt(0)}
                        </div>
                      );
                    })()}

                    <div>
                      <h2 className="text-3xl font-display text-slate-800">{selectedGuestData.label}</h2>
                      {(statuses[selectedGuestData.key]?.type ?? 'pending') !== 'pending' && (
                        <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          ✓ {statuses[selectedGuestData.key]?.type === 'confirmed' ? 'Confirmado' : `Confirmado por ${getGuestLabel(statuses[selectedGuestData.key]?.by || '')}` }
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Alguém vai com você para a festa do Lucca?
                    </p>
                    <button
                      onClick={resetFlow}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-orange-300 hover:text-orange-600"
                    >
                      Trocar convidado
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      onClick={() => setFamilyGoing(true)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        familyGoing ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => {
                        setFamilyGoing(false);
                        setSelectedFamilyGuests([]);
                        setExtraGuestName('');
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        familyGoing === false ? 'bg-slate-700 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Nao
                    </button>
                  </div>

                  {familyGoing && (
                    <div className="rounded-2xl border border-orange-200 bg-white p-3 mb-3">
                      <p className="text-sm font-semibold text-slate-700">Digite o nome de quem vai com você:</p>
                      {familyGroup.length > 0 && (
                        <>
                          <p className="mt-1 text-xs text-slate-500">Pessoas da sua família:</p>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {familyGroup.map((name) => {
                              const active = selectedFamilyGuests.includes(name);
                              const guestStatus = statuses[name];
                              const label = getGuestLabel(name);
                              const photoKey = PHOTO_KEYS[name] || name;
                              const photo = GUEST_PHOTOS[photoKey] || GUEST_PHOTOS[label];

                              return (
                                <button
                                  key={name}
                                  onClick={() => toggleFamilyGuest(name)}
                                  className={`rounded-xl border px-3 py-3 text-left transition-all ${
                                    active
                                      ? 'border-orange-400 bg-orange-50'
                                      : 'border-slate-200 bg-white hover:border-orange-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {photo ? (
                                      <img
                                        src={photo}
                                        alt={label}
                                        className="h-10 w-10 rounded-full border-2 border-orange-200 object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-200 bg-orange-100 font-bold text-orange-700">
                                        {label.charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-semibold text-slate-800">{label}</p>
                                      {guestStatus && guestStatus.type !== 'pending' && <p className="text-xs text-slate-500">{statusLabel(guestStatus)}</p>}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-3 text-xs font-semibold text-slate-600">Ou digite outro nome:</p>
                        </>
                      )}
                      <input
                        type="text"
                        value={extraGuestName}
                        onChange={(e) => setExtraGuestName(e.target.value)}
                        placeholder="Digite um nome..."
                        className="w-full mt-2 rounded-2xl border border-slate-200 bg-white py-3 px-4 text-slate-700 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
                    <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                      <Users size={18} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest">Total de Pessoas</p>
                        <p className="text-2xl font-bold leading-none">{totalPeople}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 md:justify-end">
                      <button
                        onClick={handleConfirm}
                        className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white shadow-md transition-all hover:bg-orange-600"
                      >
                        <CheckCircle2 size={18} />
                        Confirmar presenca!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export type { GuestStatus };
export default EntryGate;
