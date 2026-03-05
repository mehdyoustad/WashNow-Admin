'use client';
import { useState } from 'react';

type Segment = 'all' | 'active' | 'inactive' | 'no_booking' | 'premium';
type Channel = 'push' | 'email' | 'both';

interface SentNotif {
  id: number;
  title: string;
  body: string;
  segment: string;
  channel: string;
  sentAt: string;
  recipients: number;
  opened: number;
}

const SEGMENT_LABELS: Record<Segment, string> = {
  all: 'Tous les utilisateurs',
  active: 'Utilisateurs actifs (30j)',
  inactive: 'Utilisateurs inactifs (60j+)',
  no_booking: 'Sans réservation',
  premium: 'Abonnés Premium',
};

const SEGMENT_COUNTS: Record<Segment, number> = {
  all: 1247,
  active: 342,
  inactive: 589,
  no_booking: 204,
  premium: 112,
};

const TEMPLATES = [
  { label: 'Promotion weekend', title: 'Offre ce weekend -20%', body: 'Profitez de 20% de réduction sur tous nos services ce weekend avec le code WEEKEND20.' },
  { label: 'Rappel de lavage', title: 'Votre voiture mérite un lavage !', body: 'Cela fait un moment que vous n\'avez pas lavé votre véhicule. Réservez dès maintenant.' },
  { label: 'Nouvelle fonctionnalité', title: 'Découvrez les nouveautés WashNow', body: 'Nous avons ajouté les réservations récurrentes. Économisez 10% en automatisant vos lavages.' },
  { label: 'Parrainage', title: 'Parrainez vos amis, gagnez 10€', body: 'Invitez un ami sur WashNow et recevez tous les deux 10€ de crédit.' },
];

