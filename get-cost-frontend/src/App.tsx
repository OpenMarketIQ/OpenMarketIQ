import React, { useState } from 'react';
import './App.css';

// Add this above the App function to help TypeScript recognize process.env variables
declare const process: {
  env: {
    REACT_APP_API_URL: string;
  };
};

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
      const apiUrl = process.env.REACT_APP_API_URL;
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
        <h2>Get Item Cost (Perplexity API)</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 320 }}>
          <input
            type="text"
            placeholder="Enter Perplexity API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            required
            style={{ padding: 8, fontSize: 16 }}
          />
          <input
            type="text"
            placeholder="Enter item name"
            value={item}
            onChange={e => setItem(e.target.value)}
            required
            style={{ padding: 8, fontSize: 16 }}
          />
          <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16 }}>
            {loading ? 'Loading...' : 'Get Cost'}
          </button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
        {cost !== null && (
          <div style={{ marginTop: 24 }}>
            <div><strong>Cost:</strong> {cost}</div>
            <div><strong>Citation:</strong> <a href={citation} target="_blank" rel="noopener noreferrer">{citation}</a></div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
