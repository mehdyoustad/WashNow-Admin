'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Washer = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  rating: number;
  missions_done: number;
  status: 'actif' | 'en_attente' | 'suspendu';
  online: boolean;
  zones: string[];
  specialties: string[];
  acceptance_rate: number;
  created_at: string;
  iban?: string;
};

const MOCK_WASHERS: Washer[] = [
  { id: 'w1', full_name: 'Thomas D.', phone: '+33 6 98 76 54 32', email: 'thomas.d@gmail.com', rating: 4.9, missions_done: 127, status: 'actif', online: true, zones: ['Paris 75', 'Seine-Saint-Denis 93'], specialties: ['Lavage complet', 'Lustrage'], acceptance_rate: 94, created_at: '2024-01-15', iban: 'FR76 3000...' },
  { id: 'w2', full_name: 'Karim B.', phone: '+33 6 12 34 56 78', email: 'karim.b@gmail.com', rating: 4.7, missions_done: 89, status: 'actif', online: true, zones: ['Hauts-de-Seine 92'], specialties: ['Lavage extérieur', 'Nano-céramique'], acceptance_rate: 88, created_at: '2024-02-20', iban: 'FR76 1234...' },
  { id: 'w3', full_name: 'Sarah M.', phone: '+33 6 55 44 33 22', email: 'sarah.m@gmail.com', rating: 4.5, missions_done: 34, status: 'actif', online: false, zones: ['Val-de-Marne 94'], specialties: ['Lavage complet', 'Lavage intérieur'], acceptance_rate: 91, created_at: '2024-03-10', iban: 'FR76 5678...' },
  { id: 'w4', full_name: 'Rayan H.', phone: '+33 6 77 88 99 00', email: 'rayan.h@gmail.com', rating: 0, missions_done: 0, status: 'en_attente', online: false, zones: ['Paris 75'], specialties: ['Lavage extérieur'], acceptance_rate: 0, created_at: '2024-03-18', iban: '' },
  { id: 'w5', full_name: 'Lucas V.', phone: '+33 6 11 22 33 44', email: 'lucas.v@gmail.com', rating: 3.8, missions_done: 12, status: 'suspendu', online: false, zones: ['Seine-et-Marne 77'], specialties: ['Lavage complet'], acceptance_rate: 60, created_at: '2024-01-05', iban: 'FR76 9999...' },
];

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  actif: { bg: '#e8faf0', color: '#00c853', label: '✅ Actif' },
  en_attente: { bg: '#fff8e6', color: '#cc8800', label: '⏳ En attente' },
  suspendu: { bg: '#fff0f0', color: '#cc3333', label: '🚫 Suspendu' },
};

