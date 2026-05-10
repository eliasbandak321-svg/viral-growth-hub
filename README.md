# 🚀 Viral Growth Hub - TikTok & Instagram Growth Tool

A full-featured web application to help creators go viral on TikTok and Instagram with AI-powered tools for content analysis, script generation, trend research, and content planning.

## Features

✨ **Account Insights** - Track your video performance metrics and get AI-powered recommendations
📈 **Trend Research** - Discover trending keywords and hashtags in your niche
✍️ **Script Generator** - Generate viral-optimized video scripts with hook variations
📅 **Content Calendar** - Plan and organize your content month by month
🎯 **Niche Intelligence** - Track what's working in your specific niche
📉 **Analytics Dashboard** - Comprehensive performance metrics and insights

## Tech Stack

- **Frontend**: React 18 with modern CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (local, no setup required)
- **API Calls**: Axios
- **UI/UX**: Custom responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd viral-growth-app/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Start the Backend Server

Open a terminal and run:

```bash
cd viral-growth-app/backend
npm start
```

You should see: `Server running on http://localhost:5000`

### Step 3: Start the Frontend (New Terminal)

Open a new terminal and run:

```bash
cd viral-growth-app/frontend
npm start
```

The app will automatically open at `http://localhost:3000`

## How to Use

### 1. Account Insights Tab
- **Add videos**: Enter your video metrics (views, likes, comments, etc.)
- **Get recommendations**: Click "Get Tips" to get AI-powered improvement suggestions
- Track performance over time

### 2. Trends Tab
- Browse trending keywords and hashtags
- See trend scores and growth rates
- Filter by platform (TikTok/Instagram)
- Add custom trends to track

### 3. Script Generator Tab
- Enter your video topic and niche
- Generate multiple hook variations
- Get a full script structure
- Save scripts for later use

### 4. Content Calendar
- Schedule your content uploads
- Plan a full month of content
- Assign scripts to dates
- Track posting status

### 5. Niche Intelligence
- Add niches you want to focus on
- Track keywords in each niche
- Get niche-specific strategies
- Monitor what's trending

### 6. Analytics Dashboard
- View overall performance statistics
- Compare platform performance
- See top-performing videos
- Track key metrics

## API Endpoints

### Videos
- `POST /api/videos` - Add a new video
- `GET /api/videos` - Get all videos
- `GET /api/analytics` - Get analytics summary

### Scripts
- `POST /api/generate-script` - Generate a script
- `GET /api/scripts` - Get all scripts

### Calendar
- `GET /api/calendar` - Get calendar events
- `POST /api/calendar` - Add calendar event

### Trends
- `GET /api/trends/:platform` - Get trends for platform
- `POST /api/trends` - Add a trend

### Niches
- `GET /api/niches` - Get tracked niches
- `POST /api/niches` - Add a niche

## Database Schema

### videos
```
- id (INTEGER PRIMARY KEY)
- title, platform, views, likes, comments, shares
- avg_watch_time, completion_rate, posted_date, created_at
```

### scripts
```
- id, title, niche, hooks, full_script, platform, created_at
```

### calendar
```
- id, date, topic, script_id, platform, status, created_at
```

### trends
```
- id, platform, keyword, trend_score, growth_rate, niche, updated_at
```

### niches
```
- id, name, keywords, tracked, created_at
```

## Troubleshooting

### Frontend won't connect to backend
- Make sure backend is running on port 5000
- Check `.env` file has correct API URL
- Check browser console for errors

### Database not updating
- Check that backend is running
- Try deleting `viral.db` file to reset database
- Check backend terminal for SQL errors

### Port already in use
```bash
# Change backend port in server.js line 7
# Change frontend port with environment variable:
PORT=3001 npm start
```

## Future Enhancements

- [ ] Integrate Claude API for advanced script generation
- [ ] Real TikTok & Instagram API integration
- [ ] Video upload and analysis
- [ ] Real-time trend tracking
- [ ] Competitor analysis
- [ ] Hashtag research & optimization
- [ ] Performance predictions
- [ ] Team collaboration features

## File Structure

```
viral-growth-app/
├── backend/
│   ├── server.js          # Main Express server
│   ├── db.js              # Database setup
│   ├── package.json       # Dependencies
│   └── viral.db           # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Styles
│   │   ├── api.js         # API calls
│   │   └── components/
│   │       ├── AccountInsights.js
│   │       ├── TrendResearch.js
│   │       ├── ScriptGenerator.js
│   │       ├── ContentCalendar.js
│   │       ├── NicheIntelligence.js
│   │       └── Analytics.js
│   ├── .env               # Environment variables
│   └── package.json       # Dependencies
│
└── README.md              # This file
```

## Tips for Success

1. **Consistency**: Post regularly to maintain algorithm favor
2. **Trends**: Always check trending sounds and hashtags before posting
3. **Hooks**: Spend time perfecting your opening hook - it's crucial
4. **Analytics**: Review your metrics weekly and adjust strategy
5. **Niche**: Focus on your niche to build a loyal audience
6. **Engagement**: Respond to comments and engage with other creators

## Support

For issues or questions, check the troubleshooting section above.

---

Built with ❤️ for creators | Made with React & Node.js
