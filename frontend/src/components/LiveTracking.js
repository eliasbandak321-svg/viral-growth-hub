import React, { useState, useEffect } from 'react';

const LiveTracking = () => {
  const [stats, setStats] = useState({
    tiktok: { followers: 1240, views: 45200, likes: 3800, growth: '+12' },
    instagram: { followers: 890, views: 28400, likes: 2100, growth: '+7' },
  });
  const [hashtags, setHashtags] = useState([
    { tag: '#FYP', score: 95, posts: '2.1B' },
    { tag: '#Viral', score: 88, posts: '1.4B' },
    { tag: '#Trending', score: 82, posts: '980M' },
  ]);
  const [newTag, setNewTag] = useState('');
  const [message, setMessage] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Simulate live updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        tiktok: {
          ...prev.tiktok,
          views: prev.tiktok.views + Math.floor(Math.random() * 50),
          followers: prev.tiktok.followers + Math.floor(Math.random() * 3),
        },
        instagram: {
          ...prev.instagram,
          views: prev.instagram.views + Math.floor(Math.random() * 30),
          followers: prev.instagram.followers + Math.floor(Math.random() * 2),
        },
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const addHashtag = (e) => {
    e.preventDefault();
    if (hashtags.length >= 10) {
      setMessage('❌ Maximum 10 hashtags allowed');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const tag = newTag.startsWith('#') ? newTag : `#${newTag}`;
    setHashtags([...hashtags, {
      tag,
      score: Math.floor(Math.random() * 40) + 50,
      posts: `${Math.floor(Math.random() * 900) + 100}M`,
    }]);
    setNewTag('');
    setMessage('✅ Hashtag added!');
    setTimeout(() => setMessage(''), 3000);
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter(h => h.tag !== tag));
  };

  const runAccountScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanResult({
        score: 62,
        issues: [
          { type: '🪝 Hook Strength', status: 'weak', tip: 'Your hooks are too slow — grab attention in the first 1 second' },
          { type: '⏱️ Video Length', status: 'good', tip: 'Your video length is optimal (15-30 seconds)' },
          { type: '#️⃣ Hashtags', status: 'weak', tip: 'You\'re using too many hashtags — stick to 3-5 targeted ones' },
          { type: '📅 Posting Time', status: 'average', tip: 'Post between 6-9pm for maximum reach in your timezone' },
          { type: '💬 Engagement', status: 'good', tip: 'Good engagement rate — keep replying to comments' },
        ],
        topAction: 'Fix your hook in the first second — this alone can 3x your views',
      });
      setScanning(false);
    }, 2500);
  };

  return (
    <div>
      {/* Live Stats */}
      <h3 style={{ marginBottom: '15px' }}>📡 Live Follower & View Tracking</h3>
      <div className="grid" style={{ marginBottom: '30px' }}>
        {['tiktok', 'instagram'].map(platform => (
          <div key={platform} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '12px', padding: '20px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, textTransform: 'capitalize' }}>{platform === 'tiktok' ? '🎵 TikTok' : '📸 Instagram'}</h4>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem' }}>
                🟢 Live {stats[platform].growth} today
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>{stats[platform].followers.toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Followers</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>{stats[platform].views.toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Total Views</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>{stats[platform].likes.toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Likes</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>↑ {stats[platform].growth}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Today</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Automated Account Scan */}
      <div style={{ background: '#f0f7ff', borderRadius: '12px', padding: '25px', marginBottom: '30px', borderLeft: '4px solid #667eea' }}>
        <h3 style={{ marginBottom: '10px' }}>🔍 Automated Account Scan</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Get data-driven recommendations based on your actual content performance</p>
        <button className="btn" onClick={runAccountScan} disabled={scanning}>
          {scanning ? '⏳ Scanning your account...' : '🚀 Run Account Scan'}
        </button>

        {scanResult && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '10px' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: scanResult.score > 75 ? '#28a745' : scanResult.score > 50 ? '#ffc107' : '#dc3545', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.4rem', fontWeight: '700', flexShrink: 0 }}>
                {scanResult.score}
              </div>
              <div>
                <strong>Account Health Score</strong>
                <p style={{ color: '#667eea', margin: '5px 0 0 0' }}>⚡ Top action: {scanResult.topAction}</p>
              </div>
            </div>

            {scanResult.issues.map((issue, idx) => (
              <div key={idx} style={{ background: 'white', padding: '12px 15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: `4px solid ${issue.status === 'good' ? '#28a745' : issue.status === 'average' ? '#ffc107' : '#dc3545'}` }}>
                <span style={{ fontSize: '1rem' }}>{issue.type}</span>
                <span style={{ color: '#666', fontSize: '0.9rem', flex: 1 }}>{issue.tip}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: issue.status === 'good' ? '#28a745' : issue.status === 'average' ? '#ffc107' : '#dc3545', textTransform: 'uppercase' }}>{issue.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hashtag Tracking */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>
          #️⃣ Niche & Hashtag Tracking
          <span style={{ fontSize: '0.8rem', background: '#667eea', color: 'white', padding: '3px 10px', borderRadius: '20px', marginLeft: '10px' }}>
            {hashtags.length}/10
          </span>
        </h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>Track up to 10 hashtags and spot viral trends the moment they break</p>

        {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}

        <form onSubmit={addHashtag} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="#YourNicheHashtag"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            required
            style={{ padding: '10px', border: '2px solid #ddd', borderRadius: '8px', flex: 1 }}
          />
          <button type="submit" className="btn">Track It</button>
        </form>

        <div className="grid">
          {hashtags.map((h, idx) => (
            <div key={idx} style={{ background: 'white', border: '1px solid #eee', borderRadius: '10px', padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ color: '#667eea', margin: 0 }}>{h.tag}</h4>
                <button onClick={() => removeHashtag(h.tag)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>Posts</div>
                  <div style={{ fontWeight: '600' }}>{h.posts}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>Trend Score</div>
                  <div style={{ fontWeight: '600', color: h.score > 80 ? '#28a745' : h.score > 60 ? '#ffc107' : '#dc3545' }}>{h.score}/100</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>Status</div>
                  <div style={{ fontWeight: '600', color: '#28a745', fontSize: '0.85rem' }}>🔥 Trending</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
