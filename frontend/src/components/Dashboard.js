import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = ({ accounts, tiktokUser, instaUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tiktokVideos, setTiktokVideos] = useState([]);
  const [niche, setNiche] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedHook, setSelectedHook] = useState('');
  const [hooks, setHooks] = useState('');
  const [script, setScript] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [topics, setTopics] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState({});
  const [activePlatform, setActivePlatform] = useState(accounts.tiktok ? 'tiktok' : 'instagram');

  const currentAccount = accounts[activePlatform];

  useEffect(() => {
    if (tiktokUser) {
      axios.get(`${API}/tiktok/${tiktokUser}/videos`)
        .then(r => setTiktokVideos(r.data))
        .catch(() => {});
    }
  }, [tiktokUser]);

  const setLoad = (key, val) => setLoading(prev => ({ ...prev, [key]: val }));

  const generateHooks = async () => {
    if (!niche || !topic) return alert('Enter your niche and topic first!');
    setLoad('hooks', true);
    try {
      const r = await axios.post(`${API}/ai/hooks`, { niche, topic, platform: activePlatform });
      setHooks(r.data.hooks);
    } catch (e) { alert('Error generating hooks'); }
    setLoad('hooks', false);
  };

  const generateScript = async () => {
    if (!niche || !topic) return alert('Enter your niche and topic first!');
    setLoad('script', true);
    try {
      const r = await axios.post(`${API}/ai/script`, { niche, topic, hook: selectedHook || 'Make them stop scrolling', platform: activePlatform });
      setScript(r.data.script);
    } catch (e) { alert('Error generating script'); }
    setLoad('script', false);
  };

  const generateHashtags = async () => {
    if (!niche) return alert('Enter your niche first!');
    setLoad('hashtags', true);
    try {
      const r = await axios.post(`${API}/ai/hashtags`, { niche, topic: topic || niche, platform: activePlatform });
      setHashtags(r.data.hashtags);
    } catch (e) { alert('Error generating hashtags'); }
    setLoad('hashtags', false);
  };

  const generateTopics = async () => {
    if (!niche) return alert('Enter your niche first!');
    setLoad('topics', true);
    try {
      const recent = tiktokVideos.slice(0, 3).map(v => v.description).join(', ');
      const r = await axios.post(`${API}/ai/topics`, { niche, platform: activePlatform, recentVideos: recent });
      setTopics(r.data.topics);
    } catch (e) { alert('Error generating topics'); }
    setLoad('topics', false);
  };

  const runAnalysis = async () => {
    setLoad('analysis', true);
    try {
      const avgViews = tiktokVideos.length > 0
        ? Math.round(tiktokVideos.reduce((s, v) => s + v.views, 0) / tiktokVideos.length)
        : 0;
      const r = await axios.post(`${API}/ai/analyze`, {
        username: activePlatform === 'tiktok' ? tiktokUser : instaUser,
        platform: activePlatform,
        niche: niche || 'General',
        followers: currentAccount?.followers,
        avgViews,
        topVideos: tiktokVideos.slice(0, 5),
      });
      setAnalysis(r.data.analysis);
    } catch (e) { alert('Error running analysis'); }
    setLoad('analysis', false);
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'content', label: '✍️ Content Ideas' },
    { id: 'hooks', label: '🪝 Hooks & Scripts' },
    { id: 'hashtags', label: '#️⃣ Hashtags' },
    { id: 'analysis', label: '🔍 AI Analysis' },
    { id: 'videos', label: '🎬 My Videos' },
  ];

  return (
    <div>
      {/* Platform switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {accounts.tiktok && (
          <button
            className={`tab-btn ${activePlatform === 'tiktok' ? 'active' : ''}`}
            onClick={() => setActivePlatform('tiktok')}
          >
            🎵 TikTok
          </button>
        )}
        {accounts.instagram && (
          <button
            className={`tab-btn ${activePlatform === 'instagram' ? 'active' : ''}`}
            onClick={() => setActivePlatform('instagram')}
          >
            📸 Instagram
          </button>
        )}
      </div>

      {/* Account Profile Card */}
      {currentAccount && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {currentAccount.avatar && (
              <img src={currentAccount.avatar} alt="avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid white' }} />
            )}
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0 }}>@{currentAccount.username} {currentAccount.verified && '✅'}</h2>
              <p style={{ opacity: 0.85, margin: '5px 0' }}>{currentAccount.bio || 'No bio'}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginTop: '20px' }}>
            {[
              { label: 'Followers', value: currentAccount.followers?.toLocaleString() },
              { label: 'Following', value: currentAccount.following?.toLocaleString() },
              { label: activePlatform === 'tiktok' ? 'Total Likes' : 'Posts', value: (currentAccount.likes || currentAccount.posts)?.toLocaleString() },
              { label: activePlatform === 'tiktok' ? 'Videos' : 'Verified', value: activePlatform === 'tiktok' ? currentAccount.videos?.toLocaleString() : (currentAccount.verified ? 'Yes' : 'No') },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>{stat.value || '—'}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Niche & Topic Input */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>🎯 Your Niche & Topic</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Your Niche</label>
            <input type="text" placeholder="e.g. Fitness, Beauty, Cooking..." value={niche} onChange={e => setNiche(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Video Topic (optional)</label>
            <input type="text" placeholder="e.g. Morning routine for fat loss" value={topic} onChange={e => setTopic(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Feature Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)} style={{ fontSize: '0.9rem', padding: '10px 16px' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="card">
          <h3>📊 Quick Overview</h3>
          <div className="grid" style={{ marginTop: '15px' }}>
            <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #667eea' }}>
              <h4>💡 What to do right now</h4>
              <ul style={{ color: '#555', lineHeight: '2', marginLeft: '20px' }}>
                <li>Enter your niche above</li>
                <li>Go to <strong>Content Ideas</strong> for topics to post</li>
                <li>Go to <strong>Hooks & Scripts</strong> for ready-to-use scripts</li>
                <li>Go to <strong>Hashtags</strong> for viral hashtag combos</li>
                <li>Go to <strong>AI Analysis</strong> for personalized growth tips</li>
              </ul>
            </div>
            <div style={{ background: '#f0fff4', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #28a745' }}>
              <h4>📈 Growth Tips for Your Account</h4>
              <ul style={{ color: '#555', lineHeight: '2', marginLeft: '20px' }}>
                <li>Post at least 1-2 videos per day</li>
                <li>First 3 seconds = everything</li>
                <li>Reply to every comment in first hour</li>
                <li>Use trending sounds in your niche</li>
                <li>Test different hooks every 3 posts</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Content Ideas Tab */}
      {activeTab === 'content' && (
        <div className="card">
          <h3>✍️ AI Content Ideas</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Get 10 viral video topic ideas tailored to your niche and recent content</p>
          <button className="btn" onClick={generateTopics} disabled={loading.topics}>
            {loading.topics ? '⏳ Generating...' : '🚀 Generate 10 Topic Ideas'}
          </button>
          {topics && (
            <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#333' }}>
              {topics}
            </div>
          )}
        </div>
      )}

      {/* Hooks & Scripts Tab */}
      {activeTab === 'hooks' && (
        <div className="card">
          <h3>🪝 Viral Hooks & Scripts</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button className="btn" onClick={generateHooks} disabled={loading.hooks}>
              {loading.hooks ? '⏳ Generating...' : '🪝 Generate 5 Hooks'}
            </button>
            <button className="btn btn-secondary" onClick={generateScript} disabled={loading.script}>
              {loading.script ? '⏳ Writing...' : '📝 Generate Full Script'}
            </button>
          </div>

          {hooks && (
            <div style={{ marginBottom: '20px' }}>
              <h4>Your Hooks:</h4>
              <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '10px', whiteSpace: 'pre-wrap', lineHeight: '2', color: '#333', marginTop: '10px' }}>
                {hooks}
              </div>
              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Paste your chosen hook to generate script:</label>
                <input type="text" placeholder="Paste the hook you want to use..." value={selectedHook} onChange={e => setSelectedHook(e.target.value)} />
              </div>
            </div>
          )}

          {script && (
            <div>
              <h4>Your Script:</h4>
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#333', marginTop: '10px', borderLeft: '4px solid #667eea' }}>
                {script}
              </div>
              <button className="btn" style={{ marginTop: '15px' }} onClick={() => { navigator.clipboard.writeText(script); alert('Script copied!'); }}>
                📋 Copy Script
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hashtags Tab */}
      {activeTab === 'hashtags' && (
        <div className="card">
          <h3>#️⃣ Viral Hashtag Strategy</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Get the perfect mix of mega, medium, and niche hashtags for maximum reach</p>
          <button className="btn" onClick={generateHashtags} disabled={loading.hashtags}>
            {loading.hashtags ? '⏳ Finding hashtags...' : '🔥 Generate Hashtags'}
          </button>
          {hashtags && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '10px', whiteSpace: 'pre-wrap', lineHeight: '2', color: '#333', fontSize: '1rem' }}>
                {hashtags}
              </div>
              <button className="btn" style={{ marginTop: '15px' }} onClick={() => { navigator.clipboard.writeText(hashtags); alert('Hashtags copied!'); }}>
                📋 Copy All Hashtags
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="card">
          <h3>🔍 AI Account Analysis</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Get a full breakdown of your account performance and exact steps to grow</p>
          <button className="btn" onClick={runAnalysis} disabled={loading.analysis}>
            {loading.analysis ? '⏳ Analyzing your account...' : '🤖 Analyze My Account'}
          </button>
          {analysis && (
            <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '20px', borderRadius: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#333', borderLeft: '4px solid #667eea' }}>
              {analysis}
            </div>
          )}
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="card">
          <h3>🎬 Your Recent Videos</h3>
          {tiktokVideos.length === 0 ? (
            <p style={{ color: '#999' }}>No videos found or TikTok account not connected.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Views</th>
                    <th>Likes</th>
                    <th>Comments</th>
                    <th>Shares</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tiktokVideos.map(v => (
                    <tr key={v.id}>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.description || 'No caption'}</td>
                      <td>{v.views?.toLocaleString()}</td>
                      <td>{v.likes?.toLocaleString()}</td>
                      <td>{v.comments?.toLocaleString()}</td>
                      <td>{v.shares?.toLocaleString()}</td>
                      <td>{v.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
