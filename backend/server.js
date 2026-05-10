const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const claude = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// ==================== TIKTOK ACCOUNT ====================

app.get('/api/tiktok/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(`https://tiktok-api23.p.rapidapi.com/api/user/info`, {
      params: { uniqueId: username },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
      },
    });
    const data = response.data;
    const stats = data?.userInfo?.stats || {};
    const shareMeta = data?.shareMeta || {};
    const title = shareMeta.title || '';

    if (!stats.followerCount) {
      return res.status(404).json({ error: 'TikTok user not found' });
    }

    res.json({
      username: username,
      nickname: title.split(' on TikTok')[0] || username,
      avatar: data?.userInfo?.user?.avatarLarger || data?.userInfo?.user?.avatarMedium || '',
      bio: shareMeta.desc || '',
      followers: stats.followerCount || 0,
      following: stats.followingCount || 0,
      likes: stats.heartCount || stats.heart || 0,
      videos: stats.videoCount,
      verified: false,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch TikTok data', detail: err.message });
  }
});

app.get('/api/tiktok/:username/videos', async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.get(`https://tiktok-api23.p.rapidapi.com/api/user/posts`, {
      params: { uniqueId: username, count: 10 },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
      },
    });
    const items = response.data?.itemList || [];
    const videos = items.map(item => ({
      id: item.id,
      description: item.desc,
      views: item.stats?.playCount || 0,
      likes: item.stats?.diggCount || 0,
      comments: item.stats?.commentCount || 0,
      shares: item.stats?.shareCount || 0,
      duration: item.video?.duration || 0,
      cover: item.video?.cover,
      date: new Date(item.createTime * 1000).toLocaleDateString(),
    }));
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos', detail: err.message });
  }
});

// ==================== INSTAGRAM ACCOUNT ====================

app.get('/api/instagram/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const response = await axios.post(`https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile.php`,
      `username_or_url=${encodeURIComponent(username)}&data=basic`,
      {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const data = response.data;
    if (!data?.username) {
      return res.status(404).json({ error: 'Instagram user not found' });
    }
    res.json({
      username: data.username,
      nickname: data.full_name || data.username,
      avatar: data.hd_profile_pic_url_info?.url || data.profile_pic_url || '',
      bio: data.biography || '',
      followers: data.follower_count || 0,
      following: data.following_count || 0,
      posts: data.media_count || 0,
      verified: data.is_verified || false,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Instagram data', detail: err.message });
  }
});

// ==================== AI CONTENT GENERATION ====================

app.post('/api/ai/analyze', async (req, res) => {
  const { username, platform, niche, followers, avgViews, topVideos } = req.body;
  try {
    const prompt = `You are a viral social media expert. Analyze this ${platform} creator and give specific actionable advice:

Creator: @${username}
Niche: ${niche}
Followers: ${followers?.toLocaleString()}
Average Views: ${avgViews?.toLocaleString()}

Recent videos: ${topVideos?.map(v => `"${v.description}" - ${v.views?.toLocaleString()} views`).join(', ')}

Give a detailed analysis including:
1. Account health score (0-100)
2. What's working well
3. Top 3 problems holding them back
4. Exact next steps to grow
Keep it specific and actionable. Format with clear sections.`;

    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ analysis: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'AI analysis failed', detail: err.message });
  }
});

