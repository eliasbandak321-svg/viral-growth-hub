import React, { useState, useEffect } from 'react';
import { trendsAPI } from '../api';

const TrendResearch = () => {
  const [trends, setTrends] = useState([]);
  const [platform, setPlatform] = useState('tiktok');
  const [formData, setFormData] = useState({
    platform: 'tiktok',
    keyword: '',
    trend_score: 0,
    growth_rate: 0,
    niche: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTrends();
  }, [platform]);

  const loadTrends = async () => {
    try {
      const response = await trendsAPI.getTrends(platform);
      setTrends(response.data);
    } catch (error) {
      console.error('Error loading trends:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('score') || name.includes('rate') ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await trendsAPI.addTrend({ ...formData, platform });
      setMessage('✅ Trend added!');
      setFormData({
        platform: 'tiktok',
        keyword: '',
        trend_score: 0,
        growth_rate: 0,
        niche: '',
      });
      loadTrends();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding trend');
      console.error('Error:', error);
    }
  };

  // Sample trending data
  const sampleTrends = [
    { id: 1, keyword: '#FYP', platform: 'tiktok', trend_score: 95, growth_rate: 45, niche: 'General' },
    { id: 2, keyword: '#Aesthetic', platform: 'tiktok', trend_score: 85, growth_rate: 38, niche: 'Beauty' },
    { id: 3, keyword: '#DanceChallenge', platform: 'tiktok', trend_score: 90, growth_rate: 52, niche: 'Entertainment' },
    { id: 4, keyword: '#TransitionTok', platform: 'tiktok', trend_score: 88, growth_rate: 35, niche: 'General' },
    { id: 5, keyword: '#Explore', platform: 'instagram', trend_score: 92, growth_rate: 41, niche: 'General' },
    { id: 6, keyword: '#Reels', platform: 'instagram', trend_score: 87, growth_rate: 39, niche: 'Video' },
  ];

  const displayTrends = trends.length > 0 ? trends : sampleTrends.filter((t) => t.platform === platform);

  return (
    <div className="card">
      <h2>📈 Trend & Keyword Research</h2>

      {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}

      <div style={{ marginBottom: '30px' }}>
        <h3>Add Custom Trend</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div className="form-group">
              <label>Keyword/Hashtag</label>
              <input
                type="text"
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
                placeholder="e.g., #DanceChallenge"
                required
              />
            </div>

            <div className="form-group">
              <label>Niche</label>
              <input
                type="text"
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                placeholder="e.g., Entertainment"
              />
            </div>

            <div className="form-group">
              <label>Trend Score (1-100)</label>
              <input
                type="number"
                name="trend_score"
                value={formData.trend_score}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Growth Rate (%)</label>
              <input
                type="number"
                name="growth_rate"
                value={formData.growth_rate}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '20px' }}>
            Add Trend
          </button>
        </form>
      </div>

      <div>
        <h3>Trending Now</h3>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '15px', fontWeight: '600' }}>Platform:</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
          >
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>

        <div className="grid">
          {displayTrends.map((trend) => (
            <div key={trend.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
              <h4 style={{ color: '#667eea', marginBottom: '10px' }}>{trend.keyword}</h4>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>
                <strong>Niche:</strong> {trend.niche}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>
                <strong>Trend Score:</strong> {trend.trend_score}/100
              </p>
              <p style={{ color: '#28a745', fontSize: '0.9rem', margin: '5px 0' }}>
                <strong>Growth:</strong> ↑ {trend.growth_rate}%
              </p>
              <button
                className="btn"
                style={{ marginTop: '15px', width: '100%', padding: '8px' }}
              >
                Use in Content
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendResearch;
