'use client';
import { useState } from 'react';

type PhotoEntry = {
  id: string;
  booking_id: string;
  washer_name: string;
  client_name: string;
  service: string;
  date: string;
  before_photos: string[];
  after_photos: string[];
  status: 'pending_review' | 'approved' | 'flagged';
};

// Utilisation d'images placeholder pour la démo
const PH = (seed: string, w = 300, h = 200) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const MOCK_MISSIONS: PhotoEntry[] = [
  { id: 'p1', booking_id: 'm1', washer_name: 'Thomas D.', client_name: 'Mehdy A.', service: 'Lavage complet', date: '2025-03-15 10:00', status: 'approved', before_photos: [PH('car1'), PH('car2'), PH('car3')], after_photos: [PH('clean1'), PH('clean2'), PH('clean3')] },
  { id: 'p2', booking_id: 'm2', washer_name: 'Karim B.', client_name: 'Sarah L.', service: 'Lavage premium', date: '2025-03-15 14:00', status: 'pending_review', before_photos: [PH('car4'), PH('car5')], after_photos: [PH('clean4'), PH('clean5')] },
  { id: 'p3', booking_id: 'm3', washer_name: 'Sarah M.', client_name: 'Thomas R.', service: 'Lavage extérieur', date: '2025-03-14 11:00', status: 'flagged', before_photos: [PH('car6')], after_photos: [PH('blur1')] },
  { id: 'p4', booking_id: 'm4', washer_name: 'Thomas D.', client_name: 'Yasmine B.', service: 'Lavage complet', date: '2025-03-13 09:30', status: 'approved', before_photos: [PH('car7'), PH('car8'), PH('car9')], after_photos: [PH('clean6'), PH('clean7'), PH('clean8')] },
];

const STATUS_CONFIG = {
  pending_review: { bg: '#fff8e6', color: '#cc8800', label: '⏳ À vérifier' },
  approved: { bg: '#e8faf0', color: '#00c853', label: '✅ Validé' },
  flagged: { bg: '#fff0f0', color: '#cc3333', label: '🚩 Signalé' },
};

export default function Photos() {
  const [missions, setMissions] = useState(MOCK_MISSIONS);
  const [filterStatus, setFilterStatus] = useState<'all' | PhotoEntry['status']>('all');
  const [selected, setSelected] = useState<PhotoEntry | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = missions.filter(m => filterStatus === 'all' || m.status === filterStatus);

  const updateStatus = (id: string, status: PhotoEntry['status']) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const stats = {
    total: missions.length,
    pending: missions.filter(m => m.status === 'pending_review').length,
    approved: missions.filter(m => m.status === 'approved').length,
    flagged: missions.filter(m => m.status === 'flagged').length,
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total missions', value: stats.total, color: '#1a6bff', icon: '📸' },
          { label: 'À vérifier', value: stats.pending, color: '#cc8800', icon: '⏳' },
          { label: 'Validées', value: stats.approved, color: '#00c853', icon: '✅' },
          { label: 'Signalées', value: stats.flagged, color: '#cc3333', icon: '🚩' },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
              </div>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 460px' : '1fr', gap: 20 }}>
        {/* Liste missions */}
        <div>
          {/* Filtres */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {(['all', 'pending_review', 'approved', 'flagged'] as const).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '8px 16px', borderRadius: 20, border: '1.5px solid',
                borderColor: filterStatus === s ? '#1a6bff' : '#e8e8e8',
                backgroundColor: filterStatus === s ? '#e8f0ff' : 'white',
                color: filterStatus === s ? '#1a6bff' : '#666',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
                {s === 'all' ? 'Toutes' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(m => (
              <div key={m.id} onClick={() => setSelected(m === selected ? null : m)}
                style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', border: `2px solid ${selected?.id === m.id ? '#1a6bff' : 'transparent'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{m.service}</div>
                    <div style={{ fontSize: 13, color: '#555' }}>
                      <span>🧽 {m.washer_name}</span>
                      <span style={{ margin: '0 8px', color: '#ccc' }}>·</span>
                      <span>👤 {m.client_name}</span>
                      <span style={{ margin: '0 8px', color: '#ccc' }}>·</span>
                      <span>📅 {new Date(m.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <span style={{ backgroundColor: STATUS_CONFIG[m.status].bg, color: STATUS_CONFIG[m.status].color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {STATUS_CONFIG[m.status].label}
                  </span>
                </div>

                {/* Aperçu photos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#999', marginBottom: 8 }}>AVANT ({m.before_photos.length})</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {m.before_photos.slice(0, 3).map((url, i) => (
                        <div key={i} onClick={e => { e.stopPropagation(); setLightbox(url); }} style={{ position: 'relative', width: 70, height: 52, borderRadius: 8, overflow: 'hidden', cursor: 'zoom-in', backgroundColor: '#f5f5f5' }}>
                          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {i === 2 && m.before_photos.length > 3 && (
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>+{m.before_photos.length - 3}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#00c853', marginBottom: 8 }}>APRÈS ({m.after_photos.length})</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {m.after_photos.slice(0, 3).map((url, i) => (
                        <div key={i} onClick={e => { e.stopPropagation(); setLightbox(url); }} style={{ position: 'relative', width: 70, height: 52, borderRadius: 8, overflow: 'hidden', cursor: 'zoom-in', border: '2px solid #e8faf0', backgroundColor: '#f5f5f5' }}>
                          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {m.status === 'pending_review' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button onClick={e => { e.stopPropagation(); updateStatus(m.id, 'approved'); }} style={{ flex: 1, backgroundColor: '#e8faf0', color: '#00c853', border: '1px solid #00c853', borderRadius: 8, padding: '8px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      ✅ Valider
                    </button>
                    <button onClick={e => { e.stopPropagation(); updateStatus(m.id, 'flagged'); }} style={{ flex: 1, backgroundColor: '#fff0f0', color: '#cc3333', border: '1px solid #cc3333', borderRadius: 8, padding: '8px', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                      🚩 Signaler
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panneau détail */}
        {selected && (
          <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', alignSelf: 'start', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Photos de la mission</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999' }}>✕</button>
            </div>

            <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
              <div>{selected.service} · {new Date(selected.date).toLocaleDateString('fr-FR')}</div>
              <div>Laveur : <strong>{selected.washer_name}</strong> · Client : <strong>{selected.client_name}</strong></div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#999', marginBottom: 10 }}>AVANT LE LAVAGE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
              {selected.before_photos.map((url, i) => (
                <div key={i} onClick={() => setLightbox(url)} style={{ aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', cursor: 'zoom-in', backgroundColor: '#f5f5f5' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c853', marginBottom: 10 }}>APRÈS LE LAVAGE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
              {selected.after_photos.map((url, i) => (
                <div key={i} onClick={() => setLightbox(url)} style={{ aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', cursor: 'zoom-in', border: '2px solid #e8faf0', backgroundColor: '#f5f5f5' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selected.status !== 'approved' && (
                <button onClick={() => updateStatus(selected.id, 'approved')} style={{ backgroundColor: '#00c853', color: 'white', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, cursor: 'pointer' }}>
                  ✅ Valider les photos
                </button>
              )}
              {selected.status !== 'flagged' && (
                <button onClick={() => updateStatus(selected.id, 'flagged')} style={{ backgroundColor: '#fff0f0', color: '#cc3333', border: '1.5px solid #cc3333', borderRadius: 10, padding: 12, fontWeight: 700, cursor: 'pointer' }}>
                  🚩 Signaler un problème
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, cursor: 'zoom-out' }}>
          <img src={lightbox} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} />
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '50%', width: 40, height: 40, fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  );
}
