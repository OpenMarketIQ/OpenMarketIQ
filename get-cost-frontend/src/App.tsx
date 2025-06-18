import React, { useState } from 'react';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [item, setItem] = useState('');
  const [cost, setCost] = useState<number | null>(null);
  const [citation, setCitation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCost(null);
    setCitation('');
    try {
      // Only support CRA for env variables (no Vite)
      const apiUrl = (window as any).REACT_APP_API_URL;
      if (!apiUrl) throw new Error('API URL is not set in environment variables.');
      const response = await fetch(`${apiUrl}/api/get-cost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, item }),
      });
      if (!response.ok) {
        let msg = 'Failed to fetch cost';
        try {
          const errData = await response.json();
          msg += errData.error ? `: ${errData.error}` : '';
          msg += errData.details ? `\nDetails: ${errData.details}` : '';
          msg += errData.stdout ? `\nOutput: ${errData.stdout}` : '';
        } catch {}
        throw new Error(msg);
      }
      const data = await response.json();
      setCost(data.cost);
      setCitation(data.citation);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="omiq-card">
          <img src={'/OpenMarketIQ Transparent.png'} className="omiq-logo" alt="OpenMarketIQ Logo" />
          <h2 className="omiq-title">Get Item Cost <span className="omiq-sub">(Perplexity API)</span></h2>
          <form onSubmit={handleSubmit} className="omiq-form">
            <input
              type="text"
              placeholder="Enter Perplexity API Key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              required
              className="omiq-input"
            />
            <input
              type="text"
              placeholder="Enter item name"
              value={item}
              onChange={e => setItem(e.target.value)}
              required
              className="omiq-input"
            />
            <button type="submit" disabled={loading} className="omiq-btn">
              {loading ? 'Loading...' : 'Get Cost'}
            </button>
          </form>
          {error && <div className="omiq-alert omiq-alert-error">{error}</div>}
          {cost !== null && (
            <div className="omiq-result-card">
              <div><strong>Cost:</strong> {cost}</div>
              <div><strong>Citation:</strong> <a href={citation} target="_blank" rel="noopener noreferrer">{citation}</a></div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
