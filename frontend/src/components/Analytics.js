import React, { useState, useEffect } from 'react';
import { videoAPI } from '../api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    loadVideos();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await videoAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async () => {
    try {
      const response = await videoAPI.getVideos();
      setVideos(response.data);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  if (loading) {
    return <div className="card"><p className="loading">Loading analytics...</p></div>;
  }

  // Sample analytics data
  const sampleAnalytics = [
    {
      platform: 'tiktok',
      total_videos: 12,
      avg_views: 4500,
      avg_likes: 350,
      avg_completion_rate: 68,
      total_views: 54000,
    },
    {
      platform: 'instagram',
      total_videos: 8,
      avg_views: 2800,
      avg_likes: 280,
      avg_completion_rate: 55,
      total_views: 22400,
    },
  ];

  const displayAnalytics = analytics && analytics.length > 0 ? analytics : sampleAnalytics;
  const totalVideos = videos.length || 20;
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0) || 76400;

  return (
    <div className="card">
      <h2>📉 Performance Analytics</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>Overview</h3>
        <div className="grid">
          <div className="stat-box">
            <h3>{totalVideos}</h3>
            <p>Total Videos Posted</p>
          </div>
          <div className="stat-box">
            <h3>{totalViews.toLocaleString()}</h3>
            <p>Total Views</p>
          </div>
          <div className="stat-box">
            <h3>{Math.round(totalViews / totalVideos).toLocaleString()}</h3>
            <p>Avg Views per Video</p>
          </div>
          <div className="stat-box">
            <h3>📈</h3>
            <p>Growth Trend: Increasing</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Platform Performance</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Videos</th>
                <th>Total Views</th>
                <th>Avg Views</th>
                <th>Avg Likes</th>
                <th>Avg Completion %</th>
              </tr>
            </thead>
            <tbody>
              {displayAnalytics.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}</strong>
                  </td>
                  <td>{item.total_videos}</td>
                  <td>{item.total_views?.toLocaleString() || 0}</td>
                  <td>{Math.round(item.avg_views || 0).toLocaleString()}</td>
                  <td>{Math.round(item.avg_likes || 0)}</td>
                  <td>{Math.round(item.avg_completion_rate || 0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Top Performing Videos</h3>
        {videos.length === 0 ? (
          <p style={{ color: '#999' }}>No video data yet. Add videos to see top performers.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Platform</th>
                  <th>Views</th>
                  <th>Engagement Rate</th>
                  <th>Completion %</th>
                </tr>
              </thead>
              <tbody>
                {videos
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((video) => {
                    const engagementRate = video.views > 0
                      ? (((video.likes + video.comments + video.shares) / video.views) * 100).toFixed(1)
                      : 0;
                    return (
                      <tr key={video.id}>
                        <td>{video.title}</td>
                        <td>{video.platform}</td>
                        <td>{video.views.toLocaleString()}</td>
                        <td>{engagementRate}%</td>
                        <td>{video.completion_rate}%</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Key Metrics Tips</h3>
        <div className="grid">
          <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
            <h4>💡 Views</h4>
            <p style={{ color: '#666' }}>Target: Aim to increase average views by 10-20% week-over-week.</p>
          </div>

          <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
            <h4>❤️ Engagement Rate</h4>
            <p style={{ color: '#666' }}>Target: 8-15% engagement (likes + comments + shares ÷ views).</p>
          </div>

          <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
            <h4>⏱️ Completion Rate</h4>
            <p style={{ color: '#666' }}>Target: 60%+ completion rate ensures algorithm favors your content.</p>
          </div>

          <div style={{ background: '#f3e5f5', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #9c27b0' }}>
            <h4>📊 Watch Time</h4>
            <p style={{ color: '#666' }}>Longer watch time = better algorithm ranking and more recommendations.</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff8e1', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #fbc02d' }}>
        <h3>📋 Monthly Goals</h3>
        <ul style={{ color: '#333', lineHeight: '1.8', marginLeft: '20px' }}>
          <li>Post 20+ videos this month</li>
          <li>Achieve 1M+ total views</li>
          <li>Maintain 50,000+ avg views per video</li>
          <li>10%+ average engagement rate</li>
          <li>Test 3 new niches/trends</li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
