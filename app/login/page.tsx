'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    // Identifiants admin (à changer en production)
    if (email === 'admin@washnow.fr' && password === 'washnow2025') {
      localStorage.setItem('washnow_admin', 'true');
      router.push('/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 48,
        width: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64,
            backgroundColor: '#1a6bff',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 16px',
          }}>🚿</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0a0a0a', margin: 0 }}>WashNow Admin</h1>
          <p style={{ color: '#999', marginTop: 6, fontSize: 14 }}>Connectez-vous à votre espace</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 10, padding: 12, marginBottom: 20, color: '#cc3333', fontSize: 14, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@washnow.fr"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: '2px solid #e8e8e8', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: '2px solid #e8e8e8', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '16px', backgroundColor: '#1a6bff', color: 'white', border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 20 }}>
          Identifiants : admin@washnow.fr / washnow2025
        </p>
      </div>
    </div>
  );
}