const MOCK_HISTORY: SentNotif[] = [
  { id: 1, title: 'Offre printemps -15%', body: 'Lavage complet à -15% tout le mois d\'avril.', segment: 'Tous', channel: 'Push + Email', sentAt: '2025-03-01 10:32', recipients: 1247, opened: 634 },
  { id: 2, title: 'Rappel inactifs', body: 'Revenez sur WashNow ! Votre voiture vous remerciera.', segment: 'Inactifs 60j+', channel: 'Push', sentAt: '2025-02-22 14:00', recipients: 589, opened: 187 },
  { id: 3, title: 'Nouveauté : récurrence', body: 'Planifiez vos lavages à l\'avance et économisez 10%.', segment: 'Tous', channel: 'Email', sentAt: '2025-02-15 09:00', recipients: 1247, opened: 421 },
];

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState<Segment>('all');
  const [channel, setChannel] = useState<Channel>('push');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<SentNotif[]>(MOCK_HISTORY);

  const recipientCount = SEGMENT_COUNTS[segment];
  const charLeft = 140 - body.length;

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setTitle(t.title);
    setBody(t.body);
  };

  const send = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    const newEntry: SentNotif = {
      id: history.length + 1,
      title,
      body,
      segment: SEGMENT_LABELS[segment],
      channel: channel === 'push' ? 'Push' : channel === 'email' ? 'Email' : 'Push + Email',
      sentAt: new Date().toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
      recipients: recipientCount,
      opened: 0,
    };
    setHistory(prev => [newEntry, ...prev]);
    setTitle('');
    setBody('');
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Composer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {sent && (
          <div style={{ backgroundColor: '#e8faf0', border: '1px solid #00c853', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, color: '#00693a' }}>Notification envoyée avec succès</div>
              <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{recipientCount.toLocaleString()} destinataires ciblés</div>
            </div>
          </div>
        )}

        {/* Templates rapides */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, border: '1px solid #f0f0f0' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0a0a0a', marginBottom: 14 }}>Templates rapides</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => applyTemplate(t)}
                style={{ padding: '7px 14px', borderRadius: 50, border: '1.5px solid #e0e0e0', backgroundColor: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#333', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = '#1a6bff'; (e.target as HTMLButtonElement).style.color = '#1a6bff'; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#e0e0e0'; (e.target as HTMLButtonElement).style.color = '#333'; }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#0a0a0a' }}>Composer la notification</div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Titre</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Offre exclusive ce weekend"
              maxLength={65}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, color: '#0a0a0a', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: 11, color: '#bbb', marginTop: 4, textAlign: 'right' }}>{65 - title.length} caractères restants</div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Message</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Rédigez votre message ici..."
              maxLength={140}
              rows={4}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, color: '#0a0a0a', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <div style={{ fontSize: 11, color: charLeft < 20 ? '#cc3333' : '#bbb', marginTop: 4, textAlign: 'right' }}>{charLeft} caractères restants</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Segment</label>
              <select
                value={segment}
                onChange={e => setSegment(e.target.value as Segment)}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, color: '#0a0a0a', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}
              >
                {(Object.keys(SEGMENT_LABELS) as Segment[]).map(key => (
                  <option key={key} value={key}>{SEGMENT_LABELS[key]} ({SEGMENT_COUNTS[key].toLocaleString()})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 8 }}>Canal</label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as Channel)}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, color: '#0a0a0a', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="push">Push uniquement</option>
                <option value="email">Email uniquement</option>
                <option value="both">Push + Email</option>
              </select>
            </div>
          </div>

          {/* Aperçu */}
          {(title || body) && (
            <div style={{ backgroundColor: '#f8f9fa', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: 12 }}>Aperçu</div>
              <div style={{ backgroundColor: '#0a0a0a', borderRadius: 14, padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, backgroundColor: '#1a6bff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🚿</div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{title || 'Titre de la notification'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.5 }}>{body || 'Corps du message...'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 6 }}>WashNow • maintenant</div>
                </div>
              </div>
            </div>
          )}

          {/* Résumé envoi */}
          <div style={{ backgroundColor: '#f0f4ff', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#0a0a0a', fontSize: 14 }}>Destinataires ciblés</div>
              <div style={{ color: '#555', fontSize: 13 }}>{SEGMENT_LABELS[segment]}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a6bff' }}>{recipientCount.toLocaleString()}</div>
          </div>

          <button
            onClick={send}
            disabled={sending || !title.trim() || !body.trim()}
            style={{
              backgroundColor: (!title.trim() || !body.trim()) ? '#ccc' : '#1a6bff',
              color: 'white',
              border: 'none',
              borderRadius: 50,
              padding: '16px 24px',
              fontSize: 15,
              fontWeight: 700,
              cursor: (!title.trim() || !body.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s',
            }}
          >
            {sending ? (
              <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Envoi en cours...</>
            ) : (
              '🚀 Envoyer la notification'
            )}
          </button>
        </div>
      </div>

      {/* Historique */}
      <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Envoyées (30j)', value: '12', icon: '📤', color: '#1a6bff' },
            { label: 'Taux d\'ouverture', value: '41%', icon: '👁️', color: '#00c853' },
            { label: 'Destinataires', value: '1.2k', icon: '👥', color: '#9c27b0' },
            { label: 'Clics', value: '286', icon: '🎯', color: '#ff9800' },
          ].map((kpi, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: 14, padding: 14, border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{kpi.icon}</span>
                <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Historique */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1px solid #f0f0f0', flex: 1 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', fontWeight: 700, fontSize: 14 }}>Historique des envois</div>
          <div style={{ overflowY: 'auto', maxHeight: 480 }}>
            {history.map((n, i) => {
              const openRate = n.opened > 0 ? Math.round((n.opened / n.recipients) * 100) : null;
              return (
                <div key={n.id} style={{ padding: '14px 20px', borderBottom: i < history.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0a0a0a', flex: 1, marginRight: 8 }}>{n.title}</div>
                    <span style={{ fontSize: 11, color: '#bbb', flexShrink: 0 }}>{n.sentAt}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8, lineHeight: 1.5 }}>{n.body}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, backgroundColor: '#f0f4ff', color: '#1a6bff', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>{n.channel}</span>
                    <span style={{ fontSize: 11, backgroundColor: '#f5f5f5', color: '#555', padding: '3px 8px', borderRadius: 20 }}>{n.recipients.toLocaleString()} dest.</span>
                    {openRate !== null && (
                      <span style={{ fontSize: 11, backgroundColor: '#e8faf0', color: '#00c853', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>{openRate}% ouverts</span>
                    )}
                    <span style={{ fontSize: 11, backgroundColor: '#f5f5f5', color: '#888', padding: '3px 8px', borderRadius: 20 }}>{n.segment}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
