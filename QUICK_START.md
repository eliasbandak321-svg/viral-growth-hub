# 🚀 Quick Start Guide - Viral Growth Hub

## Step 1: Start the Backend Server

Open a **PowerShell** or **Command Prompt** and run:

```powershell
cd "C:\Users\Tech Zone\Desktop\remotion\viral-growth-app\backend"
npm start
```

You should see:
```
Server running on http://localhost:5000
Connected to SQLite database
Database tables created/verified
```

✅ **Backend is ready!**

---

## Step 2: Start the Frontend (New Terminal)

Open a **new** PowerShell/Command Prompt window and run:

```powershell
cd "C:\Users\Tech Zone\Desktop\remotion\viral-growth-app\frontend"
npm start
```

The React app will automatically open at `http://localhost:3000`

✅ **Frontend is running!**

---

## Step 3: Start Using the App

You now have access to all 6 powerful features:

### 📊 **Account Insights**
- Add your video metrics (views, likes, completion rate, etc.)
- Get AI-powered recommendations on how to improve

### 📈 **Trend Research**
- Discover trending hashtags and keywords
- See growth rates and trend scores
- Track trends by platform (TikTok/Instagram)

### ✍️ **Script Generator**
- Enter your topic and niche
- Generate 5 viral-optimized hook variations
- Get full script structure ready to use

### 📅 **Content Calendar**
- Plan your content month-by-month
- Assign scripts to dates
- Track posting status (planned, filmed, posted)

### 🎯 **Niche Intelligence**
- Track up to 10 niches you're interested in
- Monitor keywords and trends in each niche
- Get niche-specific strategies

### 📉 **Analytics Dashboard**
- View overall performance statistics
- Compare TikTok vs Instagram performance
- See top-performing videos
- Track key growth metrics

---

## Data Flow

```
Browser (React)
    ↓
http://localhost:3000
    ↓
API Calls (Axios)
    ↓
Backend Server
    ↓
http://localhost:5000
    ↓
SQLite Database
    ↓
viral.db (local file)
```

All data is stored locally on your computer in `viral.db`

---

## Tips for First Use

1. **Start with Account Insights**: Add a few test videos to see the dashboard
2. **Explore Trends**: Browse trending hashtags in your niche
3. **Generate Scripts**: Create some sample scripts
4. **Plan Content**: Use the calendar to plan a week of content
5. **Check Analytics**: Watch how metrics change as you add data

---

## Keep Both Servers Running

⚠️ **Important**: You need BOTH servers running at the same time:
- Backend on port 5000
- Frontend on port 3000

If you close one, the app won't work. Keep both terminal windows open!

---

## Troubleshooting

### Problem: "Cannot GET /api/health"
- Make sure backend is running (`npm start` in backend folder)
- Check you're on port 5000

### Problem: Frontend shows "Failed to connect"
- Backend might not be running
- Check backend terminal for errors
- Restart both servers

### Problem: "Port 5000 already in use"
- Another app is using port 5000
- Close other Node.js processes
- Or change PORT in `.env` file

### Problem: Database not saving data
- Check backend terminal for SQL errors
- Try deleting `viral.db` to reset
- Restart backend server

---

## Next Steps

### Coming Soon Features:
- ✨ Claude API integration for advanced script generation
- 🎥 Real TikTok/Instagram API integration
- 📊 Advanced competitor analysis
- 🚀 Performance predictions
- 👥 Team collaboration

### Optional Setup:
Add your Claude API key to generate even better scripts:
1. Go to: https://console.anthropic.com
2. Get your API key
3. Paste it in `backend/.env` file:
   ```
   CLAUDE_API_KEY=sk_your_key_here
   ```

---

## File Locations

- **Backend**: `C:\Users\Tech Zone\Desktop\remotion\viral-growth-app\backend`
- **Frontend**: `C:\Users\Tech Zone\Desktop\remotion\viral-growth-app\frontend`
- **Database**: `C:\Users\Tech Zone\Desktop\remotion\viral-growth-app\backend\viral.db`
- **Documentation**: Read `README.md` for detailed info

---

## Need Help?

Check the `README.md` file for:
- Full API documentation
- Database schema details
- Advanced troubleshooting
- Complete feature descriptions

---

**Happy creating! 🎬 Let's get you viral! 🚀**
