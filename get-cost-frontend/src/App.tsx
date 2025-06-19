import React, { useState } from 'react';
// Removed './App.css';

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
  python: `import requests\n\nurl = 'https://api.openmarketiq.org/api/get-cost'\npayload = {\n    'apiKey': 'YOUR_PERPLEXITY_API_KEY',\n    'item': 'ITEM_NAME'\n}\nheaders = {'Content-Type': 'application/json'}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`
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

  // Format code for indentation (for display)
  function formatCode(code: string) {
    // Remove leading/trailing whitespace and normalize indentation
    const lines = code.split('\n');
    const minIndent = Math.min(
      ...lines.filter(l => l.trim()).map(l => l.match(/^\s*/)?.[0].length || 0)
    );
    return lines.map(l => l.slice(minIndent)).join('\n');
  }

  const formattedCode = formatCode(code);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans">
      <header className="w-full flex flex-col items-center justify-center py-8 px-2 bg-gradient-to-br from-secondary-light to-secondary">
        <div className="flex flex-col md:flex-row gap-10 md:gap-10 items-start justify-center w-full max-w-5xl">
          {/* Main Card */}
          <div className="bg-card border-2 border-primary shadow-xl rounded-2xl flex flex-col items-center px-8 py-10 min-w-[340px] max-w-[400px] w-full">
            <img src={'/OpenMarketIQ Transparent.png'} className="w-56 mb-5" alt="OpenMarketIQ Logo" />
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-text">Get Item Cost <span className="text-primary text-lg font-normal">(Perplexity API)</span></h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-5">
              <input
                type="text"
                placeholder="Enter Perplexity API Key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-secondary-dark bg-secondary-light text-text text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              <input
                type="text"
                placeholder="Enter item name"
                value={item}
                onChange={e => setItem(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-secondary-dark bg-secondary-light text-text text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white rounded-lg py-3 font-semibold text-lg shadow-md transition hover:bg-primary-dark disabled:bg-secondary disabled:text-secondary-dark disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Get Cost'}
              </button>
            </form>
            {error && <div className="mt-5 px-5 py-3 rounded-lg text-base w-full text-left bg-red-100 text-red-600 border border-red-400">{error}</div>}
            {cost !== null && (
              <div className="mt-6 bg-secondary-light rounded-xl px-5 py-4 text-text w-full text-left shadow border border-secondary-dark text-base">
                <div><strong>Cost:</strong> {cost}</div>
                <div><strong>Citation:</strong> <a href={citation} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{citation}</a></div>
              </div>
            )}
          </div>
          {/* Code Snippet Card */}
          <div className="min-w-[340px] max-w-[400px] w-full bg-[#181c24] text-white border-2 border-text shadow-xl rounded-2xl px-6 py-6 flex flex-col items-stretch">
            <div className="flex items-start justify-between mb-3 gap-2 relative">
              <h3 className="text-lg font-semibold m-0 text-white">API Example</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <button
                    className={`px-3 py-1 rounded-t-md text-base font-medium transition outline-none ${lang === 'typescript' ? 'bg-primary text-white' : 'bg-[#23272f] text-[#b3c0d1] hover:bg-primary hover:text-white'}`}
                    onClick={() => setLang('typescript')}
                    type="button"
                  >TypeScript</button>
                  <button
                    className={`px-3 py-1 rounded-t-md text-base font-medium transition outline-none ${lang === 'python' ? 'bg-primary text-white' : 'bg-[#23272f] text-[#b3c0d1] hover:bg-primary hover:text-white'}`}
                    onClick={() => setLang('python')}
                    type="button"
                  >Python</button>
                </div>
                <a className="text-accent text-base font-medium hover:underline mx-1" href={DOCS_URL} target="_blank" rel="noopener noreferrer">View Docs</a>
                <button className="bg-[#23272f] text-[#b3c0d1] rounded-md px-2 py-1 text-base font-medium transition outline-none min-w-[32px] min-h-[32px] flex items-center justify-center relative shadow hover:bg-primary hover:text-white focus:bg-primary focus:text-white disabled:opacity-70 disabled:cursor-not-allowed" onClick={handleCopy} type="button" title="Copy code" aria-label="Copy code">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: 'middle'}}>
                    <rect x="5" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="7.5" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {copied && (
                    <span className="absolute top-0 right-0 mt-[-10px] mr-[-10px] bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow z-10">Copied!</span>
                  )}
                </button>
              </div>
            </div>
            <pre className="bg-transparent text-white px-2 pt-4 pb-2 rounded-lg overflow-x-auto text-base m-0 font-mono whitespace-pre">
              <code>{formattedCode}</code>
            </pre>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
