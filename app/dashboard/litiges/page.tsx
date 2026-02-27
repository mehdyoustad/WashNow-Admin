'use client';
import { useState } from 'react';

const defaultLitiges = [
  { id: 1, client: 'Sophie M.', prestateur: 'Karim B.', issue: 'Lavage incomplet - jantes non nettoyées', date: '2026-02-20', status: 'open', priority: 'high' },
  { id: 2, client: 'Marc D.', prestateur: 'Thomas M.', issue: 'Retard de 45 minutes sans prévenir', date: '2026-02-18', status: 'in_progress', priority: 'medium' },
  { id: 3, client: 'Julie K.', prestateur: 'Samir K.', issue: 'Rayure constatée après prestation', date: '2026-02-15', status: 'resolved', priority: 'high' },
  { id: 4, client: 'Pierre L.', prestateur: 'Lucas D.', issue: 'Prestation annulée sans remboursement', date: '2026-02-10', status: 'resolved', priority: 'low' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  open: { label: '🔴 Ouvert', bg: '#fff0f0', color: '#cc3333' },
  in_progress: { label: '🟡 En traitement', bg: '#fff8e6', color: '#cc8800' },
  resolved: { label: '🟢 Résolu', bg: '#e8faf0', color: '#00c853' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: 'Haute', color: '#cc3333' },
  medium: { label: 'Moyenne', color: '#cc8800' },
  low: { label: 'Basse', color: '#00c853' },
};

export default function Litiges() {
  const [litiges, setLitiges] = useState(defaultLitiges);
  const [selected, setSelected] = useState<any | null>(null);

  const updateStatus = (id: number, status: string) => {
    setLitiges(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Liste */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 8 }}>Litiges</h1>
        <p style={{ color: '#999', marginBottom: 24 }}>{litiges.filter(l => l.status === 'open').length} litiges ouverts</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {litiges.map((l, i) => {
            const s = statusConfig[l.status];
            const p = priorityConfig[l.priority];
            return (
              <div
                key={i}
                onClick={() => setSelected(l)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  border: `2px solid ${selected?.id === l.id ? '#1a6bff' : 'transparent'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>{l.client}</span>
                    <span style={{ color: '#999', fontSize: 13 }}> vs </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>{l.prestateur}</span>
                  </div>
                  <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                </div>
                <p style={{ fontSize: 14, color: '#555', margin: '0 0 10px' }}>{l.issue}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#999' }}>{new Date(l.date).toLocaleDateString('fr-FR')}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>Priorité {p.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Détail */}
      {selected && (
        <div style={{ width: 320, backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content', position: 'sticky', top: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Détail du litige</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Client', value: selected.client },
              { label: 'Prestataire', value: selected.prestateur },
              { label: 'Date', value: new Date(selected.date).toLocaleDateString('fr-FR') },
              { label: 'Priorité', value: priorityConfig[selected.priority].label },
            ].map((row, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{row.value}</div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Problème signalé</div>
              <div style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>{selected.issue}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>Changer le statut</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'open', label: '🔴 Ouvrir' },
                  { id: 'in_progress', label: '🟡 Prendre en charge' },
                  { id: 'resolved', label: '🟢 Résoudre' },
                ].map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => updateStatus(selected.id, btn.id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 10,
                      border: '2px solid',
                      borderColor: selected.status === btn.id ? '#1a6bff' : '#e8e8e8',
                      backgroundColor: selected.status === btn.id ? '#1a6bff' : 'white',
                      color: selected.status === btn.id ? 'white' : '#555',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}