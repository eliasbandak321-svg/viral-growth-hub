import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const videoAPI = {
  addVideo: (videoData) => api.post('/videos', videoData),
  getVideos: () => api.get('/videos'),
  getAnalytics: () => api.get('/analytics'),
};

export const scriptAPI = {
  generateScript: (scriptData) => api.post('/generate-script', scriptData),
  getScripts: () => api.get('/scripts'),
};

export const calendarAPI = {
  getCalendarEvents: () => api.get('/calendar'),
  addCalendarEvent: (eventData) => api.post('/calendar', eventData),
};

export const trendsAPI = {
  getTrends: (platform) => api.get(`/trends/${platform}`),
  addTrend: (trendData) => api.post('/trends', trendData),
};

export const recommendationsAPI = {
  getRecommendations: (metrics) => api.post('/recommendations', metrics),
};

export const nichesAPI = {
  getNiches: () => api.get('/niches'),
  addNiche: (nicheData) => api.post('/niches', nicheData),
};

export default api;
