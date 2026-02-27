'use client';
import { useState } from 'react';

const defaultPrestateurs = [
  { id: 1, name: 'Karim B.', rating: 4.9, jobs: 247, status: 'active', zone: 'Drancy, Bobigny', joined: '2024-01-15' },
  { id: 2, name: 'Thomas M.', rating: 4.7, jobs: 183, status: 'active', zone: 'Paris 15e, 16e', joined: '2024-02-20' },
  { id: 3, name: 'Samir K.', rating: 4.8, jobs: 95, status: 'pending', zone: 'Montreuil, Vincennes', joined: '2024-06-10' },
  { id: 4, name: 'Lucas D.', rating: 3.9, jobs: 42, status: 'suspended', zone: 'Saint-Denis', joined: '2024-08-05' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: '✅ Actif', bg: '#e8faf0', color: '#00c853' },
  pending: { label: '⏳ En attente', bg: '#fff8e6', color: '#cc8800' },
  suspended: { label: '🚫 Suspendu', bg: '#fff0f0', color: '#cc3333' },
};

export default function Prestateurs() {
  const [prestateurs, setPrestateurs] = useState(defaultPrestateurs);

  const updateStatus = (id: number, status: string) => {
    setPrestateurs(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 8 }}>Prestataires</h1>
      <p style={{ color: '#999', marginBottom: 24 }}>{prestateurs.length} prestataires inscrits</p>

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Actifs', value: prestateurs.filter(p => p.status === 'active').length, color: '#00c853' },
          { label: 'En attente de validation', value: prestateurs.filter(p => p.status === 'pending').length, color: '#FFB800' },
          { label: 'Suspendus', value: prestateurs.filter(p => p.status === 'suspended').length, color: '#cc3333' },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
              {['Prestataire', 'Zone', 'Note', 'Lavages', 'Inscrit le', 'Statut', 'Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prestateurs.map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, backgroundColor: '#1a6bff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                        {p.name[0]}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#555' }}>{p.zone}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ backgroundColor: '#fff8e6', color: '#cc8800', padding: '4px 8px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>⭐ {p.rating}</span>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 600 }}>{p.jobs}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#555' }}>{new Date(p.joined).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ backgroundColor: s.bg, color: s.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{s.label}</span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <select
                      value={p.status}
                      onChange={e => updateStatus(p.id, e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '2px solid #e8e8e8', fontSize: 13, cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="active">Activer</option>
                      <option value="pending">En attente</option>
                      <option value="suspended">Suspendre</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}