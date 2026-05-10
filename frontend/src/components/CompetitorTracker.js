import React, { useState } from 'react';

const CompetitorTracker = () => {
  const [competitors, setCompetitors] = useState([
    { id: 1, name: '@topCreator1', platform: 'tiktok', followers: 125000, avgViews: 45000, lastPost: '2h ago', growth: '+2.3%' },
    { id: 2, name: '@viralQueen', platform: 'instagram', followers: 89000, avgViews: 32000, lastPost: '5h ago', growth: '+1.8%' },
  ]);
  const [form, setForm] = useState({ name: '', platform: 'tiktok' });
  const [message, setMessage] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (competitors.length >= 5) {
      setMessage('❌ Maximum 5 competitors allowed');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const newComp = {
      id: Date.now(),
      name: form.name,
      platform: form.platform,
      followers: Math.floor(Math.random() * 100000) + 10000,
      avgViews: Math.floor(Math.random() * 50000) + 5000,
      lastPost: 'Just added',
      growth: '+0%',
    };
    setCompetitors([...competitors, newComp]);
    setForm({ name: '', platform: 'tiktok' });
    setMessage('✅ Competitor added!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRemove = (id) => {
    setCompetitors(competitors.filter(c => c.id !== id));
  };

  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>🕵️ Competitor Tracker <span style={{ fontSize: '0.8rem', background: '#667eea', color: 'white', padding: '3px 10px', borderRadius: '20px', marginLeft: '10px' }}>Up to 5 rivals</span></h3>

      {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="@username"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          style={{ padding: '10px', border: '2px solid #ddd', borderRadius: '8px', flex: 1, minWidth: '150px' }}
        />
        <select
          value={form.platform}
          onChange={e => setForm({ ...form, platform: e.target.value })}
          style={{ padding: '10px', border: '2px solid #ddd', borderRadius: '8px' }}
        >
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
        </select>
        <button type="submit" className="btn">Track</button>
      </form>

      <div className="grid">
        {competitors.map(comp => (
          <div key={comp.id} style={{ background: 'white', border: '2px solid #eee', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <h4 style={{ color: '#667eea', margin: 0 }}>{comp.name}</h4>
                <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'capitalize' }}>{comp.platform}</span>
              </div>
              <span style={{ color: '#28a745', fontWeight: '700' }}>{comp.growth}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <div style={{ background: '#f0f7ff', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: '700', color: '#667eea' }}>{comp.followers.toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Followers</div>
              </div>
              <div style={{ background: '#f0f7ff', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: '700', color: '#667eea' }}>{comp.avgViews.toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Avg Views</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#999' }}>Last post: {comp.lastPost}</span>
              <button onClick={() => handleRemove(comp.id)} style={{ background: '#fee', color: '#c00', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {competitors.length === 0 && (
        <p style={{ color: '#999', textAlign: 'center', padding: '30px' }}>No competitors tracked yet. Add up to 5 rivals above!</p>
      )}
    </div>
  );
};

export default CompetitorTracker;
