'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Settings() {
  const [services, setServices] = useState<any[]>([]);
  const [commission, setCommission] = useState(20);
  const [urgentFee, setUrgentFee] = useState(15);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('created_at');
    setServices(data || []);
    setLoading(false);
  };

  const updatePrice = (id: string, price: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, price } : s));
  };

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleSave = async () => {
    for (const service of services) {
      await supabase.from('services').update({ price: service.price, active: service.active }).eq('id', service.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 800 }}>
      {saved && (
        <div style={{ backgroundColor: '#e8faf0', border: '1px solid #00c853', borderRadius: 12, padding: '14px 20px', marginBottom: 24, color: '#00c853', fontWeight: 600, fontSize: 14 }}>
          ✅ Prix mis à jour sur l'application mobile en temps réel !
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', marginBottom: 6 }}>Services & Tarifs</h2>
        <p style={{ color: '#999', fontSize: 14, marginBottom: 24 }}>Les modifications sont appliquées en temps réel sur l'app mobile</p>

        {loading ? <p style={{ color: '#999' }}>Chargement...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {services.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', backgroundColor: s.active ? '#fafafa' : '#f5f5f5', borderRadius: 12, border: `2px solid ${s.active ? '#e8e8e8' : '#f0f0f0'}` }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: s.active ? '#0a0a0a' : '#999' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>⏱ {s.duration}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    value={s.price}
                    onChange={e => updatePrice(s.id, Number(e.target.value))}
                    style={{ width: 80, padding: '8px 12px', borderRadius: 8, border: '2px solid #e8e8e8', fontSize: 14, fontWeight: 700, textAlign: 'center', outline: 'none' }}
                  />
                  <span style={{ fontSize: 14, color: '#555' }}>€</span>
                </div>
                <button
                  onClick={() => toggleService(s.id)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, backgroundColor: s.active ? '#e8faf0' : '#f5f5f5', color: s.active ? '#00c853' : '#999' }}
                >
                  {s.active ? '✅ Actif' : '❌ Inactif'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', marginBottom: 6 }}>Commissions & Frais</h2>
        <p style={{ color: '#999', fontSize: 14, marginBottom: 24 }}>Configurer les taux de commission</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Commission WashNow', desc: 'Pourcentage prélevé sur chaque prestation', value: commission, setValue: setCommission, unit: '%' },
            { label: 'Supplément intervention urgente', desc: 'Frais ajoutés pour une intervention dans l\'heure', value: urgentFee, setValue: setUrgentFee, unit: '€' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', backgroundColor: '#fafafa', borderRadius: 12, border: '2px solid #e8e8e8' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{item.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="number" value={item.value} onChange={e => item.setValue(Number(e.target.value))} style={{ width: 80, padding: '8px 12px', borderRadius: 8, border: '2px solid #e8e8e8', fontSize: 14, fontWeight: 700, textAlign: 'center', outline: 'none' }} />
                <span style={{ fontSize: 14, color: '#555' }}>{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} style={{ backgroundColor: '#1a6bff', color: 'white', padding: '16px 40px', borderRadius: 50, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
        💾 Sauvegarder et publier
      </button>
    </div>
  );
}