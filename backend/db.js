const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'viral.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables
const initDB = () => {
  db.serialize(() => {
    // Videos table
    db.run(`CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      platform TEXT NOT NULL,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      avg_watch_time INTEGER DEFAULT 0,
      completion_rate REAL DEFAULT 0,
      posted_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Scripts table
    db.run(`CREATE TABLE IF NOT EXISTS scripts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      niche TEXT NOT NULL,
      hooks TEXT,
      full_script TEXT NOT NULL,
      platform TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Calendar table
    db.run(`CREATE TABLE IF NOT EXISTS calendar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      topic TEXT NOT NULL,
      script_id INTEGER,
      platform TEXT,
      status TEXT DEFAULT 'planned',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(script_id) REFERENCES scripts(id)
    )`);

    // Trends table
    db.run(`CREATE TABLE IF NOT EXISTS trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      keyword TEXT NOT NULL,
      trend_score INTEGER,
      growth_rate REAL,
      niche TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Niches table
    db.run(`CREATE TABLE IF NOT EXISTS niches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      keywords TEXT,
      tracked BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Database tables created/verified');
  });
};

initDB();

module.exports = db;
