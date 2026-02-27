'use client';
import { useState } from 'react';

const defaultPromos = [
  { code: 'BIENVENUE10', discount: '10€', uses: 47, active: true },
  { code: 'ETE2025', discount: '15%', uses: 23, active: true },
  { code: 'NOEL20', discount: '20€', uses: 102, active: false },
];

export default function Promos() {
  const [promos, setPromos] = useState(defaultPromos);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');

  const addPromo = () => {
    if (!newCode || !newDiscount) return;
    setPromos([...promos, { code: newCode.toUpperCase(), discount: newDiscount, uses: 0, active: true }]);
    setNewCode('');
    setNewDiscount('');
  };

  const togglePromo = (i: number) => {
    const updated = [...promos];
    updated[i].active = !updated[i].active;
    setPromos(updated);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 8 }}>Codes promo</h1>
      <p style={{ color: '#999', marginBottom: 32 }}>Gérer les codes de réduction</p>

      {/* Créer un code */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Créer un code promo</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            value={newCode}
            onChange={e => setNewCode(e.target.value)}
            placeholder="Code (ex: SUMMER25)"
            style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: '2px solid #e8e8e8', fontSize: 14, outline: 'none' }}
          />
          <input
            value={newDiscount}
            onChange={e => setNewDiscount(e.target.value)}
            placeholder="Réduction (ex: 10€ ou 15%)"
            style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: '2px solid #e8e8e8', fontSize: 14, outline: 'none' }}
          />
          <button
            onClick={addPromo}
            style={{ backgroundColor: '#1a6bff', color: 'white', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
          >
            Créer
          </button>
        </div>
      </div>

      {/* Liste des codes */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
              {['Code', 'Réduction', 'Utilisations', 'Statut', 'Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promos.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '14px 12px', fontWeight: 700, fontSize: 14, fontFamily: 'monospace', color: '#1a6bff' }}>{p.code}</td>
                <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 600 }}>{p.discount}</td>
                <td style={{ padding: '14px 12px', fontSize: 14, color: '#555' }}>{p.uses} fois</td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{
                    backgroundColor: p.active ? '#e8faf0' : '#f5f5f5',
                    color: p.active ? '#00c853' : '#999',
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                    {p.active ? '✅ Actif' : '❌ Inactif'}
                  </span>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <button
                    onClick={() => togglePromo(i)}
                    style={{
                      backgroundColor: p.active ? '#fff0f0' : '#e8faf0',
                      color: p.active ? '#cc3333' : '#00c853',
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    {p.active ? 'Désactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}