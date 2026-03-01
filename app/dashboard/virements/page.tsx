'use client';
import { useState } from 'react';

type PayoutStatus = 'pending' | 'approved' | 'rejected' | 'processed';

type PayoutRequest = {
  id: string;
  washer_name: string;
  washer_id: string;
  amount: number;
  iban: string;
  requested_at: string;
  status: PayoutStatus;
  missions_count: number;
  period: string;
  note?: string;
};

const MOCK_PAYOUTS: PayoutRequest[] = [
  { id: 'v1', washer_name: 'Thomas D.', washer_id: 'w1', amount: 312, iban: 'FR76 3000 6000 0112 3456 7890 189', requested_at: '2025-03-15T10:30:00', status: 'pending', missions_count: 11, period: '1–15 mars 2025' },
  { id: 'v2', washer_name: 'Karim B.', washer_id: 'w2', amount: 228, iban: 'FR76 1234 5678 9012 3456 7890 123', requested_at: '2025-03-15T09:15:00', status: 'pending', missions_count: 8, period: '1–15 mars 2025' },
  { id: 'v3', washer_name: 'Sarah M.', washer_id: 'w3', amount: 91, iban: 'FR76 5678 9012 3456 7890 1234 567', requested_at: '2025-03-14T16:00:00', status: 'approved', missions_count: 3, period: '8–14 mars 2025' },
  { id: 'v4', washer_name: 'Thomas D.', washer_id: 'w1', amount: 480, iban: 'FR76 3000 6000 0112 3456 7890 189', requested_at: '2025-03-01T11:00:00', status: 'processed', missions_count: 17, period: '15–28 fév. 2025' },
  { id: 'v5', washer_name: 'Karim B.', washer_id: 'w2', amount: 156, iban: 'FR76 1234 5678 9012 3456 7890 123', requested_at: '2025-03-01T10:00:00', status: 'processed', missions_count: 6, period: '15–28 fév. 2025' },
  { id: 'v6', washer_name: 'Lucas V.', washer_id: 'w5', amount: 84, iban: 'FR76 9999 0000 1111 2222 3333 444', requested_at: '2025-02-28T14:00:00', status: 'rejected', missions_count: 3, period: '14–28 fév. 2025', note: 'IBAN invalide — en attente de correction' },
];

const STATUS_CONFIG: Record<PayoutStatus, { bg: string; color: string; label: string }> = {
  pending: { bg: '#fff8e6', color: '#cc8800', label: '⏳ En attente' },
  approved: { bg: '#e8f0ff', color: '#1a6bff', label: '✓ Approuvé' },
  rejected: { bg: '#fff0f0', color: '#cc3333', label: '✕ Refusé' },
  processed: { bg: '#e8faf0', color: '#00c853', label: '✅ Viré' },
};

export default function Virements() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>(MOCK_PAYOUTS);
  const [filterStatus, setFilterStatus] = useState<PayoutStatus | 'all'>('all');
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = payouts.filter(p => filterStatus === 'all' || p.status === filterStatus);

  const totalPending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalApproved = payouts.filter(p => p.status === 'approved').reduce((s, p) => s + p.amount, 0);
  const totalProcessed = payouts.filter(p => p.status === 'processed').reduce((s, p) => s + p.amount, 0);

  const updateStatus = (id: string, status: PayoutStatus, note?: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status, note: note ?? p.note } : p));
  };

  const approveAll = () => {
    setPayouts(prev => prev.map(p => p.status === 'pending' ? { ...p, status: 'approved' } : p));
  };

  const processPayment = (id: string) => {
    setProcessing(id);
    setTimeout(() => {
      updateStatus(id, 'processed');
      setProcessing(null);
      alert('Virement envoyé ! Le laveur recevra les fonds sous 24-48h ouvrés.');
    }, 1500);
  };

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'En attente', value: `${totalPending}€`, count: payouts.filter(p => p.status === 'pending').length, color: '#cc8800', icon: '⏳' },
          { label: 'Approuvés', value: `${totalApproved}€`, count: payouts.filter(p => p.status === 'approved').length, color: '#1a6bff', icon: '✓' },
          { label: 'Virés ce mois', value: `${totalProcessed}€`, count: payouts.filter(p => p.status === 'processed').length, color: '#00c853', icon: '✅' },
          { label: 'Total versé (cumul)', value: '3 240€', count: null, color: '#9c27b0', icon: '💰' },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a' }}>{s.value}</div>
                {s.count !== null && <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{s.count} demande{s.count > 1 ? 's' : ''}</div>}
              </div>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions globales */}
      {payouts.filter(p => p.status === 'pending').length > 0 && (
        <div style={{ backgroundColor: '#fff8e6', borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #ffe0a0' }}>
          <div style={{ fontSize: 14 }}>
            <strong>{payouts.filter(p => p.status === 'pending').length} demandes</strong> en attente pour un total de <strong>{totalPending}€</strong>
          </div>
          <button onClick={approveAll} style={{ backgroundColor: '#1a6bff', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            ✓ Approuver toutes
          </button>
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {/* Filtres */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['all', 'pending', 'approved', 'processed', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '7px 16px', borderRadius: 20, border: '1.5px solid',
              borderColor: filterStatus === s ? '#1a6bff' : '#e8e8e8',
              backgroundColor: filterStatus === s ? '#e8f0ff' : 'white',
              color: filterStatus === s ? '#1a6bff' : '#666',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              {s === 'all' ? 'Toutes' : STATUS_CONFIG[s].label}
              {s !== 'all' && <span style={{ marginLeft: 6, backgroundColor: '#f5f5f5', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                {payouts.filter(p => p.status === s).length}
              </span>}
            </button>
          ))}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
              {['Laveur', 'Période', 'Missions', 'Montant', 'IBAN', 'Date demande', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#00c853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>{p.washer_name[0]}</div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{p.washer_name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 12px', fontSize: 12, color: '#555' }}>{p.period}</td>
                <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{p.missions_count}</td>
                <td style={{ padding: '14px 12px', fontSize: 16, fontWeight: 700, color: '#00c853' }}>{p.amount}€</td>
                <td style={{ padding: '14px 12px', fontSize: 11, color: '#888', fontFamily: 'monospace' }}>{p.iban}</td>
                <td style={{ padding: '14px 12px', fontSize: 12, color: '#555' }}>
                  {new Date(p.requested_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <div>
                    <span style={{ backgroundColor: STATUS_CONFIG[p.status].bg, color: STATUS_CONFIG[p.status].color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {STATUS_CONFIG[p.status].label}
                    </span>
                    {p.note && <div style={{ fontSize: 11, color: '#cc3333', marginTop: 4 }}>{p.note}</div>}
                  </div>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {p.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(p.id, 'approved')} style={{ backgroundColor: '#e8f0ff', color: '#1a6bff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          ✓ Approuver
                        </button>
                        <button onClick={() => updateStatus(p.id, 'rejected', 'Refusé par l\'admin')} style={{ backgroundColor: '#fff0f0', color: '#cc3333', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          ✕
                        </button>
                      </>
                    )}
                    {p.status === 'approved' && (
                      <button onClick={() => processPayment(p.id)} disabled={processing === p.id} style={{ backgroundColor: '#00c853', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: processing === p.id ? 0.7 : 1 }}>
                        {processing === p.id ? '⏳ Envoi...' : '💸 Virer'}
                      </button>
                    )}
                    {p.status === 'processed' && (
                      <span style={{ fontSize: 12, color: '#00c853', fontWeight: 600 }}>✓ Traité</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
