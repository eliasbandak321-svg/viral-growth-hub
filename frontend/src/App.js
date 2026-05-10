import React, { useState, useEffect } from 'react';
import './App.css';
import AccountInsights from './components/AccountInsights';
import TrendResearch from './components/TrendResearch';
import ScriptGenerator from './components/ScriptGenerator';
import ContentCalendar from './components/ContentCalendar';
import NicheIntelligence from './components/NicheIntelligence';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Viral Growth Hub</h1>
          <p>Master TikTok & Instagram with AI-Powered Tools</p>
        </div>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          📊 Account Insights
        </button>
        <button
          className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          📈 Trends
        </button>
        <button
          className={`tab-btn ${activeTab === 'scripts' ? 'active' : ''}`}
          onClick={() => setActiveTab('scripts')}
        >
          ✍️ Script Generator
        </button>
        <button
          className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button
          className={`tab-btn ${activeTab === 'niche' ? 'active' : ''}`}
          onClick={() => setActiveTab('niche')}
        >
          🎯 Niche Intel
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📉 Analytics
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'insights' && <AccountInsights />}
        {activeTab === 'trends' && <TrendResearch />}
        {activeTab === 'scripts' && <ScriptGenerator />}
        {activeTab === 'calendar' && <ContentCalendar />}
        {activeTab === 'niche' && <NicheIntelligence />}
        {activeTab === 'analytics' && <Analytics />}
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ for creators | Version 1.0</p>
      </footer>
    </div>
  );
}

export default App;
