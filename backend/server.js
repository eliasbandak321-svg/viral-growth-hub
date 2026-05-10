const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// ==================== VIDEO ENDPOINTS ====================

// Add a new video
app.post('/api/videos', (req, res) => {
  const { title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date } = req.body;

  db.run(
    `INSERT INTO videos (title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: 'Video added successfully' });
      }
    }
  );
});

// Get all videos
app.get('/api/videos', (req, res) => {
  db.all(`SELECT * FROM videos ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get video analytics
app.get('/api/analytics', (req, res) => {
  db.all(`
    SELECT
      platform,
      COUNT(*) as total_videos,
      AVG(views) as avg_views,
      AVG(likes) as avg_likes,
      AVG(completion_rate) as avg_completion_rate,
      SUM(views) as total_views
    FROM videos
    GROUP BY platform
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// ==================== TRENDS ENDPOINTS ====================

// Get trending keywords (simulated data)
app.get('/api/trends/:platform', (req, res) => {
  const { platform } = req.params;

  db.all(
    `SELECT * FROM trends WHERE platform = ? ORDER BY trend_score DESC LIMIT 20`,
    [platform],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Add trending keyword
app.post('/api/trends', (req, res) => {
  const { platform, keyword, trend_score, growth_rate, niche } = req.body;

  db.run(
    `INSERT INTO trends (platform, keyword, trend_score, growth_rate, niche) VALUES (?, ?, ?, ?, ?)`,
    [platform, keyword, trend_score, growth_rate, niche],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: 'Trend added' });
      }
    }
  );
});

// ==================== SCRIPT ENDPOINTS ====================

// Generate script (placeholder - will integrate Claude API later)
app.post('/api/generate-script', (req, res) => {
  const { title, niche, platform } = req.body;

  // Placeholder: This will integrate with Claude API
  const hooks = [
    `POV: You didn't know this about ${niche}`,
    `Wait until the end, this changes everything about ${niche}`,
    `This ${niche} hack changed my life`,
    `Nobody talks about this ${niche} trick`,
    `This is the most underrated ${niche} strategy`
  ];

  const fullScript = `
    HOOK (0-3 sec): ${hooks[Math.floor(Math.random() * hooks.length)]}

    BODY (3-15 sec):
    - Start with curiosity
    - Build tension
    - Share value

    CTA (15-20 sec):
    - Call to action
    - Follow for more
    - Save this video
  `;

  db.run(
    `INSERT INTO scripts (title, niche, hooks, full_script, platform) VALUES (?, ?, ?, ?, ?)`,
    [title, niche, JSON.stringify(hooks), fullScript, platform],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          id: this.lastID,
          hooks,
          fullScript,
          message: 'Script generated'
        });
      }
    }
  );
});

// Get all scripts
app.get('/api/scripts', (req, res) => {
  db.all(`SELECT * FROM scripts ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows.map(row => ({
        ...row,
        hooks: JSON.parse(row.hooks || '[]')
      })));
    }
  });
});

// ==================== CALENDAR ENDPOINTS ====================

// Get calendar events
app.get('/api/calendar', (req, res) => {
  db.all(`
    SELECT c.*, s.title as script_title, s.niche
    FROM calendar c
    LEFT JOIN scripts s ON c.script_id = s.id
    ORDER BY c.date
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add calendar event
app.post('/api/calendar', (req, res) => {
  const { date, topic, script_id, platform, status } = req.body;

  db.run(
    `INSERT INTO calendar (date, topic, script_id, platform, status) VALUES (?, ?, ?, ?, ?)`,
    [date, topic, script_id, platform, status || 'planned'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: 'Event added to calendar' });
      }
    }
  );
});

// ==================== RECOMMENDATIONS ENDPOINTS ====================

// Get improvement recommendations
app.post('/api/recommendations', (req, res) => {
  const { views, likes, completion_rate, avg_watch_time } = req.body;

  const recommendations = [];

  if (views < 100) {
    recommendations.push({
      type: 'Hook Quality',
      issue: 'Low views indicate weak hook',
      suggestion: 'Try more shocking or curiosity-driven openings'
    });
  }

  if (completion_rate < 50) {
    recommendations.push({
      type: 'Watch Time',
      issue: 'People are dropping off early',
      suggestion: 'Build tension in first 3 seconds, keep pacing fast'
    });
  }

  if (likes < views * 0.05) {
    recommendations.push({
      type: 'Engagement',
      issue: 'Low engagement rate',
      suggestion: 'Add more emotional triggers or calls to action'
    });
  }

  if (avg_watch_time < 10) {
    recommendations.push({
      type: 'Content Length',
      issue: 'Video is too long',
      suggestion: 'Aim for 15-30 second videos with quick cuts'
    });
  }

  res.json(recommendations);
});

// ==================== NICHES ENDPOINTS ====================

// Add niche to track
app.post('/api/niches', (req, res) => {
  const { name, keywords } = req.body;

  db.run(
    `INSERT INTO niches (name, keywords) VALUES (?, ?)`,
    [name, JSON.stringify(keywords)],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: 'Niche added' });
      }
    }
  );
});

// Get all niches
app.get('/api/niches', (req, res) => {
  db.all(`SELECT * FROM niches WHERE tracked = 1`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows.map(row => ({
        ...row,
        keywords: JSON.parse(row.keywords || '[]')
      })));
    }
  });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running', timestamp: new Date() });
});

// Catch-all: serve React app for any non-API route
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
