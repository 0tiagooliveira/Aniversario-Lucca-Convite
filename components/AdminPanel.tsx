import React, { useState, useEffect } from 'react';
import { GUEST_PHOTOS, GUEST_LIST, toGuestKey } from '../constants';
import { LogOut, Check, X, User } from 'lucide-react';

import { fetchGuests, addGuest, removeGuest, Guest } from '../guestService';

interface GuestStatus {
  type: 'pending' | 'confirmed' | 'confirmedByFamily';
  by?: string;
}

interface AdminPanelProps {
  statuses: Record<string, GuestStatus>;
  onStatusChange: (guestKey: string, newStatus: GuestStatus) => void;
  onLogout: () => void;
}

const PHOTO_KEYS: Record<string, string> = {
  Tete: 'Teté',
  Mamae: 'Mamãe',
  Andreia: 'Andréia',
  Rogerio: 'Rogério',
  Cassiane: 'Cassiane'
};


const AdminPanel: React.FC<AdminPanelProps> = ({ statuses, onStatusChange, onLogout }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGuests();
  }, []);

  async function loadGuests() {
    setLoading(true);
    const data = await fetchGuests();
    setGuests(data);
    setLoading(false);
  }

  async function handleAddGuest() {
    if (!newGuestName.trim()) return;
    await addGuest(newGuestName.trim());
    setNewGuestName('');
    await loadGuests();
  }

  async function handleRemoveGuest(id: string) {
    if (!window.confirm('Remover este convidado?')) return;
    await removeGuest(id);
    await loadGuests();
  }

  const getPhotoUrl = (guestName: string): string | null => {
    const photoKey = PHOTO_KEYS[guestName] || guestName;
    return GUEST_PHOTOS[photoKey] || GUEST_PHOTOS[guestName] || null;
  };

  const filteredGuests = guests.filter(({ id, name }) => {
    const key = toGuestKey(name);
    const status = statuses[key];
    const matchesSearch = name.toLowerCase().includes(searchFilter.toLowerCase());
    if (filterType === 'confirmed') return matchesSearch && !!status && status.type !== 'pending';
    if (filterType === 'pending') return matchesSearch && (!status || status.type === 'pending');
    return matchesSearch;
  });

  const confirmedCount = guests.filter(({ name }) => {
    const key = toGuestKey(name);
    const status = statuses[key];
    return !!status && status.type !== 'pending';
  }).length;
  const pendingCount = guests.length - confirmedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-purple-900">Painel de Controle</h1>
            <p className="text-purple-600 mt-2">Gerenciar confirmações da festa do Lucca</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold">CONFIRMADOS</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{confirmedCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-semibold">PENDENTES</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-semibold">TOTAL CONVIDADOS</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{guests.length}</p>
          </div>
        </div>

        {/* Filtros, busca e adicionar convidado */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar convidado..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${filterType === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType('confirmed')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${filterType === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Confirmados
              </button>
              <button
                onClick={() => setFilterType('pending')}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${filterType === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Pendentes
              </button>
            </div>
          </div>
          {/* Adicionar convidado */}
          <div className="flex flex-col md:flex-row gap-2 mt-4 items-center">
            <input
              type="text"
              value={newGuestName}
              onChange={e => setNewGuestName(e.target.value)}
              placeholder="Novo convidado"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddGuest}
              className="px-4 py-2 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all"
              disabled={loading || !newGuestName.trim()}
            >Adicionar</button>
          </div>
        </div>

        {/* Guest List */}
        <div className="grid gap-4">
          {filteredGuests.map(({ id, name }) => {
            const key = toGuestKey(name);
            const status = statuses[key];
            const photo = getPhotoUrl(name);
            const isConfirmed = !!status && status.type !== 'pending';

            return (
              <div key={id} className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${isConfirmed ? 'border-green-500' : 'border-yellow-500'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {photo ? (
                      <img src={photo} alt={name} className="h-16 w-16 rounded-full object-cover border-4 border-purple-200" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-purple-200 flex items-center justify-center text-2xl font-bold text-purple-700">
                        {name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                      <p className={`text-sm font-semibold mt-1 ${isConfirmed ? 'text-green-600' : 'text-yellow-600'}`}>
                        {isConfirmed ? (
                          status?.type === 'confirmed' 
                            ? '✓ Confirmado' 
                            : `✓ Confirmado por ${guests.find((g) => toGuestKey(g.name) === (status?.by || ''))?.name || status?.by}`
                        ) : (
                          '⏳ Aguardando confirmação'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onStatusChange(key, { type: 'confirmed' })}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${isConfirmed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-green-500 hover:text-white'}`}
                    >
                      <Check size={18} />
                      Confirmar
                    </button>
                    <button
                      onClick={() => onStatusChange(key, { type: 'pending' })}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${!isConfirmed ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-yellow-500 hover:text-white'}`}
                    >
                      <X size={18} />
                      Pendente
                    </button>
                    <button
                      onClick={() => id && handleRemoveGuest(id)}
                      className="px-4 py-2 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
                      title="Remover convidado"
                    >Remover</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredGuests.length === 0 && (
          <div className="text-center py-12">
            <User size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">Nenhum convidado encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
