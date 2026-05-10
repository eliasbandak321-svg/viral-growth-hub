import React, { useState, useEffect } from 'react';
import { nichesAPI, trendsAPI } from '../api';

const NicheIntelligence = () => {
  const [niches, setNiches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    keywords: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNiches();
  }, []);

  const loadNiches = async () => {
    try {
      const response = await nichesAPI.getNiches();
      setNiches(response.data);
    } catch (error) {
      console.error('Error loading niches:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const keywords = formData.keywords.split(',').map((k) => k.trim());
      await nichesAPI.addNiche({
        name: formData.name,
        keywords,
      });
      setMessage('✅ Niche added for tracking!');
      setFormData({
        name: '',
        keywords: '',
      });
      loadNiches();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding niche');
      console.error('Error:', error);
    }
  };

  // Sample niche data
  const sampleNiches = [
    {
      id: 1,
      name: 'Beauty & Makeup',
      keywords: ['#MakeupTutorial', '#BeautyTips', '#SkinCare', '#MakeupHaul'],
      tracked: true,
    },
    {
      id: 2,
      name: 'Fitness & Wellness',
      keywords: ['#FitnessMotivation', '#WorkoutTips', '#HealthyLifestyle', '#YogaTutorial'],
      tracked: true,
    },
    {
      id: 3,
      name: 'Cooking & Food',
      keywords: ['#RecipeTok', '#FoodHack', '#CookingTutorial', '#EasyRecipe'],
      tracked: true,
    },
  ];

  const displayNiches = niches.length > 0 ? niches : sampleNiches;

  return (
    <div className="card">
      <h2>🎯 Niche Intelligence</h2>

      {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}

      <div style={{ marginBottom: '30px' }}>
        <h3>Track New Niche</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div className="form-group">
              <label>Niche Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Beauty & Makeup"
                required
              />
            </div>

            <div className="form-group">
              <label>Keywords (comma-separated)</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="e.g., #MakeupTutorial, #BeautyTips, #SkinCare"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '20px' }}>
            Add Niche
          </button>
        </form>
      </div>

      <div>
        <h3>Your Tracked Niches</h3>
        <div className="grid">
          {displayNiches.map((niche) => (
            <div key={niche.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '2px solid #667eea' }}>
              <h4 style={{ color: '#667eea', marginBottom: '15px' }}>{niche.name}</h4>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                  <strong>Top Keywords:</strong>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(Array.isArray(niche.keywords) ? niche.keywords : []).map((keyword, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#f0f7ff',
                        color: '#667eea',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        border: '1px solid #667eea',
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
                  <strong>Trending in this niche:</strong>
                </p>
                <ul style={{ marginLeft: '20px', color: '#666', fontSize: '0.9rem' }}>
                  <li>Short-form video content</li>
                  <li>Tutorial + product review hybrids</li>
                  <li>Before & after transformations</li>
                  <li>Quick hacks & life-hacks format</li>
                </ul>
              </div>

              <button
                className="btn"
                style={{ marginTop: '15px', width: '100%', padding: '8px' }}
              >
                View Insights
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '30px', background: '#fff3cd', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
        <h3>💡 Niche Strategy Tips</h3>
        <ul style={{ color: '#333', lineHeight: '1.8' }}>
          <li><strong>Consistency:</strong> Post regularly in your niche to build authority</li>
          <li><strong>Trends:</strong> Monitor trending sounds and challenges in your niche</li>
          <li><strong>Engagement:</strong> Interact with other creators in your niche</li>
          <li><strong>Authenticity:</strong> Stay true to your niche while maintaining your unique style</li>
          <li><strong>Quality:</strong> High-quality content is crucial in competitive niches</li>
        </ul>
      </div>
    </div>
  );
};

export default NicheIntelligence;
