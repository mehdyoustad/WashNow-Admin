'use client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const MONTHLY_REVENUE = [
  { month: 'Sep', ca: 1200, commissions: 372, laveurs: 828 },
  { month: 'Oct', ca: 1800, commissions: 558, laveurs: 1242 },
  { month: 'Nov', ca: 1400, commissions: 434, laveurs: 966 },
  { month: 'Déc', ca: 2200, commissions: 682, laveurs: 1518 },
  { month: 'Jan', ca: 1900, commissions: 589, laveurs: 1311 },
  { month: 'Fév', ca: 2800, commissions: 868, laveurs: 1932 },
  { month: 'Mar', ca: 3100, commissions: 961, laveurs: 2139 },
];

const WASHER_PERF = [
  { name: 'Thomas D.', missions: 127, rating: 4.9, earnings: 3556, acceptance: 94 },
  { name: 'Karim B.', missions: 89, rating: 4.7, earnings: 2492, acceptance: 88 },
  { name: 'Sarah M.', missions: 34, rating: 4.5, earnings: 952, acceptance: 91 },
  { name: 'Lucas V.', missions: 12, rating: 3.8, earnings: 336, acceptance: 60 },
];

const SERVICE_SPLIT = [
  { name: 'Lavage complet', value: 42, color: '#1a6bff' },
  { name: 'Lavage premium', value: 28, color: '#00c853' },
  { name: 'Lavage extérieur', value: 20, color: '#FFB800' },
  { name: 'Intérieur seul', value: 10, color: '#9c27b0' },
];

const ECO_MONTHLY = [
  { month: 'Sep', eau: 2900, co2: 10 },
  { month: 'Oct', eau: 4350, co2: 15 },
  { month: 'Nov', eau: 3480, co2: 12 },
  { month: 'Déc', eau: 5510, co2: 19 },
  { month: 'Jan', eau: 4785, co2: 16.5 },
  { month: 'Fév', eau: 7105, co2: 24.5 },
  { month: 'Mar', eau: 7830, co2: 27 },
];

const RECURRENCE_DATA = [
  { month: 'Jan', unique: 38, recurring: 14 },
  { month: 'Fév', unique: 44, recurring: 22 },
  { month: 'Mar', unique: 51, recurring: 31 },
];

const ECO_TOTALS = {
  water_saved_liters: 35960,
  co2_saved_kg: 124,
  washes_done: 247,
  vs_traditional_water: 247 * 200, // 200L pour un lavage traditionnel
};

export default function Analytics() {
  return (
    <div>
      {/* KPIs éco */}
      <div style={{ background: 'linear-gradient(135deg, #00c853, #009624)', borderRadius: 20, padding: 28, marginBottom: 28, color: 'white' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, opacity: 0.9 }}>🌍 Impact Éco-responsable WashNow</div>
        <div style={{ fontSize: 13, marginBottom: 24, opacity: 0.75 }}>Économies réalisées grâce au lavage sans eau courante</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { label: 'Litres d\'eau économisés', value: `${ECO_TOTALS.water_saved_liters.toLocaleString('fr-FR')} L`, icon: '💧', sub: 'vs lavage traditionnel' },
            { label: 'CO₂ évité', value: `${ECO_TOTALS.co2_saved_kg} kg`, icon: '🌿', sub: 'émissions évitées' },
            { label: 'Lavages effectués', value: ECO_TOTALS.washes_done, icon: '🚗', sub: 'sans eau courante' },
            { label: 'Eq. piscines économisées', value: Math.round(ECO_TOTALS.water_saved_liters / 2500), icon: '🏊', sub: '≈ 2500L par piscine' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 16, backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenu global */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>💰 Répartition CA mensuel</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v, n) => [`${v}€`, n === 'commissions' ? 'Commission WashNow' : n === 'laveurs' ? 'Versé aux laveurs' : 'CA Total']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="laveurs" stackId="a" fill="#00c853" name="laveurs" radius={[0, 0, 0, 0]} />
              <Bar dataKey="commissions" stackId="a" fill="#1a6bff" name="commissions" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}><div style={{ width: 10, height: 10, backgroundColor: '#00c853', borderRadius: 2 }} />Versé aux laveurs (69%)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}><div style={{ width: 10, height: 10, backgroundColor: '#1a6bff', borderRadius: 2 }} />Commission WashNow (31%)</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>🧽 Répartition services</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={SERVICE_SPLIT} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {SERVICE_SPLIT.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {SERVICE_SPLIT.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, backgroundColor: s.color, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ flex: 1, color: '#555' }}>{s.name}</span>
                <strong>{s.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eco + Récurrence */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>💧 Eau économisée (litres/mois)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={ECO_MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v} L`, 'Eau économisée']} contentStyle={{ borderRadius: 10 }} />
              <Area type="monotone" dataKey="eau" stroke="#1a6bff" fill="#e8f0ff" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>🔄 Missions récurrentes vs uniques</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={RECURRENCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="month" fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={12} tick={{ fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10 }} />
              <Bar dataKey="unique" fill="#e8e8e8" name="Uniques" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recurring" fill="#1a6bff" name="Récurrentes" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Classement laveurs */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#0a0a0a' }}>🏆 Classement laveurs</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f5f5f5' }}>
              {['#', 'Laveur', 'Missions', 'Note', 'Taux acceptation', 'Gains versés', 'Performance'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WASHER_PERF.map((w, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: i === 0 ? '#FFB800' : i === 1 ? '#9e9e9e' : i === 2 ? '#CD7F32' : '#f5f5f5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: i < 3 ? 'white' : '#555' }}>
                    {i + 1}
                  </span>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#00c853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{w.name[0]}</div>
                    <span style={{ fontWeight: 600 }}>{w.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 12px', fontWeight: 700, fontSize: 15 }}>{w.missions}</td>
                <td style={{ padding: '14px 12px', color: '#FFB800', fontWeight: 700 }}>⭐ {w.rating}</td>
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80, height: 8, backgroundColor: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${w.acceptance}%`, height: '100%', backgroundColor: w.acceptance >= 80 ? '#00c853' : '#ff9800', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{w.acceptance}%</span>
                  </div>
                </td>
                <td style={{ padding: '14px 12px', fontWeight: 700, color: '#00c853', fontSize: 15 }}>{w.earnings}€</td>
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: j < Math.round(w.rating) ? '#00c853' : '#f5f5f5' }} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
