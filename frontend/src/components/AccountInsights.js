import React, { useState, useEffect } from 'react';
import { videoAPI, recommendationsAPI } from '../api';

const AccountInsights = () => {
  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    platform: 'tiktok',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    avg_watch_time: 0,
    completion_rate: 0,
    posted_date: new Date().toISOString().split('T')[0],
  });
  const [recommendations, setRecommendations] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await videoAPI.getVideos();
      setVideos(response.data);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('rate') || name.includes('time') || name.includes('views') || name.includes('likes') || name.includes('comments') || name.includes('shares')
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await videoAPI.addVideo(formData);
      setMessage('✅ Video added successfully!');
      setFormData({
        title: '',
        platform: 'tiktok',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        avg_watch_time: 0,
        completion_rate: 0,
        posted_date: new Date().toISOString().split('T')[0],
      });
      loadVideos();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding video');
      console.error('Error:', error);
    }
  };

  const getRecommendations = async (video) => {
    try {
      const response = await recommendationsAPI.getRecommendations({
        views: video.views,
        likes: video.likes,
        completion_rate: video.completion_rate,
        avg_watch_time: video.avg_watch_time,
      });
      setRecommendations({ videoId: video.id, tips: response.data });
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
  };

  return (
    <div className="card">
      <h2>📊 Account Insights</h2>

      {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}

      <div style={{ marginBottom: '30px' }}>
        <h3>Add Video Metrics</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div className="form-group">
              <label>Video Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Morning Routine Challenge"
                required
              />
            </div>

            <div className="form-group">
              <label>Platform</label>
              <select name="platform" value={formData.platform} onChange={handleChange}>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="form-group">
              <label>Posted Date</label>
              <input
                type="date"
                name="posted_date"
                value={formData.posted_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Views</label>
              <input
                type="number"
                name="views"
                value={formData.views}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Likes</label>
              <input
                type="number"
                name="likes"
                value={formData.likes}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Comments</label>
              <input
                type="number"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Shares</label>
              <input
                type="number"
                name="shares"
                value={formData.shares}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Avg Watch Time (seconds)</label>
              <input
                type="number"
                name="avg_watch_time"
                value={formData.avg_watch_time}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Completion Rate (%)</label>
              <input
                type="number"
                name="completion_rate"
                value={formData.completion_rate}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '20px' }}>
            Add Video
          </button>
        </form>
      </div>

      <div>
        <h3>Your Videos</h3>
        {videos.length === 0 ? (
          <p style={{ color: '#999' }}>No videos added yet. Start by adding one above!</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Platform</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Completion %</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td>{video.title}</td>
                    <td>{video.platform}</td>
                    <td>{video.views}</td>
                    <td>{video.likes}</td>
                    <td>{video.completion_rate}%</td>
                    <td>{new Date(video.posted_date).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn"
                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                        onClick={() => getRecommendations(video)}
                      >
                        Get Tips
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {recommendations && (
        <div style={{ marginTop: '30px', background: '#f0f7ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
          <h3>💡 Improvement Tips</h3>
          {recommendations.tips.map((tip, idx) => (
            <div key={idx} style={{ marginBottom: '15px', padding: '10px', background: 'white', borderRadius: '8px' }}>
              <strong>{tip.type}</strong>
              <p style={{ color: '#666', margin: '5px 0 0 0' }}><em>{tip.issue}</em></p>
              <p style={{ color: '#667eea', margin: '5px 0 0 0' }}>✓ {tip.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountInsights;
