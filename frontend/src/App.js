import React, { useState } from 'react';
import './App.css';
import AccountInsights from './components/AccountInsights';
import TrendResearch from './components/TrendResearch';
import ScriptGenerator from './components/ScriptGenerator';
import ContentCalendar from './components/ContentCalendar';
import NicheIntelligence from './components/NicheIntelligence';
import Analytics from './components/Analytics';
import LiveTracking from './components/LiveTracking';
import CompetitorTracker from './components/CompetitorTracker';

const tabs = [
  { id: 'live', label: '📡 Live Tracking', isNew: true },
  { id: 'insights', label: '📊 Account Insights' },
  { id: 'trends', label: '📈 Trends' },
  { id: 'scripts', label: '✍️ Script Generator' },
  { id: 'calendar', label: '📅 Calendar' },
  { id: 'niche', label: '🎯 Niche Intel' },
  { id: 'competitors', label: '🕵️ Competitors', isNew: true },
  { id: 'analytics', label: '📉 Analytics' },
];

function App() {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Viral Growth Hub</h1>
          <p>Master TikTok & Instagram with AI-Powered Tools</p>
        </div>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.isNew && (
              <span style={{
                marginLeft: '6px',
                background: '#ff6b35',
                color: 'white',
                fontSize: '0.65rem',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: '700',
              }}>NEW</span>
            )}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {activeTab === 'live' && (
          <div className="card"><LiveTracking /></div>
        )}
        {activeTab === 'insights' && <AccountInsights />}
        {activeTab === 'trends' && <TrendResearch />}
        {activeTab === 'scripts' && <ScriptGenerator />}
        {activeTab === 'calendar' && <ContentCalendar />}
        {activeTab === 'niche' && <NicheIntelligence />}
        {activeTab === 'competitors' && (
          <div className="card"><CompetitorTracker /></div>
        )}
        {activeTab === 'analytics' && <Analytics />}
      </main>

      <footer className="app-footer">
        <p>Built for creators | Viral Growth Hub v2.0</p>
      </footer>
    </div>
  );
}

export default App;
