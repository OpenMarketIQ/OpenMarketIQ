import React, { useState } from 'react';

const DOCS_URL = 'https://openmarketiq.github.io/OpenMarketIQ/';

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

  // Format code for indentation (for display)
  function formatCode(code: string) {
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={'/OpenMarketIQ Transparent.png'} className="h-8 w-auto" alt="OpenMarketIQ Logo" />
              <span className="text-xl font-bold text-text-primary font-display">OpenMarketIQ</span>
            </div>
            <a 
              href={DOCS_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              Documentation →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-text-primary mb-6 leading-tight">
              Real-Time Market Intelligence
              <span className="block text-primary mt-2">For Everything</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed font-light">
              An open-source initiative providing transparent, accessible pricing data 
              for APIs, tech tools, services, and consumer goods. Empower smarter decisions with real-time market values.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-text-muted">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Open Source</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Real-Time Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Always Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-6">
              What is OpenMarketIQ?
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              OpenMarketIQ is a comprehensive platform that democratizes access to real-time market pricing data. 
              Whether you're evaluating the cost of consumer goods, comparing service pricing, or researching market 
              values for APIs and tech tools, we provide accurate, cited pricing information to help you make informed decisions.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Transparent Pricing</h3>
                <p className="text-text-secondary">
                  Access accurate, real-time market values with full source citations for complete transparency.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Universal Coverage</h3>
                <p className="text-text-secondary">
                  From consumer products to enterprise services, get pricing data for virtually anything.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Lightning Fast</h3>
                <p className="text-text-secondary">
                  Get instant results with our optimized API, designed for speed and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Demo Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
              Try It Now
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Get instant market pricing data using our simple API. Enter your Perplexity API key and search for any item.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* API Request Card */}
            <div className="bg-card border border-border shadow-large rounded-3xl p-8 md:p-10">
              <div className="mb-6">
                <h3 className="text-2xl font-display font-bold text-text-primary mb-2">Get Item Cost</h3>
                <p className="text-text-secondary">Enter your details to fetch real-time pricing information</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Perplexity API Key
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Perplexity API key"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary-light text-text-primary text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., car, laptop, API service"
                    value={item}
                    onChange={e => setItem(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary-light text-text-primary text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-3.5 font-semibold text-base shadow-medium transition-all duration-200 disabled:bg-secondary disabled:text-text-muted disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Fetching...
                    </span>
                  ) : (
                    'Get Cost'
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="whitespace-pre-wrap">{error}</span>
                  </div>
                </div>
              )}

              {cost !== null && (
                <div className="mt-6 bg-success/10 border border-success/20 rounded-xl p-5">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-secondary mb-1">Cost</div>
                        <div className="text-2xl font-bold text-text-primary">${cost.toLocaleString()}</div>
                      </div>
                    </div>
                    {citation && (
                      <div className="pt-3 border-t border-success/20">
                        <div className="text-sm font-medium text-text-secondary mb-2">Source Citation</div>
                        <a 
                          href={citation} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:text-primary-dark hover:underline break-all text-sm flex items-start"
                        >
                          <svg className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {citation}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Code Example Card */}
            <div className="bg-card border border-border shadow-large rounded-3xl p-8 md:p-10 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-display font-bold text-text-primary mb-2">API Example</h3>
                  <p className="text-text-secondary text-sm">Integrate with just a few lines of code</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 bg-secondary-light rounded-lg p-1">
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all outline-none ${
                        lang === 'typescript' 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                      onClick={() => setLang('typescript')}
                      type="button"
                    >
                      TypeScript
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all outline-none ${
                        lang === 'python' 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                      onClick={() => setLang('python')}
                      type="button"
                    >
                      Python
                    </button>
                  </div>
                  <button 
                    className="relative bg-secondary-light hover:bg-primary hover:text-white text-text-secondary rounded-lg p-2 transition-all shadow-sm" 
                    onClick={handleCopy} 
                    type="button" 
                    title="Copy code"
                    aria-label="Copy code"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="7.5" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    {copied && (
                      <span className="absolute -top-2 -right-2 bg-success text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10 animate-pulse">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-text-primary rounded-xl p-6 overflow-auto">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre m-0">
                    <code>{formattedCode}</code>
                  </pre>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <a 
                    className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm transition-colors" 
                    href={DOCS_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Full Documentation
                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary-light/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src={'/OpenMarketIQ Transparent.png'} className="h-6 w-auto" alt="OpenMarketIQ Logo" />
              <span className="text-lg font-semibold text-text-primary">OpenMarketIQ</span>
            </div>
            <div className="text-text-secondary text-sm">
              <p>Open-source • Free • Transparent</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-text-muted text-sm">
            <p>Empowering smarter decisions with real-time market intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;