export default function Laveurs() {
  const [washers, setWashers] = useState<Washer[]>(MOCK_WASHERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'actif' | 'en_attente' | 'suspendu'>('all');
  const [filterOnline, setFilterOnline] = useState(false);
  const [selected, setSelected] = useState<Washer | null>(null);

  const filtered = washers.filter(w => {
    const matchSearch = w.full_name.toLowerCase().includes(search.toLowerCase()) || w.zones.join('').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || w.status === filterStatus;
    const matchOnline = !filterOnline || w.online;
    return matchSearch && matchStatus && matchOnline;
  });

  const stats = {
    total: washers.length,
    actif: washers.filter(w => w.status === 'actif').length,
    online: washers.filter(w => w.online).length,
    pending: washers.filter(w => w.status === 'en_attente').length,
  };

  const updateStatus = (id: string, status: Washer['status']) => {
    setWashers(prev => prev.map(w => w.id === id ? { ...w, status } : w));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const validateWasher = (id: string) => {
    updateStatus(id, 'actif');
    alert('Laveur validé et notifié par email.');
  };

  return (
    <div>
      {/* Stats top */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total laveurs', value: stats.total, icon: '🧽', color: '#1a6bff' },
          { label: 'Actifs', value: stats.actif, icon: '✅', color: '#00c853' },
          { label: 'En ligne', value: stats.online, icon: '🟢', color: '#00c853' },
          { label: 'En attente validation', value: stats.pending, icon: '⏳', color: '#cc8800' },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a' }}>{s.value}</div>
              </div>
              <div style={{ fontSize: 24 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* Table */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {/* Filtres */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Rechercher un laveur ou une zone..."
              style={{ flex: 1, minWidth: 220, border: '1.5px solid #e8e8e8', borderRadius: 10, padding: '9px 14px', fontSize: 13, outline: 'none' }}
            />
            {(['all', 'actif', 'en_attente', 'suspendu'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '8px 16px', borderRadius: 20, border: '1.5px solid',
                borderColor: filterStatus === s ? '#1a6bff' : '#e8e8e8',
                backgroundColor: filterStatus === s ? '#e8f0ff' : 'white',
                color: filterStatus === s ? '#1a6bff' : '#666',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
                {s === 'all' ? 'Tous' : STATUS_COLORS[s].label}
              </button>
            ))}
            <button onClick={() => setFilterOnline(!filterOnline)} style={{
              padding: '8px 16px', borderRadius: 20, border: '1.5px solid',
              borderColor: filterOnline ? '#00c853' : '#e8e8e8',
              backgroundColor: filterOnline ? '#e8faf0' : 'white',
              color: filterOnline ? '#00c853' : '#666',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              🟢 En ligne seulement
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
                {['Laveur', 'Zones', 'Note', 'Missions', 'Taux accept.', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id} onClick={() => setSelected(w === selected ? null : w)} style={{ borderBottom: '1px solid #f5f5f5', cursor: 'pointer', backgroundColor: selected?.id === w.id ? '#f0f5ff' : 'transparent' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#00c853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>{w.full_name[0]}</div>
                        {w.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, backgroundColor: '#00c853', borderRadius: '50%', border: '2px solid white' }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{w.full_name}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{w.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 12, color: '#555' }}>{w.zones.join(', ')}</td>
                  <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 700, color: '#FFB800' }}>
                    {w.rating > 0 ? `⭐ ${w.rating}` : '—'}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 600 }}>{w.missions_done}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 60, height: 6, backgroundColor: '#f5f5f5', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${w.acceptance_rate}%`, height: '100%', backgroundColor: w.acceptance_rate >= 80 ? '#00c853' : w.acceptance_rate >= 60 ? '#ff9800' : '#cc3333', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{w.acceptance_rate}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ backgroundColor: STATUS_COLORS[w.status].bg, color: STATUS_COLORS[w.status].color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {STATUS_COLORS[w.status].label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <select
                      value={w.status}
                      onChange={e => { e.stopPropagation(); updateStatus(w.id, e.target.value as Washer['status']); }}
                      onClick={e => e.stopPropagation()}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #e8e8e8', fontSize: 12, cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="actif">Activer</option>
                      <option value="en_attente">En attente</option>
                      <option value="suspendu">Suspendre</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <p>Aucun laveur trouvé</p>
            </div>
          )}
        </div>

        {/* Panneau détail */}
        {selected && (
          <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', alignSelf: 'start', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Détail laveur</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999' }}>✕</button>
            </div>

            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#00c853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 24, margin: '0 auto 8px' }}>{selected.full_name[0]}</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.full_name}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Membre depuis {new Date(selected.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div>
              <span style={{ display: 'inline-block', marginTop: 8, backgroundColor: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {STATUS_COLORS[selected.status].label}
                {selected.online && ' · 🟢 En ligne'}
              </span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Note', value: selected.rating > 0 ? `${selected.rating}⭐` : '—' },
                { label: 'Missions', value: selected.missions_done },
                { label: 'Acceptation', value: `${selected.acceptance_rate}%` },
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: '#f9f9f9', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1a6bff' }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Infos */}
            {[
              { label: 'Téléphone', value: selected.phone },
              { label: 'Email', value: selected.email },
              { label: 'IBAN', value: selected.iban || 'Non renseigné' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                <span style={{ color: '#999' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: '#0a0a0a' }}>{row.value}</span>
              </div>
            ))}

            {/* Zones & spécialités */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#999', fontWeight: 700, marginBottom: 6 }}>ZONES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.zones.map((z, i) => (
                  <span key={i} style={{ backgroundColor: '#e8f0ff', color: '#1a6bff', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{z}</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#999', fontWeight: 700, marginBottom: 6 }}>SPÉCIALITÉS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.specialties.map((s, i) => (
                  <span key={i} style={{ backgroundColor: '#e8faf0', color: '#00c853', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.status === 'en_attente' && (
                <button onClick={() => validateWasher(selected.id)} style={{ backgroundColor: '#00c853', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  ✅ Valider le laveur
                </button>
              )}
              {selected.status === 'actif' && (
                <button onClick={() => updateStatus(selected.id, 'suspendu')} style={{ backgroundColor: '#fff0f0', color: '#cc3333', border: '1.5px solid #cc3333', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  🚫 Suspendre le compte
                </button>
              )}
              {selected.status === 'suspendu' && (
                <button onClick={() => updateStatus(selected.id, 'actif')} style={{ backgroundColor: '#e8faf0', color: '#00c853', border: '1.5px solid #00c853', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  ♻️ Réactiver le compte
                </button>
              )}
              <button style={{ backgroundColor: '#f5f5f5', color: '#555', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                📧 Envoyer un message
              </button>
              <button style={{ backgroundColor: '#f5f5f5', color: '#555', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                📊 Voir ses missions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
