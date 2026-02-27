'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockMonthlyData = [
  { month: 'Sep', ca: 1200 },
  { month: 'Oct', ca: 1800 },
  { month: 'Nov', ca: 1400 },
  { month: 'Déc', ca: 2200 },
  { month: 'Jan', ca: 1900 },
  { month: 'Fév', ca: 2800 },
];

const mockDailyData = [
  { day: 'Lun', lavages: 4 },
  { day: 'Mar', lavages: 7 },
  { day: 'Mer', lavages: 5 },
  { day: 'Jeu', lavages: 9 },
  { day: 'Ven', lavages: 12 },
  { day: 'Sam', lavages: 15 },
  { day: 'Dim', lavages: 8 },
];

function KPICard({ icon, label, value, color, trend }: any) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#999', fontWeight: 500, marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#0a0a0a' }}>{value}</div>
        </div>
        <div style={{ width: 48, height: 48, backgroundColor: `${color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
      </div>
      {trend && <div style={{ marginTop: 12, fontSize: 12, color: '#00c853', fontWeight: 600 }}>↗ {trend} vs mois dernier</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, bookings: 0, revenue: 0, pending: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: bookings, count: bookingsCount } = await supabase.from('bookings').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(5);
      const { data: allBookings } = await supabase.from('bookings').select('price');
      const revenue = allBookings?.reduce((sum: number, b: any) => sum + (b.price || 0), 0) || 0;
      const { count: pendingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      setStats({ users: usersCount || 0, bookings: bookingsCount || 0, revenue, pending: pendingCount || 0 });
      setRecentBookings(bookings || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        <KPICard icon="👥" label="Utilisateurs inscrits" value={loading ? '...' : stats.users} color="#1a6bff" trend="+12%" />
        <KPICard icon="📋" label="Total réservations" value={loading ? '...' : stats.bookings} color="#00c853" trend="+8%" />
        <KPICard icon="💰" label="Chiffre d'affaires" value={loading ? '...' : `${stats.revenue}€`} color="#FFB800" trend="+23%" />
        <KPICard icon="⏳" label="En attente" value={loading ? '...' : stats.pending} color="#ff6b35" />
      </div>

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
        {[
          { icon: '⭐', label: 'Note moyenne', value: '4.8 / 5', color: '#FFB800' },
          { icon: '🔄', label: 'Taux de rétention', value: '68%', color: '#1a6bff' },
          { icon: '⚡', label: 'Taux de conversion', value: '34%', color: '#00c853' },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, backgroundColor: `${s.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>💰 CA mensuel</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v}€`, 'CA']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="ca" stroke="#1a6bff" strokeWidth={3} dot={{ fill: '#1a6bff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>🚗 Lavages cette semaine</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="day" fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [v, 'Lavages']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="lavages" fill="#1a6bff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dernières réservations */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>Dernières réservations</h2>
          <a href="/dashboard/reservations" style={{ fontSize: 13, color: '#1a6bff', fontWeight: 600, textDecoration: 'none' }}>Voir tout →</a>
        </div>
        {loading ? <p style={{ color: '#999' }}>Chargement...</p> : recentBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p>Aucune réservation pour l'instant</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
                {['Service', 'Adresse', 'Date', 'Statut', 'Prix'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 600 }}>{b.service}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#555' }}>{b.address}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#555' }}>{new Date(b.scheduled_at).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ backgroundColor: b.status === 'pending' ? '#fff8e6' : '#e8faf0', color: b.status === 'pending' ? '#cc8800' : '#00c853', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {b.status === 'pending' ? '⏳ En attente' : '✅ Terminé'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 700, color: '#1a6bff' }}>{b.price}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}