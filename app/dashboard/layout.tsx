'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navGroups = [
  {
    label: 'Général',
    items: [
      { href: '/dashboard', icon: '📊', label: 'Dashboard' },
      { href: '/dashboard/analytics', icon: '📈', label: 'Analytiques' },
      { href: '/dashboard/conversions', icon: '🎯', label: 'Conversions' },
    ],
  },
  {
    label: 'Clients',
    items: [
      { href: '/dashboard/reservations', icon: '📋', label: 'Réservations' },
      { href: '/dashboard/users', icon: '👥', label: 'Utilisateurs' },
      { href: '/dashboard/litiges', icon: '⚖️', label: 'Litiges' },
    ],
  },
  {
    label: 'Laveurs',
    items: [
      { href: '/dashboard/laveurs', icon: '🧽', label: 'Laveurs' },
      { href: '/dashboard/virements', icon: '💸', label: 'Virements' },
      { href: '/dashboard/photos', icon: '📸', label: 'Photos missions' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/dashboard/notifications', icon: '🔔', label: 'Notifications push' },
      { href: '/dashboard/promos', icon: '🎟️', label: 'Codes promo' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { href: '/dashboard/prestateurs', icon: '🔧', label: 'Prestataires' },
      { href: '/dashboard/settings', icon: '⚙️', label: 'Paramètres' },
    ],
  },
];

const navItems = navGroups.flatMap(g => g.items);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Nouvelle réservation reçue', time: 'Il y a 2 min', read: false, icon: '📋' },
    { id: 2, text: 'Litige ouvert par Sophie M.', time: 'Il y a 15 min', read: false, icon: '⚖️' },
    { id: 3, text: 'Karim B. a terminé une mission', time: 'Il y a 1h', read: true, icon: '✅' },
  ]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('washnow_admin');
    if (!isAdmin) router.push('/login');
    else setAuthorized(true);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const logout = () => {
    localStorage.removeItem('washnow_admin');
    router.push('/login');
  };

  if (!authorized) return null;

  const currentPage = navItems.find(n => n.href === pathname)?.label ?? 'Dashboard';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: 260,
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 100%)',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, backgroundColor: '#1a6bff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🚿</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>WashNow</div>
              <div style={{ color: '#4a5568', fontSize: 11, marginTop: 1 }}>Administration</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto' }}>
          {navGroups.map(group => (
            <div key={group.label} style={{ marginBottom: 12 }}>
              <div style={{ color: '#4a5568', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '8px 12px 4px' }}>{group.label}</div>
              {group.items.map(item => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 10,
                    textDecoration: 'none',
                    backgroundColor: active ? 'rgba(26,107,255,0.15)' : 'transparent',
                    color: active ? '#1a6bff' : '#9ca3af',
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    borderLeft: active ? '3px solid #1a6bff' : '3px solid transparent',
                    transition: 'all 0.15s',
                    marginBottom: 1,
                  }}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 4 }}>
            <div style={{ width: 34, height: 34, backgroundColor: '#1a6bff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Admin</div>
              <div style={{ color: '#4a5568', fontSize: 11 }}>admin@washnow.fr</div>
            </div>
          </div>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', backgroundColor: 'transparent', color: '#6b7280', fontSize: 13, cursor: 'pointer', width: '100%' }}>
            🚪 <span>Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ backgroundColor: 'white', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{currentPage}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                style={{ width: 40, height: 40, borderRadius: 10, border: '2px solid #e8e8e8', backgroundColor: 'white', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
              >
                🔔
                {unreadCount > 0 && (
                  <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, backgroundColor: '#cc3333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 10, fontWeight: 700 }}>{unreadCount}</div>
                )}
              </button>

              {showNotifs && (
                <div style={{ position: 'absolute', right: 0, top: 48, width: 320, backgroundColor: 'white', borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #e8e8e8', zIndex: 200 }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Notifications</span>
                    <button onClick={markAllRead} style={{ fontSize: 12, color: '#1a6bff', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>Tout lire</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: 12, alignItems: 'flex-start', backgroundColor: n.read ? 'white' : '#f0f5ff' }}>
                      <span style={{ fontSize: 20 }}>{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: '#0a0a0a' }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>{n.time}</div>
                      </div>
                      {!n.read && <div style={{ width: 8, height: 8, backgroundColor: '#1a6bff', borderRadius: '50%', marginTop: 4 }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date */}
            <div style={{ fontSize: 13, color: '#999', backgroundColor: '#f5f5f5', padding: '8px 14px', borderRadius: 8 }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 32 }}>
          {children}
        </div>
      </div>
    </div>
  );
}