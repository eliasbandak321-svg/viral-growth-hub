import React, { useState, useEffect } from 'react';
import { scriptAPI } from '../api';

const ScriptGenerator = () => {
  const [scripts, setScripts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    niche: '',
    platform: 'tiktok',
  });
  const [generatedScript, setGeneratedScript] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    try {
      const response = await scriptAPI.getScripts();
      setScripts(response.data);
    } catch (error) {
      console.error('Error loading scripts:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const response = await scriptAPI.generateScript(formData);
      setGeneratedScript(response.data);
      setMessage('✅ Script generated successfully!');
      loadScripts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error generating script');
      console.error('Error:', error);
    }
  };

  return (
    <div className="card">
      <h2>✍️ AI Script & Hook Generator</h2>

      {message && <div className={message.includes('✅') ? 'success-message' : 'error-message'}>{message}</div>}

      <div style={{ marginBottom: '30px' }}>
        <h3>Generate Video Script</h3>
        <form onSubmit={handleGenerate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div className="form-group">
              <label>Video Title/Concept</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Morning Routine Tips"
                required
              />
            </div>

            <div className="form-group">
              <label>Niche/Topic</label>
              <input
                type="text"
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                placeholder="e.g., Productivity, Beauty, Fitness"
                required
              />
            </div>

            <div className="form-group">
              <label>Platform</label>
              <select name="platform" value={formData.platform} onChange={handleChange}>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '20px' }}>
            🤖 Generate Script
          </button>
        </form>
      </div>

      {generatedScript && (
        <div style={{ background: '#f0f7ff', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '4px solid #667eea' }}>
          <h3>Generated Script</h3>

          <div style={{ marginBottom: '20px' }}>
            <h4>Hook Options:</h4>
            <div className="grid">
              {generatedScript.hooks?.map((hook, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '2px solid #667eea',
                  }}
                >
                  <p style={{ margin: 0 }}>" {hook} "</p>
                  <button
                    className="btn"
                    style={{ marginTop: '10px', width: '100%', padding: '8px', fontSize: '0.9rem' }}
                  >
                    Use This Hook
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h4>Full Script Structure:</h4>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '0.9rem', color: '#333' }}>
              {generatedScript.fullScript}
            </pre>
            <button
              className="btn"
              style={{ marginTop: '15px', width: '100%' }}
              onClick={() => {
                navigator.clipboard.writeText(generatedScript.fullScript);
                setMessage('✅ Script copied to clipboard!');
                setTimeout(() => setMessage(''), 2000);
              }}
            >
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      <div>
        <h3>Saved Scripts</h3>
        {scripts.length === 0 ? (
          <p style={{ color: '#999' }}>No scripts generated yet. Create one above!</p>
        ) : (
          <div className="grid">
            {scripts.map((script) => (
              <div key={script.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                <h4 style={{ color: '#667eea', marginBottom: '10px' }}>{script.title}</h4>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>
                  <strong>Niche:</strong> {script.niche}
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>
                  <strong>Platform:</strong> {script.platform || 'General'}
                </p>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: '10px 0 0 0', fontStyle: 'italic' }}>
                  {script.full_script?.substring(0, 100)}...
                </p>
                <button
                  className="btn"
                  style={{ marginTop: '15px', width: '100%', padding: '8px' }}
                >
                  View Full Script
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptGenerator;