app.post('/api/ai/hooks', async (req, res) => {
  const { niche, topic, platform } = req.body;
  try {
    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a viral ${platform} content expert. Generate 5 different types of hooks for this content:

Niche: ${niche}
Topic: ${topic}

Generate exactly these 5 hook types:
1. SHOCK HOOK - Start with a shocking fact or statement
2. CURIOSITY HOOK - Make them desperate to keep watching
3. POV HOOK - Personal perspective that relates to viewers
4. QUESTION HOOK - A question they must know the answer to
5. SEED HOOK - Plant a promise of value at the end

Format each as:
[TYPE]: "[The hook text]"

Make them punchy, under 15 words each, and optimized for ${platform}.`
      }],
    });
    res.json({ hooks: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Hook generation failed', detail: err.message });
  }
});

app.post('/api/ai/script', async (req, res) => {
  const { niche, topic, hook, platform } = req.body;
  try {
    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Write a viral ${platform} video script for:
Niche: ${niche}
Topic: ${topic}
Hook to use: "${hook}"

Write a complete script with:
HOOK (0-3 sec): [Use the provided hook]
TENSION (3-8 sec): [Build curiosity, don't reveal yet]
VALUE (8-25 sec): [Deliver the actual content in steps]
TWIST (25-35 sec): [Unexpected insight or result]
CTA (35-40 sec): [Call to action - follow, save, comment]

Keep the total video under 45 seconds. Write it word for word as the creator would say it. Make it conversational and engaging.`
      }],
    });
    res.json({ script: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Script generation failed', detail: err.message });
  }
});

app.post('/api/ai/topics', async (req, res) => {
  const { niche, platform, recentVideos } = req.body;
  try {
    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a viral content strategist. Generate 10 video topic ideas for this creator:

Niche: ${niche}
Platform: ${platform}
Recent videos: ${recentVideos || 'Not provided'}

For each topic provide:
- Topic title
- Why it will go viral (1 sentence)
- Best hook angle

Focus on what the algorithm is currently pushing. Make topics specific and actionable, not generic.`
      }],
    });
    res.json({ topics: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Topic generation failed', detail: err.message });
  }
});

app.post('/api/ai/hashtags', async (req, res) => {
  const { niche, topic, platform } = req.body;
  try {
    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Generate the perfect hashtag strategy for this ${platform} video:
Niche: ${niche}
Topic: ${topic}

Give exactly:
- 3 MEGA hashtags (1B+ posts) - for discovery
- 4 MEDIUM hashtags (100M-1B posts) - for reach
- 3 NICHE hashtags (under 100M) - for targeted audience

Format as a simple list of hashtags grouped by category. Only hashtags, no explanation needed.`
      }],
    });
    res.json({ hashtags: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Hashtag generation failed', detail: err.message });
  }
});

// ==================== EXISTING ENDPOINTS ====================

app.post('/api/videos', (req, res) => {
  const { title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date } = req.body;
  try {
    const result = db.prepare(`INSERT INTO videos (title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(title, platform, views, likes, comments, shares, avg_watch_time, completion_rate, posted_date);
    res.json({ id: result.lastInsertRowid, message: 'Video added' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/videos', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/analytics', (req, res) => {
  try {
    res.json(db.prepare(`SELECT platform, COUNT(*) as total_videos, AVG(views) as avg_views, AVG(likes) as avg_likes, AVG(completion_rate) as avg_completion_rate, SUM(views) as total_views FROM videos GROUP BY platform`).all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/calendar', (req, res) => {
  try {
    res.json(db.prepare(`SELECT c.*, s.title as script_title FROM calendar c LEFT JOIN scripts s ON c.script_id = s.id ORDER BY c.date`).all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/calendar', (req, res) => {
  const { date, topic, script_id, platform, status } = req.body;
  try {
    const result = db.prepare('INSERT INTO calendar (date, topic, script_id, platform, status) VALUES (?, ?, ?, ?, ?)').run(date, topic, script_id || null, platform, status || 'planned');
    res.json({ id: result.lastInsertRowid, message: 'Event added' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/scripts', (req, res) => {
  try {
    res.json(db.prepare('SELECT * FROM scripts ORDER BY created_at DESC').all().map(r => ({ ...r, hooks: JSON.parse(r.hooks || '[]') })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/scripts', (req, res) => {
  const { title, niche, hooks, full_script, platform } = req.body;
  try {
    const result = db.prepare('INSERT INTO scripts (title, niche, hooks, full_script, platform) VALUES (?, ?, ?, ?, ?)').run(title, niche, JSON.stringify(hooks || []), full_script, platform);
    res.json({ id: result.lastInsertRowid, message: 'Script saved' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/health', (req, res) => res.json({ status: 'running', timestamp: new Date() }));

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
