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

  const kpis = [
    { icon: '👥', label: 'Utilisateurs', value: stats.users, color: '#1a6bff' },
    { icon: '📋', label: 'Réservations', value: stats.bookings, color: '#00c853' },
    { icon: '💰', label: 'Chiffre d\'affaires', value: `${stats.revenue}€`, color: '#FFB800' },
    { icon: '⏳', label: 'En attente', value: stats.pending, color: '#ff6b35' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0a0a0a', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#999', marginBottom: 32 }}>Vue d'ensemble de WashNow</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{kpi.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color }}>{loading ? '...' : kpi.value}</div>
            <div style={{ fontSize: 14, color: '#999', marginTop: 4 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>💰 CA mensuel</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" fontSize={12} tick={{ fill: '#999' }} />
              <YAxis fontSize={12} tick={{ fill: '#999' }} />
              <Tooltip formatter={(value) => [`${value}€`, 'CA']} />
              <Line type="monotone" dataKey="ca" stroke="#1a6bff" strokeWidth={3} dot={{ fill: '#1a6bff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>🚗 Lavages cette semaine</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="day" fontSize={12} tick={{ fill: '#999' }} />
              <YAxis fontSize={12} tick={{ fill: '#999' }} />
              <Tooltip formatter={(value) => [value, 'Lavages']} />
              <Bar dataKey="lavages" fill="#1a6bff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dernières réservations */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>Dernières réservations</h2>
        {loading ? <p style={{ color: '#999' }}>Chargement...</p> : recentBookings.length === 0 ? (
          <p style={{ color: '#999' }}>Aucune réservation pour l'instant</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
                {['Service', 'Adresse', 'Date', 'Statut', 'Prix'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '14px 12px', fontSize: 14, fontWeight: 600 }}>{b.service}</td>
                  <td style={{ padding: '14px 12px', fontSize: 14, color: '#555' }}>{b.address}</td>
                  <td style={{ padding: '14px 12px', fontSize: 14, color: '#555' }}>{new Date(b.scheduled_at).toLocaleDateString('fr-FR')}</td>
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