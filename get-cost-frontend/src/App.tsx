import React, { useState } from 'react';
import './App.css';

const DOCS_URL = 'https://openmarketiq.github.io/';

const codeExamples = {
  typescript: `fetch('https://api.openmarketiq.org/api/get-cost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: 'YOUR_PERPLEXITY_API_KEY',
      item: 'ITEM_NAME'
    }),
  })
    .then(res => res.json())
    .then(data => console.log(data));`,
  python: `import requests

url = 'https://api.openmarketiq.org/api/get-cost'
payload = {
    'apiKey': 'YOUR_PERPLEXITY_API_KEY',
    'item': 'ITEM_NAME'
}
headers = {'Content-Type': 'application/json'}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
};

function App() {
  const [apiKey, setApiKey] = useState('');
  const [item, setItem] = useState('');
  const [cost, setCost] = useState<number | null>(null);
  const [citation, setCitation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState<'typescript' | 'python'>('typescript');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCost(null);
    setCitation('');
    try {
      const response = await fetch('https://api.openmarketiq.org/api/get-cost', {
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

  // Replace placeholders in code examples
  const code = codeExamples[lang]
    .replace('YOUR_PERPLEXITY_API_KEY', apiKey || 'YOUR_PERPLEXITY_API_KEY')
    .replace('ITEM_NAME', item || 'ITEM_NAME');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="omiq-flex-card">
          <div className="omiq-card omiq-card-main">
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
          <div className="omiq-card omiq-card-snippet">
            <div className="omiq-snippet-header">
              <h3 className="omiq-snippet-title">API Example</h3>
              <div className="omiq-snippet-actions">
                <div className="omiq-snippet-toggle">
                  <button
                    className={lang === 'typescript' ? 'omiq-toggle-btn active' : 'omiq-toggle-btn'}
                    onClick={() => setLang('typescript')}
                    type="button"
                  >TypeScript</button>
                  <button
                    className={lang === 'python' ? 'omiq-toggle-btn active' : 'omiq-toggle-btn'}
                    onClick={() => setLang('python')}
                    type="button"
                  >Python</button>
                </div>
                <a className="omiq-docs-link" href={DOCS_URL} target="_blank" rel="noopener noreferrer">View Docs</a>
                <button className="omiq-copy-btn" onClick={handleCopy} type="button" title="Copy code" aria-label="Copy code">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: 'middle'}}>
                    <rect x="5" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="7.5" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="omiq-copy-btn-text">{copied ? 'Copied!' : ''}</span>
                </button>
              </div>
            </div>
            <pre className="omiq-snippet-pre">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
