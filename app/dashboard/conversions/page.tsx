'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';

type EventRow = { event: string; count: number; unique_users: number };

const MOCK_EVENTS: EventRow[] = [
  { event: 'app_opened', count: 1240, unique_users: 312 },
  { event: 'user_signup', count: 89, unique_users: 89 },
  { event: 'cgu_accepted', count: 89, unique_users: 89 },
  { event: 'booking_started', count: 204, unique_users: 156 },
  { event: 'booking_created', count: 167, unique_users: 142 },
  { event: 'payment_success', count: 158, unique_users: 138 },
  { event: 'payment_failed', count: 9, unique_users: 9 },
  { event: 'user_login', count: 876, unique_users: 298 },
  { event: 'referral_shared', count: 34, unique_users: 28 },
  { event: 'promo_applied', count: 47, unique_users: 41 },
  { event: 'account_deleted', count: 3, unique_users: 3 },
];

const FUNNEL_DATA = [
  { name: 'App ouverte', value: 1240, fill: '#1a6bff' },
  { name: 'Inscription', value: 89, fill: '#00c853' },
  { name: 'Réservation démarrée', value: 204, fill: '#FFB800' },
  { name: 'Réservation créée', value: 167, fill: '#ff9800' },
  { name: 'Paiement réussi', value: 158, fill: '#9c27b0' },
];

const DAILY_EVENTS = [
  { day: 'Lun', signups: 12, bookings: 24, payments: 22 },
  { day: 'Mar', signups: 8, bookings: 31, payments: 29 },
  { day: 'Mer', signups: 15, bookings: 28, payments: 26 },
  { day: 'Jeu', signups: 11, bookings: 35, payments: 33 },
  { day: 'Ven', signups: 19, bookings: 42, payments: 38 },
  { day: 'Sam', signups: 14, bookings: 38, payments: 35 },
  { day: 'Dim', signups: 10, bookings: 22, payments: 20 },
];

const EVENT_LABELS: Record<string, string> = {
  app_opened: '📱 App ouverte',
  user_signup: '✅ Inscription',
  cgu_accepted: '📋 CGU acceptées',
  booking_started: '▶️ Résa démarrée',
  booking_created: '📋 Résa créée',
  payment_success: '💳 Paiement réussi',
  payment_failed: '❌ Paiement échoué',
  user_login: '🔑 Connexion',
  referral_shared: '🎁 Parrainage partagé',
  promo_applied: '🎟️ Promo appliquée',
  account_deleted: '🗑️ Compte supprimé',
};

export default function Conversions() {
  const [events, setEvents] = useState<EventRow[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('analytics')
        .select('event')
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        const counts: Record<string, { count: number; users: Set<string> }> = {};
        data.forEach((row: any) => {
          if (!counts[row.event]) counts[row.event] = { count: 0, users: new Set() };
          counts[row.event].count++;
          if (row.user_id) counts[row.event].users.add(row.user_id);
        });
        const rows = Object.entries(counts).map(([event, v]) => ({
          event,
          count: v.count,
          unique_users: v.users.size,
        }));
        setEvents(rows);
      }
    } catch { /* Utiliser les données mock */ }
    finally { setLoading(false); }
  };

  // KPIs clés
  const signups = events.find(e => e.event === 'user_signup')?.count ?? 0;
  const bookings = events.find(e => e.event === 'booking_created')?.count ?? 0;
  const payments = events.find(e => e.event === 'payment_success')?.count ?? 0;
  const paymentFailed = events.find(e => e.event === 'payment_failed')?.count ?? 0;
  const appOpens = events.find(e => e.event === 'app_opened')?.count ?? 1;

  const conversionSignup = ((signups / appOpens) * 100).toFixed(1);
  const conversionBooking = signups > 0 ? ((bookings / signups) * 100).toFixed(1) : '0';
  const conversionPayment = bookings > 0 ? ((payments / bookings) * 100).toFixed(1) : '0';
  const paymentFailRate = (payments + paymentFailed) > 0
    ? ((paymentFailed / (payments + paymentFailed)) * 100).toFixed(1)
    : '0';

  return (
    <div>
      {/* KPIs conversions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Taux inscription', value: `${conversionSignup}%`, sub: 'ouvertures → inscriptions', color: '#1a6bff', icon: '✅' },
          { label: 'Taux booking', value: `${conversionBooking}%`, sub: 'inscriptions → réservations', color: '#00c853', icon: '📋' },
          { label: 'Taux paiement', value: `${conversionPayment}%`, sub: 'réservations → paiements', color: '#9c27b0', icon: '💳' },
          { label: 'Taux échec paiement', value: `${paymentFailRate}%`, sub: 'des tentatives échouent', color: '#cc3333', icon: '❌' },
        ].map((k, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${k.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>{k.sub}</div>
              </div>
              <div style={{ fontSize: 24 }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Funnel + daily events */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>🎯 Entonnoir de conversion</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FUNNEL_DATA.map((step, i) => {
              const pct = ((step.value / FUNNEL_DATA[0].value) * 100).toFixed(0);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{step.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: step.fill }}>{step.value.toLocaleString('fr-FR')} ({pct}%)</span>
                  </div>
                  <div style={{ height: 12, backgroundColor: '#f5f5f5', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: step.fill, borderRadius: 6, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>📅 Événements cette semaine</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DAILY_EVENTS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="day" fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="signups" fill="#1a6bff" name="Inscriptions" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bookings" fill="#00c853" name="Réservations" radius={[4, 4, 0, 0]} />
              <Bar dataKey="payments" fill="#9c27b0" name="Paiements" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table des events */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>📊 Tous les événements</h2>
          <button onClick={fetchEvents} style={{ fontSize: 12, color: '#1a6bff', border: '1.5px solid #1a6bff', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', background: 'white', fontWeight: 600 }}>
            ↻ Actualiser
          </button>
        </div>
        {loading ? (
          <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>Chargement...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
                {['Événement', 'Occurrences', 'Utilisateurs uniques', 'Taux (sur ouvertures)'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.sort((a, b) => b.count - a.count).map((e, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '13px 12px', fontSize: 14, fontWeight: 600 }}>
                    {EVENT_LABELS[e.event] ?? e.event}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: 16, fontWeight: 700, color: '#0a0a0a' }}>
                    {e.count.toLocaleString('fr-FR')}
                  </td>
                  <td style={{ padding: '13px 12px', fontSize: 14, color: '#555' }}>
                    {e.unique_users.toLocaleString('fr-FR')}
                  </td>
                  <td style={{ padding: '13px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 80, height: 6, backgroundColor: '#f5f5f5', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (e.count / appOpens) * 100)}%`, height: '100%', backgroundColor: '#1a6bff', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>
                        {((e.count / appOpens) * 100).toFixed(1)}%
                      </span>
                    </div>
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
