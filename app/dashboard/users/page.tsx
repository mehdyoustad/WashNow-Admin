'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }: { data: any[] | null }) => { setUsers(data || []); setLoading(false); });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 8 }}>Utilisateurs</h1>
      <p style={{ color: '#999', marginBottom: 32 }}>{users.length} utilisateurs inscrits</p>
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {loading ? <p style={{ color: '#999' }}>Chargement...</p> : users.length === 0 ? (
          <p style={{ color: '#999' }}>Aucun utilisateur pour l'instant</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
                {['Nom', 'Téléphone', 'Inscrit le'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, backgroundColor: '#1a6bff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                        {u.full_name?.[0] ?? '?'}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{u.full_name ?? 'Sans nom'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 14, color: '#555' }}>{u.phone ?? '—'}</td>
                  <td style={{ padding: '14px 12px', fontSize: 14, color: '#555' }}>
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}