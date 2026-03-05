'use client';
import { useState } from 'react';

type PromoType = 'fixed' | 'percent';

interface Promo {
  code: string;
  type: PromoType;
  discount: number;
  uses: number;
  maxUses: number | null;
  expiresAt: string | null;
  active: boolean;
  description: string;
}

const defaultPromos: Promo[] = [
  { code: 'BIENVENUE10', type: 'fixed', discount: 10, uses: 47, maxUses: null, expiresAt: null, active: true, description: 'Offre de bienvenue nouveaux inscrits' },
  { code: 'ETE2025', type: 'percent', discount: 15, uses: 23, maxUses: 200, expiresAt: '2025-09-01', active: true, description: 'Promotion été 2025' },
  { code: 'NOEL20', type: 'fixed', discount: 20, uses: 102, maxUses: 100, expiresAt: '2025-01-05', active: false, description: 'Code Noël 2024 — expiré' },
  { code: 'FIDELE5', type: 'percent', discount: 5, uses: 8, maxUses: 500, expiresAt: '2025-12-31', active: true, description: 'Programme fidélité clients récurrents' },
  { code: 'MEHDY20', type: 'fixed', discount: 10, uses: 3, maxUses: null, expiresAt: null, active: true, description: 'Code parrainage Mehdy' },
];

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 10, border: '2px solid #e8e8e8',
  fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, display: 'block',
};

export default function Promos() {
  const [promos, setPromos] = useState<Promo[]>(defaultPromos);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{
    code: string; type: PromoType; discount: string;
    maxUses: string; expiresAt: string; description: string;
  }>({ code: '', type: 'fixed', discount: '', maxUses: '', expiresAt: '', description: '' });

  const kpis = {
    total: promos.length,
    active: promos.filter(p => p.active).length,
    totalUses: promos.reduce((s, p) => s + p.uses, 0),
    savings: promos.reduce((s, p) => s + (p.type === 'fixed' ? p.uses * p.discount : 0), 0),
  };

  const addPromo = () => {
    if (!form.code || !form.discount) return;
    setSaving(true);
    setTimeout(() => {
      setPromos(prev => [{
        code: form.code.toUpperCase().trim(),
        type: form.type,
        discount: Number(form.discount),
        uses: 0,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
        description: form.description,
        active: true,
      }, ...prev]);
      setForm({ code: '', type: 'fixed', discount: '', maxUses: '', expiresAt: '', description: '' });
      setShowForm(false);
      setSaving(false);
    }, 600);
  };

  const togglePromo = (i: number) => {
    setPromos(prev => prev.map((p, idx) => idx === i ? { ...p, active: !p.active } : p));
  };

  const deletePromo = (i: number) => {
    if (!confirm(`Supprimer le code ${promos[i].code} ?`)) return;
    setPromos(prev => prev.filter((_, idx) => idx !== i));
  };

  const isExpired = (p: Promo) => p.expiresAt && new Date(p.expiresAt) < new Date();
  const isFull = (p: Promo) => p.maxUses !== null && p.uses >= p.maxUses;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0a0a0a', margin: 0, marginBottom: 6 }}>Codes promo</h1>
          <p style={{ color: '#999', margin: 0, fontSize: 14 }}>Gérez les offres promotionnelles de WashNow</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: '#1a6bff', color: 'white', padding: '12px 24px', borderRadius: 50, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
        >
          + Nouveau code
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '🎟️', label: 'Codes créés', value: kpis.total, color: '#1a6bff' },
          { icon: '✅', label: 'Codes actifs', value: kpis.active, color: '#00c853' },
          { icon: '📊', label: 'Utilisations totales', value: kpis.totalUses, color: '#FFB800' },
          { icon: '💸', label: 'Réductions accordées', value: `${kpis.savings}€`, color: '#ff6b35' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${k.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#999', fontWeight: 500, marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a' }}>{k.value}</div>
              </div>
              <div style={{ width: 44, height: 44, backgroundColor: `${k.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid #1a6bff20' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>Créer un nouveau code promo</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Code promo *</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER25" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Type de réduction *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as PromoType }))} style={inputStyle}>
                <option value="fixed">Montant fixe (€)</option>
                <option value="percent">Pourcentage (%)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Valeur * {form.type === 'fixed' ? '(€)' : '(%)'}</label>
              <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} placeholder={form.type === 'fixed' ? '10' : '15'} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Max utilisations (optionnel)</label>
              <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="Illimité" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date d'expiration (optionnel)</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description interne</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Campagne été 2025..." style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={addPromo}
              disabled={saving}
              style={{ backgroundColor: saving ? '#ccc' : '#1a6bff', color: 'white', padding: '12px 28px', borderRadius: 50, border: 'none', fontWeight: 700, cursor: saving ? 'default' : 'pointer', fontSize: 14 }}
            >
              {saving ? 'Création...' : '✅ Créer le code'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ backgroundColor: '#f5f5f5', color: '#555', padding: '12px 24px', borderRadius: 50, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
              {['Code', 'Réduction', 'Utilisation', 'Expiration', 'Description', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promos.map((p, i) => {
              const expired = isExpired(p);
              const full = isFull(p);
              const effectivelyInactive = !p.active || expired || full;
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5', opacity: effectivelyInactive ? 0.6 : 1 }}>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: '#1a6bff', backgroundColor: '#e8f0ff', padding: '4px 10px', borderRadius: 6 }}>
                      {p.code}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 15, fontWeight: 700, color: '#0a0a0a' }}>
                    {p.type === 'fixed' ? `${p.discount}€` : `${p.discount}%`}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 13 }}>
                    <div style={{ color: '#0a0a0a', fontWeight: 600 }}>{p.uses} utilisations</div>
                    {p.maxUses && (
                      <div style={{ marginTop: 4 }}>
                        <div style={{ width: 80, height: 4, backgroundColor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min((p.uses / p.maxUses) * 100, 100)}%`, height: '100%', backgroundColor: full ? '#ff4444' : '#1a6bff', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#999', marginTop: 2, display: 'block' }}>{p.uses}/{p.maxUses}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: expired ? '#cc3333' : '#555' }}>
                    {p.expiresAt ? (
                      <span>{expired ? '⚠️ ' : ''}{new Date(p.expiresAt).toLocaleDateString('fr-FR')}</span>
                    ) : (
                      <span style={{ color: '#bbb' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 12, color: '#777', maxWidth: 180 }}>{p.description || '—'}</td>
                  <td style={{ padding: '14px 12px' }}>
                    {expired ? (
                      <span style={{ backgroundColor: '#fff0f0', color: '#cc3333', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>⏰ Expiré</span>
                    ) : full ? (
                      <span style={{ backgroundColor: '#fff8e6', color: '#cc8800', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>🔒 Épuisé</span>
                    ) : p.active ? (
                      <span style={{ backgroundColor: '#e8faf0', color: '#00c853', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✅ Actif</span>
                    ) : (
                      <span style={{ backgroundColor: '#f5f5f5', color: '#999', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>❌ Inactif</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {!expired && !full && (
                        <button
                          onClick={() => togglePromo(i)}
                          style={{ backgroundColor: p.active ? '#fff0f0' : '#e8faf0', color: p.active ? '#cc3333' : '#00c853', padding: '6px 12px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
                        >
                          {p.active ? 'Désactiver' : 'Activer'}
                        </button>
                      )}
                      <button
                        onClick={() => deletePromo(i)}
                        style={{ backgroundColor: '#fff0f0', color: '#cc3333', padding: '6px 12px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}
                      >
                        Supprimer
                      </button>
                    </div>
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
