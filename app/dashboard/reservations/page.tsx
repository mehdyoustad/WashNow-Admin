'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: '⏳ En attente', bg: '#fff8e6', color: '#cc8800' },
  confirmed: { label: '✅ Confirmé', bg: '#e8f0ff', color: '#1a6bff' },
  in_progress: { label: '🧽 En cours', bg: '#e8faf0', color: '#00c853' },
  completed: { label: '✨ Terminé', bg: '#f5f5f5', color: '#555' },
  cancelled: { label: '❌ Annulé', bg: '#fff0f0', color: '#cc3333' },
};

export default function Reservations() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    fetchBookings();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 8 }}>Réservations</h1>
      <p style={{ color: '#999', marginBottom: 24 }}>{bookings.length} réservations au total</p>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'Toutes' },
          { id: 'pending', label: '⏳ En attente' },
          { id: 'confirmed', label: '✅ Confirmées' },
          { id: 'in_progress', label: '🧽 En cours' },
          { id: 'completed', label: '✨ Terminées' },
          { id: 'cancelled', label: '❌ Annulées' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 50,
              border: '2px solid',
              borderColor: filter === f.id ? '#1a6bff' : '#e8e8e8',
              backgroundColor: filter === f.id ? '#1a6bff' : 'white',
              color: filter === f.id ? 'white' : '#555',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {loading ? <p style={{ color: '#999' }}>Chargement...</p> : filtered.length === 0 ? (
          <p style={{ color: '#999' }}>Aucune réservation</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
                {['Service', 'Adresse', 'Date', 'Prix', 'Statut', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const s = statusConfig[b.status] || statusConfig.pending;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 600, fontSize: 14 }}>{b.service}</td>
                    <td style={{ padding: '14px 12px', fontSize: 13, color: '#555', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.address}</td>
                    <td style={{ padding: '14px 12px', fontSize: 13, color: '#555' }}>{new Date(b.scheduled_at).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 700, color: '#1a6bff' }}>{b.price}€</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ backgroundColor: s.bg, color: s.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <select
                        value={b.status}
                        onChange={e => updateStatus(b.id, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: '2px solid #e8e8e8', fontSize: 13, cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmer</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annuler</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}