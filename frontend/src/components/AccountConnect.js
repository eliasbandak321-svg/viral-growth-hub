import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const AccountConnect = ({ onAccountLoaded }) => {
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [instaUsername, setInstaUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!tiktokUsername && !instaUsername) {
      setError('Enter at least one username');
      return;
    }
    setLoading(true);
    setError('');
    const data = { tiktok: null, instagram: null };

    try {
      if (tiktokUsername) {
        const r = await axios.get(`${API}/tiktok/${tiktokUsername.replace('@', '')}`);
        data.tiktok = r.data;
      }
    } catch (e) {
      setError('TikTok: ' + (e.response?.data?.error || 'User not found'));
    }

    try {
      if (instaUsername) {
        const r = await axios.get(`${API}/instagram/${instaUsername.replace('@', '')}`);
        data.instagram = r.data;
      }
    } catch (e) {
      setError(prev => prev + ' | Instagram: ' + (e.response?.data?.error || 'User not found'));
    }

    setLoading(false);
    if (data.tiktok || data.instagram) {
      onAccountLoaded(data, tiktokUsername.replace('@', ''), instaUsername.replace('@', ''));
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🚀</div>
        <h2 style={{ marginBottom: '8px' }}>Connect Your Accounts</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Enter your TikTok and/or Instagram username to get your personalized growth dashboard
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleConnect}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>🎵 TikTok Username</label>
            <input
              type="text"
              placeholder="@yourusername"
              value={tiktokUsername}
              onChange={e => setTiktokUsername(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>📸 Instagram Username</label>
            <input
              type="text"
              placeholder="@yourusername"
              value={instaUsername}
              onChange={e => setInstaUsername(e.target.value)}
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '10px' }} disabled={loading}>
            {loading ? '⏳ Loading your account...' : '🔍 Analyze My Account'}
          </button>
        </form>

        <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '20px' }}>
          Only public accounts can be analyzed
        </p>
      </div>
    </div>
  );
};

export default AccountConnect;
