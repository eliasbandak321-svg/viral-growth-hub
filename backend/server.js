const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// ==================== VIDEOS ====================

app.post('/api/videos', (req, res) => {
  const { title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date } = req.body;
  try {
    const stmt = db.prepare(`INSERT INTO videos (title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const result = stmt.run(title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date);
    res.json({ id: result.lastInsertRowid, message: 'Video added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/videos', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT platform,
        COUNT(*) as total_videos,
        AVG(views) as avg_views,
        AVG(likes) as avg_likes,
        AVG(completion_rate) as avg_completion_rate,
        SUM(views) as total_views
      FROM videos GROUP BY platform
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== TRENDS ====================

app.get('/api/trends/:platform', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM trends WHERE platform = ? ORDER BY trend_score DESC LIMIT 20').all(req.params.platform);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trends', (req, res) => {
  const { platform, keyword, trend_score, growth_rate, niche } = req.body;
  try {
    const result = db.prepare('INSERT INTO trends (platform, keyword, trend_score, growth_rate, niche) VALUES (?, ?, ?, ?, ?)').run(platform, keyword, trend_score, growth_rate, niche);
    res.json({ id: result.lastInsertRowid, message: 'Trend added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== SCRIPTS ====================

app.post('/api/generate-script', (req, res) => {
  const { title, niche, platform } = req.body;
  const hooks = [
    `POV: You didn't know this about ${niche}`,
    `Wait until the end, this changes everything about ${niche}`,
    `This ${niche} hack changed my life`,
    `Nobody talks about this ${niche} trick`,
    `This is the most underrated ${niche} strategy`
  ];
  const fullScript = `
HOOK (0-3 sec): ${hooks[0]}

BODY (3-15 sec):
- Start with curiosity
- Build tension
- Share value

CTA (15-20 sec):
- Call to action
- Follow for more
- Save this video
  `;
  try {
    const result = db.prepare('INSERT INTO scripts (title, niche, hooks, full_script, platform) VALUES (?, ?, ?, ?, ?)').run(title, niche, JSON.stringify(hooks), fullScript, platform);
    res.json({ id: result.lastInsertRowid, hooks, fullScript, message: 'Script generated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scripts', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM scripts ORDER BY created_at DESC').all();
    res.json(rows.map(row => ({ ...row, hooks: JSON.parse(row.hooks || '[]') })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CALENDAR ====================

app.get('/api/calendar', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT c.*, s.title as script_title, s.niche
      FROM calendar c
      LEFT JOIN scripts s ON c.script_id = s.id
      ORDER BY c.date
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calendar', (req, res) => {
  const { date, topic, script_id, platform, status } = req.body;
  try {
    const result = db.prepare('INSERT INTO calendar (date, topic, script_id, platform, status) VALUES (?, ?, ?, ?, ?)').run(date, topic, script_id || null, platform, status || 'planned');
    res.json({ id: result.lastInsertRowid, message: 'Event added to calendar' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== RECOMMENDATIONS ====================

app.post('/api/recommendations', (req, res) => {
  const { views, likes, completion_rate, avg_watch_time } = req.body;
  const recommendations = [];
  if (views < 100) recommendations.push({ type: 'Hook Quality', issue: 'Low views indicate weak hook', suggestion: 'Try more shocking or curiosity-driven openings' });
  if (completion_rate < 50) recommendations.push({ type: 'Watch Time', issue: 'People are dropping off early', suggestion: 'Build tension in first 3 seconds, keep pacing fast' });
  if (likes < views * 0.05) recommendations.push({ type: 'Engagement', issue: 'Low engagement rate', suggestion: 'Add more emotional triggers or calls to action' });
  if (avg_watch_time < 10) recommendations.push({ type: 'Content Length', issue: 'Video is too long', suggestion: 'Aim for 15-30 second videos with quick cuts' });
  if (recommendations.length === 0) recommendations.push({ type: 'Great Job!', issue: 'Your metrics look good', suggestion: 'Keep posting consistently and test new hooks' });
  res.json(recommendations);
});

// ==================== NICHES ====================

app.post('/api/niches', (req, res) => {
  const { name, keywords } = req.body;
  try {
    const result = db.prepare('INSERT INTO niches (name, keywords) VALUES (?, ?)').run(name, JSON.stringify(keywords));
    res.json({ id: result.lastInsertRowid, message: 'Niche added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/niches', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM niches WHERE tracked = 1').all();
    res.json(rows.map(row => ({ ...row, keywords: JSON.parse(row.keywords || '[]') })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== HEALTH ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running', timestamp: new Date() });
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
