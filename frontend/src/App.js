import React, { useState } from 'react';
import './App.css';
import AccountConnect from './components/AccountConnect';
import Dashboard from './components/Dashboard';

function App() {
  const [accounts, setAccounts] = useState(null);
  const [tiktokUser, setTiktokUser] = useState('');
  const [instaUser, setInstaUser] = useState('');

  const handleAccountLoaded = (data, tikUser, igUser) => {
    setAccounts(data);
    setTiktokUser(tikUser);
    setInstaUser(igUser);
  };

  const handleDisconnect = () => {
    setAccounts(null);
    setTiktokUser('');
    setInstaUser('');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Viral Growth Hub</h1>
          <p>AI-Powered TikTok & Instagram Growth Tool</p>
        </div>
        {accounts && (
          <button
            onClick={handleDisconnect}
            style={{ position: 'absolute', right: '20px', top: '20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
          >
            Switch Account
          </button>
        )}
      </header>

      <main className="app-content" style={{ maxWidth: accounts ? '1200px' : '600px' }}>
        {!accounts ? (
          <AccountConnect onAccountLoaded={handleAccountLoaded} />
        ) : (
          <Dashboard accounts={accounts} tiktokUser={tiktokUser} instaUser={instaUser} />
        )}
      </main>

      <footer className="app-footer">
        <p>Viral Growth Hub — Built for creators 🎬</p>
      </footer>
    </div>
  );
}

export default App;
